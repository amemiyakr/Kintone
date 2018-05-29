(function() {

    "use strict";

    // 在庫アプリ操作
    var zaikoDao = {};

    var eventName = [                        ,                       ];
    // 追加画面、編集画面の表示後イベント
    kintone.events.on(eventName, function(e) {
        if (e['reuse'] === true) {
            // 再利用の場合は制御項目を初期化
            e.record['制御項目_在庫反映状況']['value'] = '未';
        }
        // 制御項目の非表示
        kintone.app.record.setFieldShown('制御項目_在庫反映状況', false);
        return e;
    });

    // 詳細画面の表示後イベント
    kintone.events.on(                        , function(e) {
        // 制御項目の非表示
        kintone.app.record.setFieldShown('制御項目_在庫反映状況', false);
        // レコード情報取得
        var record = e.record;
        // 在庫反映状況確認
        if (record['制御項目_在庫反映状況']['value'] !== '未') {
            return e;
        }
        // 関連する在庫レコードを取得して在庫数／引当数を更新
        zaikoDao.select(record).then(function(resp) {
            var resultRecord = resp['records'];
            if (resultRecord.length !== 0) {
                // 在庫アプリの該当商品の引当数を更新
                zaikoDao.update(resultRecord[0], record);
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
    zaikoDao.APP_ID = 46;

    // 在庫レコード取得処理
    zaikoDao.select = function(recordInf) {
        // 検索パラメータ
        var params = {
            // 在庫アプリ番号
            
            // 検索条件
            
            // 取得項目
            
        };

        return kintone.api(kintone.api.url('/k/v1/records', true),      , params);
    };

    // 在庫レコード更新処理
    zaikoDao.update = function(zaikoRecordInf, recordInf) {
        // REST APIパラメータ
        var params = {
            // 在庫アプリ番号
            "app": zaikoDao.APP_ID,
            // レコード番号
            
            // リビジョン
            
            // 登録データ
            "record": {
                
                    
                        
                
            }
        };
        // 在庫レコードを更新
        kintone.api(kintone.api.url('/k/v1/record', true),      , params).then(function(resp) {
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
})();
