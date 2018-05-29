// 設定値
const FIELD_CODE1 = "レコード番号";
const FIELD_CODE1_NAME = "レコード番号";
const AND_OR = "or"; // 必ず小文字
const FIELD_CODE2 = "CompanyName";
const FIELD_CODE2_NAME = "会社名";

// 一覧表示のタイミングで実行
(function () {
"use strict";
kintone.events.on("app.record.index.show",function (event) {
// GET引数に格納された直前の検索キーワードを取得して再表示する
var result = {};
var query = window.location.search.substring( 7 ); // URL固定部分(?query=)は無視

// クエリ検索条件の区切り記号 (and/or) で分割
var parameters = query.split( AND_OR );

// フィールドコード名と検索キーワードに分割する
for( var i = 0; i < parameters.length; i++ ){
var element = parameters[ i ].split( 'like' );
var paramName = decodeURIComponent( element[ 0 ] );
var paramValue = decodeURIComponent( element[ 1 ] );

// スペースと""をtrimして、文字列だけにしてから、配列に格納
result[ paramName.replace(/^\s+|\s+$/g, "") ] = paramValue.replace(/^[\s|\"]+|[\s|\"]+$/g, "");
}

// 検索キーワードその１
var search_word1 = document.createElement('input');
search_word1.onkeypress = function(e) {
if (e.keyCode && e.keyCode == 13) {
keyword_search();
}
}

if(result[ FIELD_CODE1 ] != undefined){
search_word1.value = result[ FIELD_CODE1 ]; // GET引数に、直前の検索キーワードがあったら格納しておく
}

// 検索キーワードその２
var search_word2 = document.createElement('input');
search_word2.onkeypress = function(e) {
if (e.keyCode && e.keyCode == 13) {
keyword_search();
}
}

if(result[ FIELD_CODE2 ] != undefined){
search_word2.value = result[ FIELD_CODE2 ]; // GET引数に、直前の検索キーワードがあったら格納しておく
}

// 検索ボタン
var search_button = document.createElement('button');
search_button.innerHTML = 'search';
search_button.onclick = function () {
keyword_search();
};

// キーワード検索の関数
function keyword_search(){
var keyword1 = search_word1.value;
var keyword2 = search_word2.value;
var str_query = '?query='+ FIELD_CODE1 +' = "' + keyword1 + '" '+ ' or ' +' '+ FIELD_CODE2 +' like"' + keyword2 + '"';


if(keyword1 == "" && keyword2 == ""){
str_query = "";
}else if(keyword1 != "" && keyword2 == ""){

str_query = '?query='+ FIELD_CODE1 +' = "' + keyword1 + '"'
}else if(keyword1 == "" && keyword2 != ""){

str_query = '?query='+ FIELD_CODE2 +' like "' + keyword2 + '"'
}




//alert(str_query);
// GET変数を使って、検索結果へジャンプ！
document.location = location.origin + location.pathname + str_query
}

// キーワード入力部品を、kintoneヘッダ部分に埋め込む(重複を避けるため、最初に要素をクリアしておく)
var aNode = kintone.app.getHeaderMenuSpaceElement()
for (var i =aNode.childNodes.length-1; i>=0; i--) {
aNode.removeChild(aNode.childNodes[i]);
}
var label = document.createElement('label');
label.appendChild(document.createTextNode(FIELD_CODE1_NAME));
label.appendChild(search_word1);
label.appendChild(document.createTextNode(' '));
label.appendChild(document.createTextNode(FIELD_CODE2_NAME));
label.appendChild(search_word2);
label.appendChild(document.createTextNode(' '));
label.appendChild(search_button);
kintone.app.getHeaderMenuSpaceElement().appendChild(label);

return event;
});

})();