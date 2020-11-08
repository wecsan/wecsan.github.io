/*
 * @Author: tanbei
 * @Date:   2016-07-01 16:11:17
 * @Last Modified by:   tanbei
 * @Last Modified time: 2016-07-23 19:07:58
 */


'use strict';

$(document).ready(function() {
    calendarOrHuangli();
    holidayHref();
    tableCal();
    huangliInfo();
});

// 判断进来是日历还是月历
function calendarOrHuangli() {
    var url = window.location.href;
    var render = getQueryString('render');
    if (render == '1') {
        $('.huangli').show();
        $('.yueli').hide();
        $('.tableCal').addClass('tableCal1');
        $('#huangli').hide();
        $('.returnBack').show();
    } else if (render == '0' || window.location.search == '') {
        $('.huangli').hide();
        $('.yueli').show();
        $('.returnBack').hide();
    }
}
//信息流是否包含下一页
var hasMore = true;
// 用来保存根据阴历的节假日
var chunjieMonth;
var chunjieDate;
var duanWuMonth;
var duanWuDate;
var zhongQiuMonth;
var zhongQiuDate;
var channel = getQueryString('channel');
// 计算出所有的节假日的月份
function getHolidaysDate() {
    for (var i = 0; i < 12; i++) {
        for (var j = 0, len = getOneMonthData(new Date().getFullYear(), i).length; j < len; j++) {
            if (getOneMonthData(new Date().getFullYear(), i)[j].festival == '除夕') {
                chunjieMonth = getOneMonthData(new Date().getFullYear(), i)[j].month;
                chunjieDate = getOneMonthData(new Date().getFullYear(), i)[j].date;
            } else if (getOneMonthData(new Date().getFullYear(), i)[j].festival == '端午节') {
                duanWuMonth = getOneMonthData(new Date().getFullYear(), i)[j].month;
                duanWuDate = getOneMonthData(new Date().getFullYear(), i)[j].date;
            } else if (getOneMonthData(new Date().getFullYear(), i)[j].festival == '中秋节') {
                zhongQiuMonth = getOneMonthData(new Date().getFullYear(), i)[j].month;
                zhongQiuDate = getOneMonthData(new Date().getFullYear(), i)[j].date;
            }
        }
    }
}


// 节日跳转
function holidayHref() {
    getHolidaysDate();
    var show = getQueryString('show');
    switch (show) {
        case '0':
            nowShowMonth = 1;
            nowShowDate = 1;
            break;
        case '1':
            nowShowMonth = chunjieMonth;
            nowShowDate = chunjieDate;
            break;
        case '2':
            nowShowMonth = 4;
            nowShowDate = 2;
            break;
        case '3':
            nowShowMonth = 4;
            nowShowDate = 30;
            break;
        case '4':
            nowShowMonth = duanWuMonth;
            nowShowDate = duanWuDate;
            break;
        case '5':
            nowShowMonth = zhongQiuMonth;
            nowShowDate = zhongQiuDate;
            break;
        case '6':
            nowShowMonth = 10;
            nowShowDate = 1;
            break;
    }
    dealNowShowMonthViewData();
    getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
}

// 点击切换月历/黄历
function tableCal() {
    //$('.tableCal').on('click', function () {
    //    $(this).toggleClass('tableCal1');
    //    $('.yueli').toggle();
    //    $('.huangli').toggle();
    //    var blockHeight = $('.block').height();
    //    $('.innerItem').css('margin-top', -blockHeight * 0.25 + 'px');
    //});
    var huangliClick = function() {
        $('.yueli').hide();
        $('.huangli').show();
        //$('.tableCal').addClass('tableCal1');
        $('.returnBack').show();
        $('#huangli').hide();
    }
    $('.daybox').on('click', huangliClick);
    $('.info').on('click', huangliClick);

    $('#huangli').on('click', function() {
        $('.huangli').show();
        $('.yueli').hide();
        $('.returnBack').show();
        $(this).hide();
    });
    $('.returnBack').on('click', function() {
        $('.huangli').hide();
        $('.yueli').show();
        $('#huangli').show();
        $(this).hide();
    });
}

// 黄历新闻
function huangliInfo(n) {
    if (channel != "moji") {
        if (hasMore) {
            $.ajax({
                url: 'http://pc.suishenyun.net/peacock/webapi/getHuangLiFeed',
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    hasMore = data['hasMore'] && data['hasMore'] == 1;
                    var list = data['list'];
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (list[i].mold == 2) {
                            var html = '';
                            var content = list[i].title;
                            var imgs = list[i].imgs[0];
                            var shareLink = list[i].share_link;
                            html += '<div class="newsItem clearfix">';
                            html += '<a href=' + shareLink + '>';
                            html += '<div class="newsContent">';
                            html += '<p class="content">' + content + '</p>';
                            html += '</div>';
                            html += '<div class="newsImg">';
                            html += '<img src=' + imgs + ' alt="">';
                            html += '</div>';
                            html += '</a>';
                            html += '</div>';
                            $('.newsbox').append(html);
                        }
                    }
                }
            })
        }
    } else {
        $(".huangliFooter").hide();
        $(".huangliFooter-moji").show();
        $(".huangliNews").hide();

    }
}


// 向下滚动刷新信息

var n = 1;
if (channel != "moji") {

    window.onscroll = function() {
        if (hasMore) {
            var bot = 0; //bot是底部距离的高度
            if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
                $.ajax({
                    url: 'http://zhiyunzz.simplesite.com' + n,
                    type: 'get',
                    dataType: 'jsonp',
                    success: function(data) {
                        hasMore = data['hasMore'] && data['hasMore'] == 1;
                        var list = data['list'];
                        if (hasMore) {
                            n++;
                        } else {
                            var top_s = $(window).scrollTop();
                            top_s = $(document).height();
                        }
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (list[i].mold == 2) {
                                var html = '';
                                var _content = list[i].title;
                                var _imgs = list[i].imgs[0];
                                var _shareLink = list[i].share_link;
                                html += '<div class="newsItem clearfix">';
                                html += '<a href=' + _shareLink + '>';
                                html += '<div class="newsContent">';
                                html += '<p class="content">' + _content + '</p>';
                                html += '</div>';
                                html += '<div class="newsImg">';
                                html += '<img src=' + _imgs + ' alt="">';
                                html += '</div>';
                                html += '</a>';
                                html += '</div>';
                                $('.newsbox').append(html);
                            }
                        }
                    }
                })
            }
        }
    }
} else {
    $(".huangliFooter").hide();
    $(".huangliFooter-moji").show();
    $(".huangliNews").hide();
}

/*根据name获取url中的一个参数值*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return "";
}
