(function() {

    "use strict";

    // =================================================
    // 表示後イベント
    // 単一レコード取得（レコード番号が1のものを取得）
    // =================================================
    kintone.events.on("app.record.index.show", function(e) {
        // アプリID
        var appId = kintone.app.getId();
        // パラメータ配列
        var params = {
            "app": appId,
            "id": 1
        };

        kintone.api(kintone.api.url('/k/v1/record', true), 'GET', params).then(function(resp) {
            // 成功時
            console.log("===== 単一レコード取得 ================= >>> ");
            console.log(JSON.stringify(resp['record']));
        }, function(resp) {
            // エラー時
            if (resp.message !== undefined) {
                console.log(resp.message);
            }
        });
    });

    // =================================================
    // 表示後イベント
    // 複数レコード取得
    // =================================================
    kintone.events.on("app.record.index.show", function(e) {
        // アプリID
        var appId = kintone.app.getId();
        // 抽出条件、並び順
        var queryCondition = kintone.app.getQueryCondition();
        // パラメータ配列
        var params = {
            "app": appId,
            "query": queryCondition
        };
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params).then(function(resp) {
            // 成功時
            console.log("===== 複数レコード取得 ================= >>> ");
            console.log(JSON.stringify(resp['records']));
        }, function(resp) {
            // エラー時
            if (resp.message !== undefined) {
                console.log(resp.message);
            }
        });
    });
})();
