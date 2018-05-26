(function() {

    "use strict";

    // =================================================
    // レコード削除
    // =================================================
    var eventName = ["app.record.detail.delete.submit", "app.record.index.delete.submit"];
    kintone.events.on(eventName, function(e) {

        var record = e.record;

        // アプリID
        var appId = kintone.app.getId();
        // パラメータ配列
        var params = {
            "app": appId+1,
            "ids": [record['$id']['value']]
        };
        return kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', params).then(function(resp) {
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
