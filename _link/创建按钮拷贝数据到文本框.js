(function() {

    "use strict";

    var eventName = ["app.record.create.show", "app.record.edit.show"];
    kintone.events.on(eventName, function(e) {
        // STEP1
        // HTMLボタン要素生成
        var btnCopy = document.createElement('button');
        // ボタン識別ID
        btnCopy.id = 'btnCopy';
        // ボタン名
        btnCopy.innerHTML = '請求先にコピー';
        // ボタンタイプ
        btnCopy.type = 'button';
        // ボタンクリックイベント
        btnCopy.onclick = function() {
            // レコード情報の取得
            var record = kintone.app.record.get();
            // フィールドに値を設定
            record['record']['郵便番号_請求先']['value'] = record['record']['郵便番号']['value'];
            record['record']['都道府県_請求先']['value'] = record['record']['都道府県']['value'];
            record['record']['市区町村_請求先']['value'] = record['record']['市区町村']['value'];
            record['record']['町域名_請求先']['value'] = record['record']['町域名']['value'];
            // 変更したレコード情報を反映
            kintone.app.record.set(record);
        };
        // ヘッダースペースにボタン要素を追加
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(btnCopy);
    });


    // ====================================================

    // 创建按钮 拷贝数据 外加附加值 到指定文本框
    

    // ====================================================

    var eventName = ["app.record.create.show", "app.record.edit.show"];
    kintone.events.on(eventName, function(e) {
        // STEP1
        // HTMLボタン要素生成
        var btnCopy = document.createElement('button');
        // ボタン識別ID
        btnCopy.id = 'btnCopy';
        // ボタン名
        btnCopy.innerHTML = '請求先にコピー';
        // ボタンタイプ
        btnCopy.type = 'button';
        // ボタンクリックイベント
        btnCopy.onclick = function() {
            // レコード情報の取得
            var record = kintone.app.record.get();
            // フィールドに値を設定
            record['record']['郵便番号_請求先']['value'] = record['record']['郵便番号']['value'];
            record['record']['都道府県_請求先']['value'] = record['record']['都道府県']['value'];
            record['record']['市区町村_請求先']['value'] = record['record']['市区町村']['value'];
            record['record']['町域名_請求先']['value'] = record['record']['町域名']['value'];
            // 変更したレコード情報を反映
            kintone.app.record.set(record);
        };
        // ヘッダースペースにボタン要素を追加
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(btnCopy);
        // STEP2
        // HTMLボタン要素生成
        var btnCopyEx = document.createElement('button');
        // ボタン識別ID
        btnCopyEx.id = 'btnCopyEx';
        // ボタン名
        btnCopyEx.innerHTML = '請求先にコピー【要確認】';
        // ボタンタイプ
        btnCopyEx.type = 'button';
        // ボタンクリックイベント
        btnCopyEx.onclick = function() {
            // レコード情報の取得
            var record = kintone.app.record.get();
            // フィールドに値を設定
            var val0 = record['record']['郵便番号']['value'];
            var val1 = record['record']['都道府県']['value'];
            var val2 = record['record']['市区町村']['value'];
            var val3 = record['record']['町域名']['value'];
            if (val0 !== undefined) {
                record['record']['郵便番号_請求先']['value'] = val0 + '【要確認】';
            }
            if (val1 !== undefined) {
                record['record']['都道府県_請求先']['value'] = val1 + '【要確認】';
            }
            if (val2 !== undefined) {
                record['record']['市区町村_請求先']['value'] = val2 + '【要確認】';
            }
            if (val3 !== undefined) {
                record['record']['町域名_請求先']['value'] = val3 + '【要確認】';
            }
            // 変更したレコード情報を反映
            kintone.app.record.set(record);
        };
        // ヘッダースペースにボタン要素を追加
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(btnCopyEx);
    });



})();
