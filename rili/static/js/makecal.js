var nowShowYear = 0,
    nowShowMonth = 0,
    nowShowDate = 0,
    todayyear = 0,
    todaymonth = 0,
    todaydate = 0;
/*日历区域总高度,日历每个item的文字区域高度*/
var calendarHeight = 0,
    calendarItemTextHeight;
/**用于进入时判断是否已经初始化完成*/
var isHasInitCalendarView = false;
/**手势滑动类*/
var swiper;

var channel = getQueryString("channel");

/*将单个int数转换为2位数*/
function getFormatInt(value) {
    if (value < 10) {
        return "0" + value;
    } else {
        return value;
    }
}
/*根据name获取url中的一个参数值*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
var myDate = new Date();
todayyear = myDate.getFullYear();
todaymonth = myDate.getMonth() + 1;
todaydate = myDate.getDate();

var datestring = getQueryString("d");
if (datestring != null && datestring.length == 8) {
    nowShowYear = Number(datestring.substring(0, 4));
    nowShowMonth = Number(datestring.substring(4, 6));
    nowShowDate = Number(datestring.substring(6, 8));
}
if (nowShowYear == 0 || nowShowMonth == 0 || nowShowDate == 0) {
    nowShowYear = todayyear;
    nowShowMonth = todaymonth;
    nowShowDate = todaydate;
}
/*获取一个月要显示的数据*/
function getTheMonthShowData(theYear, theMonth) {
    var monthDataList = getOneMonthShowData(theYear, theMonth);
    var nowSelectItem;
    var calendarhtml = "";
    var length = monthDataList.length;
    var cellHeight = parseInt(calendarHeight / (length / 7));
    var dayWrapperHeight = calendarItemTextHeight;
    var dayWrapper = $('.dayWrapper');
    if (dayWrapper) {
        dayWrapperHeight = dayWrapper.height();
        if (dayWrapperHeight || dayWrapperHeight < 1) {
            dayWrapperHeight = calendarItemTextHeight;
        }
    }
    var paddingTop = (cellHeight - dayWrapperHeight) / 2;
    for (var i = 0; i < length; i++) {
        var item = monthDataList[i];
        var theDayClass = ""; //标示当前要选中还是显示今天圆圈
        if (todaydate == item.date && todaymonth == item.month && todayyear == item.year) {
            theDayClass = "today";
        } else if (nowShowDate == item.date && nowShowMonth == item.month && nowShowYear == item.year) {
            theDayClass = "block_click";
        }
        calendarhtml += "<a href=\"javascript:void(0)\" class=\"days last " + theDayClass + "\" style=\"height:" + cellHeight + "px\"><div class=\"dayWrapper\" style=\"padding-top: " + paddingTop + "px\">";
        if (item.jiaBan != -1) {
            if (item.jiaBan == 0) {
                calendarhtml += "<div class=\"jprestWork jprestWorkw\" style=\"background: url(./image/date_holiday.png) no-repeat\"></div>";
            } else if (item.jiaBan == 1) {
                calendarhtml += "<div class=\"jprestWork\" style=\"background: url(./image/date_work.png) no-repeat\"></div>";
            }
        }
        calendarhtml += "<div class=\"dayContent\">";
        //公历部分
        if (i < 7 && item.month != theMonth) {
            if (item.week == 0 || item.week == 6) {
                calendarhtml += "<div class=\"daydate weekend before\" style=\"color: #cccccc !important;\">" + item.date +
                    "</div>";
            } else {
                calendarhtml += "<div class=\"daydate before\" style=\"color: #cccccc !important;\">" + item.date +
                    "</div>";
            }
        } else if (item.month != theMonth) {
            if (item.week == 0 || item.week == 6) {
                calendarhtml += "<div class=\"daydate weekend after\" style=\"color: #cccccc !important;\">" + item.date +
                    "</div>";
            } else {
                calendarhtml += "<div class=\"daydate after\" style=\"color: #cccccc !important;\">" + item.date +
                    "</div>";
            }
        } else {
            if (item.week == 0 || item.week == 6) {
                calendarhtml += "<div class=\"daydate weekend now\">" + item.date + "</div>";
            } else {
                calendarhtml += "<div class=\"daydate now\">" + item.date + "</div>";
            }
        }
        //农历显示部分
        //
        if (i < 7 && item.month != theMonth) {
            if (item.jieqi) {
                calendarhtml += "<div class=\"daycndate holiday before\" style=\"color: #cccccc !important;\">" +
                    item.jieqi + "</div>";
            } else if (item.festival) {
                calendarhtml += "<div class=\"daycndate holiday before\" style=\"color: #cccccc !important;\">" +
                    (item.festival.length > 4 ? item.festival.substring(0, 4) : item.festival) + "</div>";
            } else if (item.ndate == 1) {
                calendarhtml += "<div class=\"daycndate holiday before\" style=\"color: #cccccc !important;\">" +
                    item.nmonthstr + "</div>";
            } else {
                calendarhtml += "<div class=\"daycndate before\" style=\"color: #cccccc !important;\">" + item.ndatestr +
                    "</div>";
            }
        } else if (item.month != theMonth) {
            if (item.jieqi) {
                calendarhtml += "<div class=\"daycndate holiday after\" style=\"color: #cccccc !important;\">" +
                    item.jieqi + "</div>";
            } else if (item.festival) {
                calendarhtml += "<div class=\"daycndate holiday after\" style=\"color: #cccccc !important;;\">" +
                    (item.festival.length > 4 ? item.festival.substring(0, 4) : item.festival) + "</div>";
            } else if (item.ndate == 1) {
                calendarhtml += "<div class=\"daycndate holiday after\" style=\"color: #cccccc !important;;\">" +
                    item.nmonthstr + "</div>";
            } else {
                calendarhtml += "<div class=\"daycndate after\" style=\"color: #cccccc !important;;\">" + item.ndatestr +
                    "</div>";
            }
        } else {
            if (item.jieqi) {
                calendarhtml += "<div class=\"daycndate holiday\">" +
                    item.jieqi + "</div>";
            } else if (item.festival) {
                calendarhtml += "<div class=\"daycndate holiday\">" +
                    (item.festival.length > 4 ? item.festival.substring(0, 4) : item.festival) + "</div>";
            } else if (item.ndate == 1) {
                calendarhtml += "<div class=\"daycndate holiday\">" +
                    item.nmonthstr + "</div>";
            } else {
                calendarhtml += "<div class=\"daycndate\">" + item.ndatestr +
                    "</div>";
            }
        }
        calendarhtml += "</div>"; //end dayContent
        calendarhtml += "</div></a>";
        if (nowShowDate == item.date && nowShowMonth == item.month && nowShowYear == item.year) {
            nowSelectItem = item;
        }
    } //end for
    /**设置黄历行日期*/
    if (nowSelectItem) {
        $(".day").html("<span class=\"dayViewCnDate " + (nowSelectItem.isleapMonth ? 'leap-month ' : '') + "\">" +
            (nowSelectItem.isleapMonth ? "闰" : "") + nowSelectItem.nmonthstr + nowSelectItem.ndatestr + "</span>");
        $(".week").text(
            nowSelectItem.nyearcyl + AnimalsYear(nowSelectItem.nyear) +
            "年 " + weekDays[nowSelectItem.week]);
        $(".nongliweek").text(
            nowSelectItem.nmonthcyl + "月 " + nowSelectItem.ndatecyl +
            "日");

        var yiji = getAlmanacYiJi(nowSelectItem.nmonthcyl_int, nowSelectItem.ndatecyl_int);
        $(".yiContent").text(yiji.y);
        $(".jiContent").text(yiji.j);
    }
    return calendarhtml;
}


