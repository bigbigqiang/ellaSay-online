$(function(){
    var page = {
        mobileType:'',
        isInApp: false,
        $:{
            shareBtn:$('.els-title-btn')
        },
        init: function () {
            $("#loader").fadeOut(1000);
            var w = this;
            w.systemCheck();
            if(!w.isInApp){
                w.$.shareBtn.hide();
            }else {
                w.$.shareBtn.click(function(){
                    w.appShare(window.location.href)
                });
            }
            var clipboard = new ClipboardJS('.btn');
            clipboard.on('success', function(e) {
                w.toast('微信号复制成功，去添加吧！');
                e.clearSelection();
            });
            // clipboard.on('error', function(e) {
            //     w.toast('');
            // });
        },
        toast: function (text) {
            var el_toast = $('.el-toast');
            el_toast.text(text);
            el_toast.fadeIn();
            setTimeout(function () {
                el_toast.fadeOut();
            }, 2000);
        },
        //app分享函数，直接向App传递分享相关信息，再由app拉起分享
        appShare: function (url) {
            var w = this;
            if (w.mobileType == "iPhone") {
                window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(url + '?shareUrl=' + url + '&shareType=SS201809101515423452&isShare=1')));
            }else if(w.mobileType == "Android"){
                window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(url + '?shareUrl=' + url + '&shareType=SS201809101515423452&isShare=1')));
            }
        },
        //手机系统类型判断，主要判断   安卓  还是   IOS
        systemCheck: function () {
            var w = this;
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                console.log("iPhone")
                if(!!window.webkit && !!window.webkit.messageHandlers && !!window.webkit.messageHandlers.showSharePop){
                    w.isInApp = true;
                }
                w.mobileType = "iPhone";
            } else if (/(Android)/i.test(navigator.userAgent)) {
                console.log("Android");
                if(!!window.WebView && !!window.WebView.showSharePop){
                    w.isInApp = true;
                }
                w.mobileType = "Android";
            } else {
                console.log("pc");
                w.isInApp = false;
                w.mobileType = "pc";
            }
        }
    };
    page.init();
});