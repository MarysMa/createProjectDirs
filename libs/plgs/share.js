function getAppUrl(cb) {
    $.ajax({
        url: "http://pay.t.wx.517lppz.com/lppz/getJsApiParams2",
        /*微信后台url*/
        data: {
            "url": location.href.split('#')[0]
        },
        type: 'get',
        dataType: 'jsonp',
        success: function(dataJson) {
            cb && cb(dataJson);
        }
    });
}


getAppUrl(setWeiXinShare);

function setWeiXinShare(wxData) {
    wx.config({
        debug: false,
        appId: wxData.appId,
        timestamp: wxData.timestamp,
        nonceStr: wxData.nonceStr,
        signature: wxData.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
}

wx.ready(function() {
    setShareContent();
});

function setShareContent(opt) {
    var default_opt = {
        toLink: 'http://zhongqiuh5.lppz.com/test/fullmoon20170821_v15/index.html',
        logoLink: '',
        shareTitle: 'test1',
        shareDesc: 'test1'
    }
    var toLink = opt.toLink ? opt.toLink : window.location.href,
        logoLink = opt.logoLink ? opt.logoLink : default_opt.logoLink,
        shareTitle = opt.shareTitle ? opt.shareTitle : default_opt.shareTitle, //分享标题
        shareDesc = opt.shareDesc ? opt.shareDesc : default_opt.shareDesc; //分享内容

    var shareMessageData = {
        title: shareTitle,
        desc: shareDesc,
        link: toLink,
        imgUrl: logoLink,
        trigger: function(res) {
            //alert('用户点击发送给朋友');
        },
        success: function(res) {
            // alert('您已分享给朋友');
            // $('#shareCover').fadeOut();
            //addShareLog();
        },
        cancel: function(res) {
            //alert('已取消');
        },
        fail: function(res) {
            //alert(JSON.stringify(res));
        }
    }

    var shareTimelineData = {
        title: shareTitle,
        link: toLink,
        imgUrl: logoLink,
        trigger: function(res) {
            //alert('用户点击发送给朋友');
        },
        success: function(res) {
            // alert('您已分享给朋友');
            // $('#shareCover').fadeOut();
            //addShareLog();
        },
        cancel: function(res) {
            //alert('已取消');
        },
        fail: function(res) {
            //alert(JSON.stringify(res));
        }
    }
    wx.onMenuShareAppMessage(shareMessageData);
    wx.onMenuShareTimeline(shareTimelineData);
}