/* 获取黄历数据 */
function getAndSetHuangliData(year, month, date) {
    var monthData = getOneMonthShowData(year, month);
    var day;
    for (var i = 0, len = monthData.length - 1; i < len; i++) {
        if (monthData[i].date === date && monthData[i].month === month && monthData[i].year === year) {
            day = monthData[i];
            break;
        }
    }
    //农历显示部分
    $(".liteCnDayInfo,.day").html(
        "<span class=\"dayViewCnDate " + (day.isleapMonth ? 'leap-month ' : '') + "\">" + (day.isleapMonth ? '闰' : '') + day.nmonthstr + day.ndatestr + "</span>");

    $(".dayViewYearInfo").html(
        day.nyearcyl + "[" +
        getAnotherGanzhi(day) + "]年 " +
        getWeekName(day.week) + " " + day.nmonthcyl + "月 " + day.ndatecyl + "日");
    $('.week').html(day.nyearcyl + getAnotherGanzhi(day) + "年 " + getWeekName(day.week));
    $('.nongliweek').html(day.nmonthcyl + "月" + " " + day.ndatecyl + "日");
    /*黄历宜忌*/
    var yiji = getAlmanacYiJi(day.nmonthcyl_int, day.ndatecyl_int);
    $(".dayViewYiDescContent").text(yiji.y);
    $(".yiContent").text(yiji.y);
    $(".dayViewJiDescContent").text(yiji.j);
    $(".jiContent").text(yiji.j);
    /* 诸神方位 */
    var fangwei = getAlmanacZhuShenFangWei(day.ndatecyl_int);
    var taishen = getAlmanacTaiShen(day.ndatecyl_int);
    var xingxiu = getAlmanacXingXiu(day.ndatecyl_int);
    var wuxing = getAlmanacWuXing(day.ndatecyl_int);
    var chongsha = getAlmanacChongSha(day.ndatecyl_int);
    var baiJi = getAlmanacPengZu(day.ndatecyl_int);
    $(".zhushenfangweidesc").text(fangwei);
    $(".tsTxt").text(taishen);
    $(".xxTxt").text(xingxiu);
    $(".csTxt").text(chongsha);
    $(".wxTxt").text(wuxing);
    $(".pzTxt").html(baiJi.split(' ')[0] + "<br><br>" + baiJi.split(' ')[1]);
    /**时辰宜忌*/
    var shiChenOri = getAlmanacShiChen(day.ndatecyl_int);
    $(".scyjContent").show();
    var nowShichen = -1;
    if (todaydate == date && todaymonth == month && todayyear == year) {
        var nowHour = new Date().getHours();
        switch (nowHour) {
            case 0:
            case 23:
                nowShichen = 0;
                break;
            case 1:
            case 2:
                nowShichen = 1;
                break;
            case 3:
            case 4:
                nowShichen = 2;
                break;
            case 5:
            case 6:
                nowShichen = 3;
                break;
            case 7:
            case 8:
                nowShichen = 4;
                break;
            case 9:
            case 10:
                nowShichen = 5;
                break;
            case 11:
            case 12:
                nowShichen = 6;
                break;
            case 13:
            case 14:
                nowShichen = 7;
                break;
            case 15:
            case 16:
                nowShichen = 8;
                break;
            case 17:
            case 18:
                nowShichen = 9;
                break;
            case 19:
            case 20:
                nowShichen = 10;
                break;
            case 21:
            case 22:
                nowShichen = 11;
                break;
        }
    }
    var shichenStr = "";
    for (var i = 0; i < shiChenOri.length; i++) {
        shichenStr += "<div class=\"scyjItem " + (i == nowShichen ? "now" : "") + "\"><div class=\"scyjTtx\">" + shiChenOri[i] + "</div></div>";
    }
    $(".scyjList").html(shichenStr);
}

