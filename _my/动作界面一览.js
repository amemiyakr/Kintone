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



    // 追加画面のイベント
    // ====================================================
    // 表示後イベント
    // ====================================================
        kintone.events.on("app.record.create.show", function(e) {
        console.log("追加画面の画面表示後に動作します。");
    });

    // フィールド値変更時イベント
    kintone.events.on("app.record.create.change.項目1", function(e) {
        console.log("追加画面の項目1の値変更時に動作します。");
    });

    // 「保存ボタン」クリック時イベント
    kintone.events.on("app.record.create.submit", function(e) {
        console.log("追加画面の保存ボタンクリック時に動作します。");
    });






    // ====================================================
    // 詳細画面のイベント
    // ====================================================
    // 表示後イベント
    kintone.events.on("app.record.detail.show", function(e) {
        console.log("詳細画面の画面表示後に動作します。");
    });

    // プロセス管理のアクションイベント
    kintone.events.on("app.record.detail.process.proceed", function(e) {
        console.log("詳細画面のプロセス遷移時に動作します。");
    });

    // 「削除ボタン」クリック時イベント
    kintone.events.on("app.record.detail.delete.submit", function(e) {
        console.log("詳細画面の削除ボタンクリック時に動作します。");
    });





    // ====================================================
    // 編集画面のイベント
    // ====================================================
    // 表示後イベント
    kintone.events.on("app.record.edit.show", function(e) {
        console.log("編集画面の画面表示後に動作します。");
    });

    // フィールド値変更時イベント
    kintone.events.on("app.record.edit.change.項目1", function(e) {
        console.log("編集画面の項目1の値変更時に動作します。");
    });

    // 「保存ボタン」クリック時イベント
    kintone.events.on("app.record.edit.submit", function(e) {
        console.log("編集画面の保存ボタンクリック時に動作します。");
    });




    // ====================================================
    // グラフ画面のイベント
    // ====================================================
    // 表示後イベント
    kintone.events.on("app.report.show", function(e) {
        console.log("グラフが表示された後に動作します。");
    });

    // ====================================================
    // 複数アクションで動作するイベント
    // ====================================================
    // 追加画面表示後と詳細画面表示後に動作するイベント
    var eventNames = ["app.record.create.show", "app.record.detail.show"];
    kintone.events.on(eventNames, function(e) {
        console.log("追加画面の画面表示後と詳細画面の画面表示後に動作します。");
    });

    
})();
