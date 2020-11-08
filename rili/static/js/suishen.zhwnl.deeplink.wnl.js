!(function() {
    linkedme.init("60a8d62246411c1b87ca2ba25c42a366", {
        type: "live"
    }, null);

    var apkUrlAndroid = '' + parseInt(new Date().getTime() / 21600000) + '.apk',
        apkUrlIphone = "http://zhiyunzz.simplesite.com";

    var channel = getQueryString('channel'),
        _isMoji = (/moji/i).test(channel),
        _isKuaima = (/kuaima0/i).test(channel) || (/kuaimai0/i).test(channel),
        androidUrl = '',
        iosUrl = '';

    if (channel != "") {
        initApkUrls(channel);
    }

    $('.click_download').each(function(k, v) {
        var deepLink = $(v).attr('data-deeplink');
        getDeeplink(deepLink, androidUrl, iosUrl, function(url) {
            if (!url) {
                url = isIOS() ? apkUrlIphone : apkUrlAndroid;
            }
            $(v).attr('href', url);
            $(v).click(function() {
                if (_hmt) {
                    if (_isKuaima) {
                        _hmt.push(['_trackEvent', channel, 'click', 'wechat download']);
                    } else if (_isMoji) {
                        _hmt.push(['_trackEvent', './', 'moji-download']);
                    }
                }
                linkedme.trigger_deeplink($(this).attr('href'));
            })
        });
    }).click(function() {
        if (_hmt) {
            if (_isKuaima) {
                _hmt.push(['_trackEvent', channel, 'click', 'wechat download']);
            } else if (_isMoji) {
                _hmt.push(['_trackEvent', './', 'moji-download']);
            }
        }
        return true;
    })

    function initApkUrls(channel) {
        $.ajax({
            type: "GET",
            url: "http://alliance.etouch.cn/suishen_alliance/api/channel/resource/urls?channel=" + channel,
            dataType: "jsonp",
            jsonpCallback: "callbackUrls",
            success: function(data) {
                if (data) {
                    androidUrl = data.android;
                    iosUrl = data.iphone;
                }
                if (androidUrl || iosUrl) {
                    $('.click_download').each(function(k, v) {
                        var deepLink = $(v).attr('data-deeplink');
                        getDeeplink(deepLink, androidUrl, iosUrl, function(url) {
                            $(v).attr('href', url);
                        });
                    })
                }

            }
        });
    }

    function getDeeplink(deepLink, androidUrl, iosUrl, callback) {
        var data = {};
        data.type = "live";
        if (!isWechat()) {
            if (androidUrl) {
                data.android_custom_url = androidUrl;
            }
            if (iosUrl) {
                data.ios_custom_url = iosUrl;
            }
        }
        data.channel = channel ? channel : "sharing";
        data.tags = androidUrl + ',' + iosUrl;
        data.params = '{"action":"' + deepLink + '"}';
        linkedme.link(data, function(err, data) {
            if (err) {
                // 生成深度链接失败，返回错误对象err
                console.info('build deeplink error');
                if (!!callback) {
                    callback('');
                }
            } else {
                if (!!callback) {
                    callback(data.url);
                }
            }
        }, false);
    }
    //获取url参数值
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function isIOS() {
        var userAgent = navigator.userAgent.toLowerCase();
        return (/iphone/i).test(userAgent) || (/ipad/i).test(userAgent) || (/ios/i).test(userAgent);
    }

    function isWechat() {
        var userAgent = navigator.userAgent.toLowerCase();
        return (/micromessenger/i).test(userAgent);
    }
})(window.jQuery || window.Zepto)
