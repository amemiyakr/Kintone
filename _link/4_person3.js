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
                var listSpace = kintone.app.record.getSpaceElement('PersonList');
                var records = resp['records'];
                var listLength = records.length;
                var table = [];
                table.push('<table border="1" rules="all"');
                table.push('<thead>');
                table.push('<tr>');
                table.push('<th style="width: 150px;">担当者氏名</th>');
                table.push('<th style="width: 150px;">直通電話番号</th>');
                table.push('<th style="width: 150px;">FAX番号</th>');
                table.push('</tr>');
                table.push('</thead>');
                table.push('<tbody>');
                for (var i = 0; i < listLength; i++) {
                    table.push('<tr>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['担当者氏名']['value'] + '</td>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['直通電話番号']['value'] + '</td>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['FAX番号']['value'] + '</td>');
                    table.push('</tr>');
                }
                table.push('</tbody>');
                table.push('</table>');

                listSpace.innerHTML = table.join('');
            }
        );
    });
})();
