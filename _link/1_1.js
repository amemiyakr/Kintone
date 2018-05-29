kintone.api(
kintone.api.url("/k/v1/records", true),
"GET",
{"app": 13},
function(resp) {
    console.log(JSON.stringify(resp));
}, function(e) {
    console.log("error" + e.message);
}
);
