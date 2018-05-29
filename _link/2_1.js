(function() {

    "use strict";

    // ====================================================
    // 一覧画面のイベント
    // ====================================================
    // 表示後イベント
    kintone.events.on("app.record.index.show", function(e) {
        console.log("一覧画面の画面表示後に動作します。");
    });

    // インライン編集開始時イベント
    kintone.events.on("app.record.index.edit.show", function(e) {
        console.log("一覧画面のインライン編集開始時に動作します。");
    });

    // フィールド値変更時イベント
    kintone.events.on("app.record.index.edit.change.項目1", function(e) {
        console.log("一覧画面の項目１の値変更時に動作します。");
    });

    // 「保存ボタン」クリック時イベント
    kintone.events.on("app.record.index.edit.submit", function(e) {
        console.log("一覧画面の保存ボタンクリック時に動作します。");
    });

    // 「削除ボタン」クリック時イベント
    kintone.events.on("app.record.index.delete.submit", function(e) {
        console.log("一覧画面の削除ボタンクリック時に動作します。");
    });
})();
