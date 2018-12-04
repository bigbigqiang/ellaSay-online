/*
* 强  2018/5/23
* */
$(function(){
    var baseUrl = 'http://118.31.171.207:9000/rest';
    //var baseUrl = 'https://api.ellabook.cn/rest';
    var page = {
        baseUrl:baseUrl,
        jsonUrl: baseUrl+'/api/service',
        shareImg:'',
        shareTitle: '【咿啦说】第23期 “一套绘本，串起几代人的童年回忆” ',
        shareDesc: '',
        flag: true,
        isInApp:false,
        mobileType:'',
        uid:'',
        termCode:23,
        reserved: false,
        $:{
            el_alert:$('.el-alert'),
            el_alert_1:$('.el-alert-1'),
            title_btn:$('.els-title-btn')
        },

        init: function () {
            var w = this;
            w.initEvent();
            w.Weixinshare();
        },
        toast: function (text) {
            var el_toast = $('.el-toast');
            el_toast.text(text);
            el_toast.fadeIn();
            setTimeout(function () {
                el_toast.fadeOut();
            }, 2000);
        },
        alert: function () {
            var w = this;
            w.$.el_alert.fadeIn();
        },
        alert1: function () {
            var w = this;
            w.$.el_alert_1.fadeIn();
        },
        hideAlert:function(){
            var w = this;
            w.$.el_alert.fadeOut();
        },
        hideAlert1:function(){
            var w = this;
            w.$.el_alert_1.fadeOut();
        },
        initEvent: function () {
            var w = this;
            $("#loader").fadeOut(1000);
            w.systemCheck();
            if(w.isInApp){
                $('.els-download-app').hide();
                $('.els-history-item').click(function () {
                    window.location.href = './ellaSay.'+$(this).attr('id')+'.html';
                })
            }else {
                $('.els-share-btn').hide()
                $('.els-history-item').click(function () {
                    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook';
                })
            }
            w.uid = w.getQueryString('uid')||'';
            w.checkInsertEllaTallRecord();
            $('.els-close').click(function(){
                w.hideAlert()
            })
            $('.els-close-1').click(function(){
                w.hideAlert1()
            })
            $('.els-alert-btn-1').click(function(){
                w.hideAlert1()
            })
            var clipboard = new ClipboardJS('.btn');
            clipboard.on('success', function(e) {
                w.toast('微信号复制成功，去添加吧！');
                w.$.title_btn.text('预约成功');
                e.clearSelection();
            });
            $('.els-share-btn').click(function(){
                w.appShare(window.location.href)
            })
        },
        getQueryString:function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /*
        * 强  2018/5/17
        * 获取微信sdk初始化参数信息
        * */

        Weixinshare: function () {
            var w = this;
            var Url = window.location.href;
            $.ajax({
                type: 'GET',
                dataType: 'json',
                data:{
                    weixinurl: Url
                },
                url: w.baseUrl + '/wxshare/Weixinshare',
                success: function (data) {
                    console.log(data);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wxca187025bd70cab8', // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名，见附录1
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function () {
                        var shareMessage={
                            title: w.shareTitle, // 分享标题
                            link: Url, // 分享链接
                            desc:w.shareDesc,
                            imgUrl: w.shareImg, // 分享图标
                            trigger: function (res) {
                                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                                //toast('用户点击发送给朋友');
                            },
                            success: function (res) {

                            },
                            cancel: function (res) {

                            },
                            fail: function (res) {
                                //toast(JSON.stringify(res));
                            }
                        };
                        wx.ready(function(){
                            wx.onMenuShareAppMessage (shareMessage);
                            wx.onMenuShareTimeline(shareMessage);
                            wx.onMenuShareQQ(shareMessage);
                            wx.onMenuShareQZone(shareMessage);
                        });
                    });
                }
            })
        },
        /*
        * 强  2018/5/17
        *
        * */
        insertEllaTallRecord: function () {
            var w = this;
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: w.jsonUrl,
                data: {
                    method: 'ella.book.insertEllaTallRecord',
                    content: JSON.stringify({
                        uid: w.uid,
                        termCode: w.termCode
                    })
                },
                complete: function(){
                    setTimeout(function () {
                        w.flag = true;
                    }, 1000);
                },
                success: function (data) {
                    if (data.status == "1") {
                        w.alert()
                    } else if (data.status == "0"&&data.message == "该用户已经预约"){
                        w.$.title_btn.text('预约成功')
                        w.alert1()
                    }else {
                        w.toast(data.message);
                    }
                }
            })
        },
        //app分享函数，直接向App传递分享相关信息，再由app拉起分享
        appShare: function (url) {
            var w = this;
            if (w.mobileType == "iPhone") {
                window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(url.split('?')[0] + '?shareUrl=' + url.split('?')[0] + '&shareType=SS201809101515423452&isShare=1')));
            }else if(w.mobileType == "Android"){
                window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(url.split('?')[0] + '?shareUrl=' + url.split('?')[0] + '&shareType=SS201809101515423452&isShare=1')));
            }
        },
        checkInsertEllaTallRecord: function () {
            var w = this;
            if (w.isInApp) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: w.jsonUrl,
                    data: {
                        method: 'ella.book.checkInsertEllaTallRecord',
                        content: JSON.stringify({
                            uid: w.uid,
                            termCode: w.termCode
                        })
                    },
                    success: function (data) {
                        if (data.message == '该用户已经预约') {
                            w.$.title_btn.text('预约成功')
                            w.reserved = true
                            w.$.title_btn.click(function(){
                                w.alert1();
                            });
                        } else {
                            w.$.title_btn.text('免费预约')
                            w.$.title_btn.click(function(){
                                w.insertEllaTallRecord()
                            });
                        }
                    }
                })
            } else {
                w.$.title_btn.click(function(){
                    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook';
                });
            }
        },
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