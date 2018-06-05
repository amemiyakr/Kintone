(function() {

    "use strict";

    // 表示後イベント
    kintone.events.on("app.record.index.show", function(e) {
        var records = e.records;
        var listLength = records.length;
        // 現在庫数の要素情報

        //获取 现在库数 整列的信息
        var elStockNum = kintone.app.getFieldElements('現在庫数');
        // 一覧の件数分ループ
        for (var i = 0; i < listLength; i++) {

            //获取列表中的数值 
            var xzks = records[i]['現在庫数']['value'];
            //console.log(xzks);
            // 実在庫数がマイナスの場合、文字を赤くする
             if (Number(xzks) < 0 ) {

                //把整列的文字变为红色
                elStockNum[i].style.color = 'red';
             }
        }
        return e;
    });
})();
