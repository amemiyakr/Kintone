
/*
 * Gantt chart display of sample program
 * Copyright (c) 2015 Cybozu
 *
 * Licensed under the MIT License




概述

To Doアプリのレコード一覧をガントチャート形式で表示するサンプルです。

レコード一覧画面で、表示するレコードがある場合にガントチャートを表示します。
優先度フィールドの値に応じてガントチャートの色を変えています。
年月日の表示は、ユーザーの言語設定に応じて変更します。
その他、詳細な仕様はプログラムでご確認ください。



詳細設定から「JavaScript / CSSによるカスタマイズ」を開き、Cybozu CDN から次のライブラリを指定します。

jQuery
https://js.cybozu.com/jquery/2.1.1/jquery.min.js  (version 2.1.1を利用)
jQuery.Gantt
https://js.cybozu.com/jquerygantt/20140623/jquery.fn.gantt.min.js (version 20140623を利用)


jQuery.Gantt
https://js.cybozu.com/jquerygantt/20140623/css/style.css (version 20140623を利用)


根据 指派工作 的 优先度 形成 一览表



 */




/*
CSS文件


.fn-gantt .ganttGray {
    background-color: #d3d3d3;
}
.fn-gantt .ganttGray .fn-label {
    color: #444;
}
.fn-gantt .ganttYellow {
    background-color: #ffff99;
}
.fn-gantt .ganttYellow .fn-label {
    color: #444;
}
.fn-gantt .leftPanel, .fn-gantt .bar{
    z-index: 0;
}



*/
(function() {

    'use strict';

    // Date conversion for Gantt.
    function convertDateTime(str) {
        if (str !== '') {
            return '/Date(' + (new Date(str)).getTime() + ')/';
        }
        return '';
    }

    // To HTML escape
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Record list of events.
    kintone.events.on('app.record.index.show', function(event) {

        var records = event.records;
        var data = [];

        // Don't display when there is no record.
        if (records.length === 0) {
            return;
        }
        var elSpace = kintone.app.getHeaderSpaceElement();

        // Add styles
        elSpace.style.marginLeft = '15px';
        elSpace.style.marginRight = '15px';
        elSpace.style.border = 'solid 1px #ccc';

        // I create an element of Gantt chart.
        var elGantt = document.getElementById('gantt');
        if (elGantt === null) {
            elGantt = document.createElement('div');
            elGantt.id = 'gantt';
            elSpace.appendChild(elGantt);
        }

        // To switch the moon, the day of the week, depending on the login user's Locale.
        var user = kintone.getLoginUser();
        var ganttMonths, ganttDow, ganttWaitmessage = '';
        switch (user['language']) {
            case 'ja':
                ganttMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                ganttDow = ['日', '月', '火', '水', '木', '金', '土'];
                ganttWaitmessage = '表示するまでお待ちください。';
                break;
            case 'zh':
                ganttMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                ganttDow = ['日', '一', '二', '三', '四', '五', '六'];
                ganttWaitmessage = '请等待显示屏';
                break;
            default:
                ganttMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                ganttDow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                ganttWaitmessage = 'Please Wait...';
                break;
        }

        // Set the record.
        for (var i = 0; i < records.length; i++) {

            var colorGantt = 'ganttGray';
            switch (records[i]['Priority']['value']) {
                case 'A':
                    colorGantt = 'ganttRed';
                    break;
                case 'B':
                    colorGantt = 'ganttOrange';
                    break;
                case 'C':
                    colorGantt = 'ganttGreen';
                    break;
                case 'D':
                    colorGantt = 'ganttBlue';
                    break;
                case 'E':
                    colorGantt = 'ganttYellow';
                    break;
                case 'F':
                    colorGantt = 'ganttGray';
                    break;
                default:
                    colorGantt = 'ganttGray';
            }

            var descGantt = '<strong>' + escapeHtml(records[i]['To_Do']['value']) + '</strong>';
            if (records[i]['From']['value']) {
                descGantt += '<br />' + 'From: ' + escapeHtml(records[i]['From']['value']);
            }
            if (records[i]['To']['value']) {
                descGantt += '<br />' + 'To: ' + escapeHtml(records[i]['To']['value']);
            }
            if (records[i]['Priority']['value']) {
                descGantt += '<br />' + escapeHtml(records[i]['Priority']['value']);
            }

            var obj = {
                id: escapeHtml(records[i]['$id']['value']),
                name: escapeHtml(records[i]['To_Do']['value']),
                values: [{
                    from: convertDateTime(records[i]['From']['value']),
                    to: convertDateTime(records[i]['To']['value']),
                    desc: descGantt,
                    label: escapeHtml(records[i]['To_Do']['value']),
                    customClass: escapeHtml(colorGantt)
                }]
            };
            data.push(obj);
        }

        // Set in Gantt object.
        $(elGantt).gantt({
            source: data,
            navigate: 'scroll',
            scale: 'days', // days,weeks,months
            maxScale: 'months',
            minScale: 'days',
            months: ganttMonths,
            dow: ganttDow,
            left: '70px',
            itemsPerPage: 100,
            waitText: ganttWaitmessage,
            scrollToToday: true
        });
    });
})();
