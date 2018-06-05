(function() {

    "use strict";

    // 在庫アプリ操作
    var zaikoDao = {};
    // 売上アプリ操作
    var uriageDao = {};

    var eventName = ["app.record.create.show", "app.record.edit.show"];
    // 追加画面、編集画面の表示後イベント
    kintone.events.on(eventName, function(e) {
        if (e['reuse'] === true) {
            // 再利用の場合は制御項目を初期化

            // 判断本条记录的 审核 情况
            e.record['制御項目_在庫反映状況']['value'] = '未';
        }
        // 制御項目の非表示
        kintone.app.record.setFieldShown('制御項目_在庫反映状況', false);
        return e;
    });

    // 詳細画面のプロセス管理のアクションイベント
    kintone.events.on("app.record.detail.process.proceed", function(e) {
        if (e['nextStatus']['value'] === '納品済') {
            e['record']['制御項目_在庫反映状況']['value'] = '未';
        }

        return e;
    });

    // 詳細画面の表示後イベント
    kintone.events.on("app.record.detail.show", function(e) {
        // 制御項目の非表示
        kintone.app.record.setFieldShown('制御項目_在庫反映状況', false);
        // レコード情報取得
        var record = e.record;
        // 在庫反映状況確認
        if (record['制御項目_在庫反映状況']['value'] !== '未') {
            return e;
        }
        // 関連する在庫レコードを取得
        zaikoDao.select(record).then(function(resp) {
            var resultRecord = resp['records'];
            if (resultRecord.length !== 0) {
                if (record['ステータス']['value'] === '受注') {
                    // レコード新規登録時
                    // 在庫アプリのレコードを更新（引当数加算）
                    zaikoDao.updateNew(resultRecord, record);
                } else {
                    // 納品時
                    // 在庫アプリのレコードを更新（在庫数、引当数減算）
                    zaikoDao.updateDeli(resultRecord, record);
                    // 売上アプリに商品別の売上レコードを登録
                    uriageDao.insert(record);
                }
            } else {
                alert("在庫レコードの更新に失敗しました。");
            }
        }, function(resp) {
            // 失敗時
            alert("在庫レコードの更新に失敗しました。");
        });

        return e;
    });

    // 「5章_在庫」アプリのアプリ番号
    zaikoDao.APP_ID = 32;

    // 「5章_売上」アプリのアプリ番号
    uriageDao.APP_ID = 33;

    // 在庫レコード取得処理
    zaikoDao.select = function(recordInf) {
        // query文字列作成
        var queryString = [];
        var tableLength = recordInf['商品リスト']['value'].length; //猜测是表单全部记录数！！

        //JavaScript push() 方法
        //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
        queryString.push('商品コード in (');
        for (var i = 0; i < tableLength; i++) {
            if (i !== 0) {
                queryString.push(',');
            }
            queryString.push('"');
            queryString.push(recordInf['商品リスト']['value'][i]['value']['商品コード']['value']);
            queryString.push('"');
        }
        queryString.push(')');

        // 検索パラメータ
        var params = {
            // 在庫アプリ番号
            "app": zaikoDao.APP_ID,
            // 検索条件
            // join() 方法用于把数组中的所有元素放入一个字符串。
            "query": queryString.join(''),
            // 取得項目
            "fields": ['$id', '$revision', '商品コード', '在庫数', '引当数']
        };

        return kintone.api(kintone.api.url('/k/v1/records', true), "GET", params);
    };

    // 在庫レコード更新処理（登録時）
    zaikoDao.updateNew = function(zaikoRecordInf, recordInf) {
        // REST APIパラメータ
        var params = {
            // 在庫アプリ番号
            "app": zaikoDao.APP_ID,
            "records": []
        };
        // 商品数分の情報を生成
        var length = zaikoRecordInf.length;
        for (var i = 0; i < length; i++) {
            // 対象在庫の商品と一致する商品情報を取得

            // 变量“shohinRec” 循环 获取了每条注文商品的“商品コード”的值
            var shohinRec = zaikoDao.getTargetRecord(zaikoRecordInf[i]['商品コード']['value'], recordInf);
            var record = {
                "id": zaikoRecordInf[i]['$id']['value'],
                "revison": zaikoRecordInf[i]['$revision']['value'],
                "record": {
                    "引当数": {
                        "value": Number(zaikoRecordInf[i]['引当数']['value']) +
                            Number(shohinRec['数量']['value'])
                    }
                }
            };
            params.records.push(record);
        }

        // 在庫レコードを更新
        kintone.api(kintone.api.url('/k/v1/records', true), "PUT", params).then(function(resp) {
            // 成功時
            // 制御項目_在庫反映状況の更新
            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
                "app": kintone.app.getId(),
                "id": recordInf['$id']['value'],
                "record": {
                    "制御項目_在庫反映状況": {
                        "value": '済'
                    }
                }
            }, function(resp2) {
                // 成功時
                // 画面リフレッシュ
                location.reload();
            }, function(resp2) {
                // 失敗時
                alert("制御項目_在庫反映状況の更新に失敗しました。");
            });
        }, function(resp) {
            // 失敗時
            alert("在庫レコードの更新に失敗しました。");
        });
    };

    // 在庫レコード更新処理（納品時）
    zaikoDao.updateDeli = function(zaikoRecordInf, recordInf) {
        // REST APIパラメータ
        var params = {
            // 在庫アプリ番号
            "app": zaikoDao.APP_ID,
            "records": []
        };
        // 商品数分の情報を生成
        var length = zaikoRecordInf.length;
        for (var i = 0; i < length; i++) {
            // 対象在庫の商品と一致する商品情報を取得

            // 变量“shohinRec” 循环 获取了每条注文商品的“商品コード”的值。 zaikoRecordInf获取的是 在库 中的记录！！
            // 猜测获取的是 在库 中的记录 “商品コード” 参数值 对应到 recordInf获取 注文 记录中 表格 记录中的 数量 一值，匹配则提出来。
            var shohinRec = zaikoDao.getTargetRecord(zaikoRecordInf[i]['商品コード']['value'], recordInf);
            var record = {
                "id": zaikoRecordInf[i]['$id']['value'],
                "revison": zaikoRecordInf[i]['$revision']['value'],
                "record": {
                    "引当数": {
                        "value": Number(zaikoRecordInf[i]['引当数']['value']) -
                            Number(shohinRec['数量']['value'])
                    },
                    "在庫数": {
                        "value": Number(zaikoRecordInf[i]['在庫数']['value']) -
                            Number(shohinRec['数量']['value'])
                    }
                }
            };
            params.records.push(record);
        }

        // 在庫レコードを更新
        kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', params).then(function(resp) {
            // 成功時
            // 制御項目_在庫反映状況の更新
            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
                "app": kintone.app.getId(),
                "id": recordInf['$id']['value'],
                "record": {
                    "制御項目_在庫反映状況": {
                        "value": '済'
                    }
                }
            }, function(resp2) {
                // 成功時
                // 画面リフレッシュ
                location.reload();
            }, function(resp2) {
                // 失敗時
                alert("制御項目_在庫反映状況の更新に失敗しました。");
            });
        }, function(resp) {
            // 失敗時
            alert("在庫レコードの更新に失敗しました。");
        });
    };

    // 対象在庫の商品と一致する商品情報を取得
    zaikoDao.getTargetRecord = function(shohinCd, recordInf) {
        var length = recordInf['商品リスト']['value'].length;
        var result;
        for (var i = 0; i < length; i++) {
            if (recordInf['商品リスト']['value'][i]['value']['商品コード']['value'] === shohinCd) {
                result = recordInf['商品リスト']['value'][i]['value'];
            }
        }
        return result;
    };

    // 売上レコード登録処理
    uriageDao.insert = function(recordInf) {
        // REST APIパラメータ
        var params = {
            // 売上アプリ番号
            "app": uriageDao.APP_ID,
            // 登録データ
            "records": []
        };
        // 当日日付
        var nowDate = new Date();
        // 商品数分の情報を生成

        // 254 行 意思是 在 注文 应用中提取本条记录中的 多项表单中的逐条数据 格式。 其中 【i】是循环参数。
        var length = recordInf['商品リスト']['value'].length;
        for (var i = 0; i < length; i++) {
            var record = {
                "売上日": {
                    "value": nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
                },
                "注文番号": {
                    "value": recordInf['注文番号']['value']
                },
                "商品コード": {
                    "value": recordInf['商品リスト']['value'][i]['value']['商品コード']['value']
                },
                "商品名": {
                    "value": recordInf['商品リスト']['value'][i]['value']['商品名']['value']
                },
                "売上金額": {
                    "value": recordInf['商品リスト']['value'][i]['value']['小計金額']['value']
                }
            };
            params.records.push(record);
        }
        // 売上レコードを登録
        kintone.api(kintone.api.url('/k/v1/records', true), 'POST', params).then(function(resp) {
            // 成功時
        }, function(resp) {
            // 失敗時
            alert("売上レコードの登録に失敗しました。");
        });
    };
})();
