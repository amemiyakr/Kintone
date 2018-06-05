/*
选择 条件 指定文本框 变值


文中 地域 为 选择文本框  日当 为普通文本框——不可输入状态


详情 kintone アプリ（kintone アプリストア  の「旅費精算申請」を使います） ※該当のアプリは、https://(サブドメイン).cybozu.com/k/#/market/ から追加できます。

参考 ドロップダウンの値を変更して別フィールドの値を変更したり、無効に設定する

里面有详细 关于 旅游清单中 各项文本框的 相关 限制
*/

(function () {

    "use strict";

    // 地域の条件に応じて日当を変更する。
    function ChangeArea(event){
        var record = event.record;
 
        switch (record['地域']['value']){
        case "首都圏":
            record['日当']['value'] = "0";
            record['日当']['disabled'] = true;
            break;
        case "海外":
            record['日当']['value'] = "3000";
            record['日当']['disabled'] = true;
            break;
        case "その他":
            record['日当']['disabled'] = false;
            break;
        default:
            record['日当']['value'] = "1000";
            record['日当']['disabled'] = true;
            break;
        }
        return event;
    }

})();



/*
以下是关于 Switch 函数的 颜色判断写法

for (var i = 0; i < elStatus.length; i++) {
            var record = event.records[i];
            elStatus[i].style.backgroundColor = bgColor;

            switch (record['ステータス']['value']) {
                case "未着手":
                    elStatus[i].style.color = '#ff0000';
                    break;
                case "処理中":
                    elStatus[i].style.color = '#0000ff';
                    break;
                default:
                    elStatus[i].style.color = '#0000ff';
                    break;
            }

*/