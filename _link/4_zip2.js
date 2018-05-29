(function() {

    "use strict";

    var eventName = [
        "app.record.create.change.郵便番号",
        "app.record.edit.change.郵便番号"
    ];

    // 詳細画面
    kintone.events.on(eventName, function(e) {
        var url = 'http://api.zipaddress.net/?zipcode=' + e.record['郵便番号']['value'];
        // 外部API呼出
        kintone.proxy(url, 'GET', {}, {}).then(function(resp) {
            // 成功時
            // JSON文字列をJSONオブジェクトに変換
            var obj = JSON.parse(resp[0]);
            if (obj['code'] === 200) {
                // ステータス正常時
                var record = kintone.app.record.get();
                record['record']['都道府県']['value'] = obj['data']['pref'];
                record['record']['市区町村']['value'] = obj['data']['city'];
                record['record']['町域名']['value'] = obj['data']['town'];
                kintone.app.record.set(record);
            } else {
                // ステータス異常時
                alert(obj['code'] + '：' + obj['message']);
            }
        }, function(resp) {
            // 失敗時
            alert("住所の検索に失敗しました。");
        });
        return e;
    });

    // 一覧画面
    kintone.events.on("app.record.index.edit.change.郵便番号", function(e) {
        var record = e.record;
        var url = 'https://api.zipaddress.net/?zipcode=' + e.record['郵便番号']['value'];
        // 外部API呼出(同期通信)
        $.ajax({
            "url": url,
            "dataType": 'json',
            "async": false,
            "success": function(resp) {
                if (resp['code'] === 200) {
                    // ステータス正常時
                    record['都道府県']['value'] = resp['data']['pref'];
                    record['市区町村']['value'] = resp['data']['city'];
                    record['町域名']['value'] = resp['data']['town'];
                } else {
                    // ステータス異常時
                    alert(resp['code'] + '：' + resp['message']);
                }
            },
            "error": function(resp) {
                // 失敗時
                alert("住所の検索に失敗しました。");
            }
        });
        return e;
    });
})();