function getWeekName(week) {
    var format = true;
    if (0 == week) return format ? '星期日' : '周日';
    else if (1 == week) return format ? '星期一' : '周一';
    else if (2 == week) return format ? '星期二' : '周二';
    else if (3 == week) return format ? '星期三' : '周三';
    else if (4 == week) return format ? '星期四' : '周四';
    else if (5 == week) return format ? '星期五' : '周五';
    else if (6 == week) return format ? '星期六' : '周六';
}

function getAnotherGanzhi(day) {
    var t = day.nyearcyl[1];
    var nYear = {
        子: '鼠',
        丑: '牛',
        寅: '虎',
        卯: '兔',
        辰: '龙',
        巳: '蛇',
        午: '马',
        未: '羊',
        申: '猴',
        酉: '鸡',
        戌: '狗',
        亥: '猪'
    };
    return nYear[t];
}

/**计算并显示当前月数据*/
function dealNowShowMonthViewData() {
    $(".date").text(nowShowYear + "年" + getFormatInt(nowShowMonth) + "月");
    var theMonthHtml = getTheMonthShowData(nowShowYear, nowShowMonth);
    $('.swiper-slide-active').html(theMonthHtml);

    //点击灰色字体的日历，向前、后跳一个月
    $('.before').parent().parent().parent().on('click', function() {
        tempDate = parseInt($(this).find('.daydate').text());
        swiper.slidePrev();
    });
    $('.after').parent().parent().parent().on('click', function() {
        tempDate = parseInt($(this).find('.daydate').text());
        swiper.slideNext();
    });
    checkAndShowHideBackToTodayButton();
}

