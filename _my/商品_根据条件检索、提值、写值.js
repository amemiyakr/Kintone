(function() {

    "use strict";

    // 在庫アプリ操作
    var zaikoDao = {};

    // 詳細画面の表示後イベント
    kintone.events.on("app.record.detail.show", function(e) {
        // レコード情報取得
        var record = e.record;
        // 在庫レコードが存在するか確認
        //console.log(record);
        zaikoDao.exist(record).then(function(resp) {
            var resultRecord = resp['records'];
            console.log(resultRecord);
            if (resultRecord.length === 0) {
                // 在庫アプリにレコードを登録
                zaikoDao.insert(record);
            }
        }, function(resp) {
            // 失敗時
            alert("在庫レコードの登録に失敗しました。");
        });

        return e;
    });

    // 「5章_在庫」アプリのアプリ番号
    zaikoDao.APP_ID = 32;

    // 在庫レコード存在確認処理
    zaikoDao.exist = function(recordInf) {

        // 検索パラメータ
        var params = {
            "app": 32,  // 在庫アプリ番号
            //"商品コード": { "value": record['商品コード']['value'] },
            //"商品コード": 1,
            //"query": JString, // 検索条件
            //"id": record['$id']['value'],
            //"id": 1,
            //"query":'商品名 = 123',
            //"query": queryString,
            "query": '商品コード = "' + recordInf['商品コード']['value'] + '"',     // 検索条件
            //"query": '商品コード = "ks451"',     // 検索条件

            // 取得項目
            "fields": ['$id', '$revision']
        };

        return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params);
        //return kintone.api(kintone.api.url('/k/v1/records', true),'PUT', params);
    };

    // 在庫レコード登録処理
    zaikoDao.insert = function(recordInf) {
        // REST APIパラメータ

        var params = {
            // 在庫アプリ番号
            "app": zaikoDao.APP_ID,
            // 登録データ
            "record": {
                "商品コード": { "value": recordInf['商品コード']['value'] },
                "商品名": { "value": recordInf['商品名']['value'] },
                "引当数": { "value": '0' },
                "在庫数": { "value": '0' }
            }
        };
        // 在庫レコードを登録
        kintone.api(kintone.api.url('/k/v1/record', true), 'POST', params).then(function(resp) {
            // 成功時
        }, function(resp) {
            // 失敗時
            alert("在庫レコードの登録に失敗しました。");
        });
    };
})();
