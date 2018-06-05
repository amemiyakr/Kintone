/*
 * 障害対応管理アプリのサンプルプログラム
 * Copyright (c) 2014 Cybozu
 * 
 * Licensed under the MIT License
 


概要

アプリのプロセスを「完了」にすると、作業を完了した日、担当者（ログインユーザー）を記録するカスタマイズサンプルです。 その他、次の機能も搭載しています。

レコード登録時に自動採番を設定する
作業完了日フィールドと担当者フィールドを入力不可にする
レコード再利用時には、作業完了日と担当者をクリアにする


https://js.cybozu.com/momentjs/2.8.4/moment-with-locales.min.js (version 2.8.4 を利用)




以下动作
イベントハンドラーを登録する
レコード追加画面が表示された時のイベント
レコード編集画面が表示された時のイベント
レコード追加画面の保存実行前イベント
レコード編集画面の保存実行前イベント
レコード一覧画面の「保存ボタン」クリック時イベント
URL を取得する（クエリ文字列無し）
プロセス管理のアクション実行イベント



一个工作流完成后 自动记录 完成人员 的相关信息。

即 审核 等于 ~~的时候，自动记录 人员的相关信息

 */

(function () {
    "use strict";
                
    // レコード登録/編集画面の表示時
    var eventsCreateShow = ['app.record.create.show', 'app.record.index.create.show',
                            'app.record.edit.show', 'app.record.index.edit.show'];
    kintone.events.on(eventsCreateShow, function(event){
        var record = event.record;
        
        // 編集不可フィールドの設定
        record['受付番号']['disabled'] = true;
        record['作業完了']['disabled'] = true;
        record['担当者']['disabled'] = true;

        switch (event.type){
        case 'app.record.create.show':
        case 'app.record.index.create.show':
            record['受付番号']['value'] = "";
            // 本日から2日後を指定
            record['作業期限']['value'] = moment().add("days", 2).format("YYYY-MM-DD");
            record['作業完了']['value'] = null;
            record['担当者']['value'] = [];
            break;

        default:
            break;
        }

        return event;
    });
    
    // レコード登録画面の保存時
    var eventsSubmit = ['app.record.create.submit','app.record.edit.submit',
                        'app.record.index.edit.submit'];
    kintone.events.on(eventsSubmit, function(event){
        var record = event.record;
        
        // 「受付番号」に「CD-YYMM-XXXX」の形式で自動採番する
        if(!record['受付番号']['value']){
            
            var recId = 1;
            // レコード番号の最大値を取得する
            var appId = kintone.app.getId();
            // URLを設定する
            var appUrl = kintone.api.url('/k/v1/records',true) + '?app='+ appId + '&query=' + encodeURI('order by レコード番号 desc limit 1');
            var xmlHttp;

            // レコード番号の最大値を利用するため、同期リクエストを行う
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
     
            if (xmlHttp.status == 200){
                if(window.JSON){
                    var obj = JSON.parse(xmlHttp.responseText);
                    if (obj.records[0] != null){
                        try{
                            recId = parseInt(obj.records[0]['$id']['value']) +1;
                        } catch(e){
                            event.error = '受付番号が取得できません。';
                        }
                    }
                    //自動採番を設定する
                    var r4 = zeroformat(recId,4);
                    var m = moment();
                    var shipmentNo = "CD" + m.format("YY") + m.format("MM") + "-" + r4;
                    record['受付番号']['value'] = shipmentNo;

                } else{
                    event.error = xmlHttp.statusText;
                }
            } else{
                record.error = '受付番号が取得できません。';
            }
        }
        return event;
    });
    
    // プロセス管理アクション実行時
    kintone.events.on(["app.record.detail.process.proceed"], function(event){
        var record = event.record;
        var nStatus = event.nextStatus.value;
        
        // ステータスが「完了」の場合、作業完了日と担当者を設定する
        switch(nStatus){
            case "完了":
                var user = kintone.getLoginUser();
                record['作業完了']['value'] = moment().format("YYYY-MM-DDTHH:mmZ");
                record['担当者']['value'][0] = {code : user.code};
                break;
        }
        return event;
    });
    
    // 桁合わせ関数
    function zeroformat(v, n) {
        var vl = String(v).length;
        if(n > vl) {
            return (new Array((n - vl) + 1).join(0)) + v;
        } else {
            return v;
        }
    }

})();
