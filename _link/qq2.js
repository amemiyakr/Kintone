(function() {

    "use strict";

    // 入力画面系表示イベント
    var eventName = ['app.record.detail.show', 'app.record.edit.show'];
    kintone.events.on(eventName, function(e) {

        var record = e.record;
        // 取得項目
        var fields = [
            "商品コード",
            "商品名",
            "現在庫数"
        ];
        // パラメータ
        var param = {
            "app": 32, 
            "query": '商品コード = "' + record['商品コード']['value'] + '"',     // 検索条件
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
                table.push('<th style="width: 150px;">商品コード</th>');
                table.push('<th style="width: 150px;">商品名</th>');
                table.push('<th style="width: 150px;">現在庫数</th>');
                table.push('</tr>');
                table.push('</thead>');
                table.push('<tbody>');
                for (var i = 0; i < listLength; i++) {
                    table.push('<tr>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['商品コード']['value'] + '</td>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['商品名']['value'] + '</td>');
                    table.push('<td style="padding-left: 5px;">' + records[i]['現在庫数']['value'] + '</td>');
                    table.push('</tr>');
                }
                table.push('</tbody>');
                table.push('</table>');

                listSpace.innerHTML = table.join('');
            }
        );
    });
})();