/**获取和设置日历区域的高度*/
function getAndSetCalendarHeight() {
    var windowClientHeight = $(window).height();
    var headerHeight = $('header').height();
    var huangliHeight = $('.huanglibox').height();
    var bannerHeight = $('.banner').height();
    var weekNameHeight = $('.weekName').height();
    calendarHeight = windowClientHeight - headerHeight - huangliHeight - bannerHeight - weekNameHeight;
    if ($(window).width() > 415) {
        calendarItemTextHeight = 40;
        calendarHeight = windowClientHeight - headerHeight - huangliHeight - weekNameHeight;
        if (calendarHeight < 360) {
            calendarHeight = 360;
        }
    } else {
        calendarItemTextHeight = 31;
        if (calendarHeight < 280) {
            calendarHeight = 280;
        }
    }
    $('.swiper-container').height(calendarHeight);
    $('.calendarbox').height(calendarHeight);
    $('.calendar').height(calendarHeight);
}

/**日历左右滑动逻辑处理开始**********************************************/
var tempDate = 0;
// 日历左右滑动
function InitSwipeView() {
    var flag = 0;
    swiper = new Swiper('.swiper-container', {
        loop: true,
        speed: 300,
        followFinger: false,
        onSlidePrevEnd: function(swiper) {
            if (isHasInitCalendarView) {
                dealCalendarViewWhenScrollEnd();
                getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
            }
        },
        onSlideNextEnd: function(swiper) {
            if (isHasInitCalendarView) {
                dealCalendarViewWhenScrollEnd();
                getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
            }
        },
        onSlideNextStart: function(swiper) {
            if (isHasInitCalendarView) {
                /**判断下个月view中显示的数据是否正确,正确则不动,否则重新计算*/
                nowShowMonth += 1;
                if (nowShowMonth > 12) {
                    nowShowYear += 1;
                    nowShowMonth = 1;
                }
                if (tempDate != 0) {
                    nowShowDate = tempDate;
                    tempDate = 0;
                } else {
                    if (nowShowMonth == todaymonth && nowShowYear == todayyear) {
                        nowShowDate = todaydate;
                    } else {
                        nowShowDate = 1;
                    }
                }
                dealNowShowMonthViewData();
            }
        },
        onSlidePrevStart: function(swiper) {
            if (isHasInitCalendarView) {
                /**判断上个月view中显示的数据是否正确,正确则不动,否则重新计算*/
                nowShowMonth -= 1;
                if (nowShowMonth < 1) {
                    nowShowYear -= 1;
                    nowShowMonth = 12;
                }
                if (tempDate != 0) {
                    nowShowDate = tempDate;
                    tempDate = 0;
                } else {
                    if (nowShowMonth == todaymonth && nowShowYear == todayyear) {
                        nowShowDate = todaydate;
                    } else {
                        nowShowDate = 1;
                    }
                }
                dealNowShowMonthViewData();
            }
        },
        onInit: function() {
            $('.loading').hide();
        }
    })
}
/**由于Swiper滑动时总是先回到中间一屏然后在开始滑动,所以需要将中间一屏的内容设置的和当前显示的一屏一样*/
function dealCalendarViewWhenScrollEnd() {
    var nextDiv = $('.swiper-slide-active');
    var parent = nextDiv.parent();
    parent.children().eq(1).html(nextDiv[0].innerHTML);
}
/**日历左右滑动逻辑处理结束**********************************************/
function checkAndShowHideBackToTodayButton() {
    if (nowShowDate == todaydate && nowShowMonth == todaymonth && nowShowYear == todayyear) {
        $("#jintian").hide();
    } else {
        $("#jintian").show();
    }
}

