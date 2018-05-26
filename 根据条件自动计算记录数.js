 (function() {
    "use strict";

    // 列表页面
    kintone.events.on('app.record.index.show', function(event) {
        // 现在的搜索条件&获取处理中的记录
        (new KintoneRecordManager).getProcessingRecords(function(records) {
            kintone.app.getHeaderMenuSpaceElement().innerHTML = '商品名为123记录件数：' + records.length;
        });
    });
})();

/**
 * kintone record manager
 */
KintoneRecordManager = (function() {
    KintoneRecordManager.prototype.records = [];

    KintoneRecordManager.prototype.appId = null;

    KintoneRecordManager.prototype.query = '';

    KintoneRecordManager.prototype.limit = 100;

    KintoneRecordManager.prototype.offset = 0;

    function KintoneRecordManager() {
        this.appId = kintone.app.getId();
    }

    // 现在的搜索条件&获取处理中的记录
    KintoneRecordManager.prototype.getProcessingRecords = function(callback) {
        this.appId = kintone.app.getId();
        this.query = kintone.app.getQueryCondition() + ' 商品名 = "123"';
        this.getRecords(callback);
    };

    // 获取记录
    KintoneRecordManager.prototype.getRecords = function(callback) {
        kintone.api('/k/v1/records', 'GET', {
            app: this.appId,
            query: this.query + (' limit ' + this.limit + ' offset ' + this.offset)
        }, (function(_this) {
            return function(res) {
                var len;
                Array.prototype.push.apply(_this.records, res.records);
                len = res.records.length;
                _this.offset += len;
                if (len < _this.limit) {
                    _this.ready = true;
                    if (callback !== null) {
                        callback(_this.records);
                    }
                } else {
                    _this.getRecords(callback);
                }
            };
        })(this));
    };

    return KintoneRecordManager;

})();