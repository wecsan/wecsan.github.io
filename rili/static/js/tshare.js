(function (root) {
    var share = {
        qqShareUrl: "http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js",
        wxJsSdkUrl: "http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
        settings: null,
        init: function (settings) {
            this.settings = settings

            loadJs("qqShareForTShare", this.qqShareUrl, function () {
                qqShareCallback(settings);
            });


            if (settings.wxAppId != undefined && settings.wxAppId != "") {
                loadJs("", this.wxJsSdkUrl, function () {
                    wxShareCallback(settings);
                });
            }

            function qqShareCallback(settings) {
                if (setShareInfo) {
                    setShareInfo({
                        title: settings.title,
                        summary: settings.desc,
                        pic: settings.shareUrl,
                        url: settings.url,
                        WXconfig: {
                            swapTitleInWX: true,
                            appId: '',
                            timestamp: '',
                            nonceStr: '',
                            signature: ''
                        }
                    });
                }
            }
            function wxShareCallback() {
                var document = root.document;
                var script = document.createElement('script');
                var node = document.createTextNode("function call(data){ tShare.wxJsonpCallback(data); }");
                script.appendChild(node);
                document.getElementsByTagName('head')[0].appendChild(script);

                addJsonpDom(settings.wxSignatureUrl);
            }
            function addJsonpDom(oUrl) {
                var document = root.document;
                var script = document.createElement('script');
                var url = oUrl;
                if (url.indexOf("?") > 0) {
                    url += "&callback=call";
                }
                else {
                    url += "?callback=call";
                }
                script.src = url;

                document.getElementsByTagName('head')[0].appendChild(script);
            }
            function loadJs(sid, jsurl, callback) {
                var document = root.document;
                var nodeHead = document.getElementsByTagName('head')[0];
                var nodeScript = null;
                if (document.getElementById(sid) == null) {
                    nodeScript = document.createElement('script');
                    nodeScript.setAttribute('type', 'text/javascript');
                    nodeScript.setAttribute('src', jsurl);
                    nodeScript.setAttribute('id', sid);
                    if (callback != null) {
                        nodeScript.onload = nodeScript.onreadystatechange = function () {
                            if (nodeScript.ready) {
                                return false;
                            }
                            if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                                nodeScript.ready = true;
                                callback();
                            }
                        };
                    }
                    nodeHead.appendChild(nodeScript);
                } else {
                    if (callback != null) {
                        callback();
                    }
                }
            }
        },
        wxJsonpCallback: function (data) {
            var title = this.settings.title;
            var desc = this.settings.desc;
            var url = this.settings.url;
            var imgUrl = this.settings.shareUrl;

            if (data.status == 1000) {
                var sign = data.data;
                wx.config({
                    debug: this.settings.wxDebug,
                    appId: this.settings.wxAppId,
                    timestamp: parseInt(sign.timestamp),
                    nonceStr: sign.noncestr,
                    signature: sign.signature,
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone']
                });
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: title,
                        link: url,
                        imgUrl: imgUrl,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: title,
                        desc: desc,
                        link: url,
                        imgUrl: imgUrl,
                        type: 'link',
                        dataUrl: '',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareQQ({
                        title: title,
                        desc: desc,
                        link: url,
                        imgUrl: imgUrl,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareQZone({
                        title: title,
                        desc: desc,
                        link: url,
                        imgUrl: imgUrl,
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                });
                wx.error(function (res) {
                });
            }
        },
    }

    root.tShare = share;
})(window);