/*点击‘节’ 跳转到分类页面*/
function bindClick() {
    $('#festival').on('click', function() {
        if (channel != "" && channel != null) {
            window.location.href = 'category.html?channel=' + channel;
        } else {
            window.location.href = 'category.html';
        }
    });
    $('#jintian').bind('click', function(e) {
        nowShowYear = todayyear;
        nowShowMonth = todaymonth;
        nowShowDate = todaydate;
        /*处理显示当前月数据*/
        dealNowShowMonthViewData();
        dealCalendarViewWhenScrollEnd();
        /**读取黄历*/
        getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
    });
    /**设置一天的点击*/
    $('.calendar').on('click', '.days', function() {
        if ($(this).find(".daydate").hasClass("now")) { /**当前显示月份的点击*/
            $('.days').removeClass('block_click');
            $(this).addClass('block_click');
            nowShowDate = parseInt($(this).find('.dayContent').text().slice(0, 2));
            getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
            checkAndShowHideBackToTodayButton();
        }
    });
}
/*将日期对象date加n天*/
function dateAdd(date, n) {
    //当前日期的毫秒数 + 天数 * 一天的毫秒数
    var n = date.getTime() + n * 24 * 60 * 60 * 1000;
    var result = new Date(n);
    return result;
}
/**黄历页面前一天*/
function preDayHuangli() {
    var thedate = new Date(nowShowYear, nowShowMonth - 1, nowShowDate);
    thedate = dateAdd(thedate, -1);
    nowShowYear = thedate.getFullYear();
    nowShowMonth = thedate.getMonth() + 1;
    nowShowDate = thedate.getDate();
    dealNowShowMonthViewData();
    getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
}
/**黄历页面后一天*/
function nextDayHuangli() {
    var thedate = new Date(nowShowYear, nowShowMonth - 1, nowShowDate);
    thedate = dateAdd(thedate, 1);
    nowShowYear = thedate.getFullYear();
    nowShowMonth = thedate.getMonth() + 1;
    nowShowDate = thedate.getDate();
    dealNowShowMonthViewData();
    getAndSetHuangliData(nowShowYear, nowShowMonth, nowShowDate);
}

$(document).ready(function() {
    getAndSetCalendarHeight();
    InitSwipeView();
    /*处理显示当前月数据*/
    dealNowShowMonthViewData();
    /**读取黄历*/
    // getAndSetHuangliData(nowShowYear,nowShowMonth,nowShowDate);
    isHasInitCalendarView = true;
    bindClick();
    window.onorientationchange = function() {
        //window.location.reload(true); //刷新操作
        if (window.orientation == 0 ||
            window.orientation == 180 ||
            window.orientation == 90 ||
            window.orientation == -90) {
            window.location.reload(true);
        }
    }
});