(function() {

    "use strict";

    // =================================================
    // レコード更新
    // =================================================
    kintone.events.on("app.record.edit.submit", function(e) {

        var record = e.record;

        // アプリID
        var appId = kintone.app.getId();
        // パラメータ配列
        var params = {
            "app": appId+1,
            "id": record['$id']['value'],
            "record": {
                "項目1": { "value": record['項目1']['value'] },
                "項目2": { "value": record['項目2']['value'] },
                "項目3": { "value": record['項目3']['value'] }
            }
        };
        return kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params).then(function(resp) {
            // 成功時
            return e;
        }, function(resp) {
            // エラー時
            if (resp.message !== undefined) {
                console.log(resp.message);
            }
            e.error = "エラーが発生しました！";
            return e;
        });
    });
})();
