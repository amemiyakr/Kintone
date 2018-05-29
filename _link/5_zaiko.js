(function() {

    "use strict";

    // 表示後イベント
    kintone.events.on("app.record.index.show", function(e) {
        var records = e.records;
        var listLength = records.length;
        // 現在庫数の要素情報
        var elStockNum = kintone.app.getFieldElements('現在庫数');
        // 一覧の件数分ループ
        for (var i = 0; i < listLength; i++) {
            // 実在庫数がマイナスの場合、文字を赤くする
             
                 
            }
        }
        return e;
    });
})();
