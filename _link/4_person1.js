(function() {

    "use strict";

    // 入力画面系表示イベント
    var eventName = ['app.record.detail.show', 'app.record.edit.show'];
    kintone.events.on(eventName, function(e) {

        var record = e.record;
        // 抽出条件
        var queryString = '会社名 = "' + record['会社名']['value'] + '"';
        // ソート条件
        var orderString = 'order by 担当者氏名 asc';
        // 取得項目
        var fields = [
            "担当者氏名",
            "直通電話番号",
            "FAX番号"
        ];
        // パラメータ
        var param = {
            "app": 27,  // 「4章_担当者」アプリのアプリID
            "query": queryString + ' ' + orderString,     // 検索条件
            "fields": fields
        };

        return kintone.api(
            kintone.api.url('/k/v1/records', true),
            'GET',
            param,
            function(resp) {
                alert(JSON.stringify(resp['records']));
            }
        );
    });
})();
