//参数列表-------------------------------------------------------------------
var songList = new Array();//歌词列表
var index;//当前播放歌曲索引
var max = 0;//总歌曲数量
var volume = 20;//音量
var playStyle = 1;//播放风格:1=顺序播放,2=列表循环,3=随机播放,4=单曲循环
var lyricColor = 1;//歌词颜色 1 = lightgreen，2 = lightpink，3 = yellow
var nowColorNum = lyricColor;//当前歌词显示颜色

//初始化----------------------------------------------------------------------

/**
 * 初始化播放控件
 */
function initMusic() {
    initJqueryObject();//初始化Jquery对象
    index = 1;//设置默认歌曲索引
    changePlayStyle(playStyle);//设置播放样式
    getMusicList();
    getSong();//获取歌曲列表
    getMaxSongNum();//获取歌曲列表总数
    changeVolumeBar(volume);//设置小滑块位置并且设置音量
    getSongName(index);//获取歌曲名字
    changeSongNameColor(index);//改变当选中歌曲样式
    changeNextLyricColorInfo(lyricColor);//下一首词显示颜色
    changeNowLyricColorInfo(nowColorNum);//目前词显示颜色

    /**
     * 初始化Jquery对象
     */
    function initJqueryObject() {
        //jQuery对象
        $musicL = $(".MusicL");//歌词显示控件
        $playStyleClass = $(".playStyle");//播放样式图标
        $playStyleID = $("#playStyle");//播放样式信息显示
        $myMusic = $("#myMusic");//audio控件
        $songFace = $("#songFace");//歌曲封面控件
        $songName = $("#songName");//歌曲名称控件
        $play = $("#play");//播放按钮控件
        $volume = $("#volume");//音量图标控件
        $volumeNum = $("#volume_num");//声音音量百分比显示控件
        $volumeWall = $("#volume_wall");//音乐进度条控件
        $volumeBar = $(".volume_bar");//音量小滑块控件
        $maxSongNum = $("#maxSongNum");//歌曲总数标签控件
        $songList = $("#songList");//歌曲列表控件
        $songListClass = $(".songList");//歌曲列表滚动
        $infoSongName = $("#info_SongName");//歌曲名称信息控件
        $infoAutor = $("#info_Autor");//歌曲作者信息控件
        $nextLyricColor = $("#nextLyricColor");//下一首歌词颜色
        $nowLyricColor = $("#nowLyricColor");//当前歌词颜色
        $progress = $("#progress");//时间进度条控件
        $progressBar = $("#progress_bar");//时间进度条小滑块控件
        $progressBg = $("#progress_bg");//时间进度条已播放控件
        $timeInfo = $("#info_Time");//时间信息标签控件
        $iconLyric = $(".icon_lyric");//歌词图标控件
        $lyricAlert = $(".lyric_alert");//歌词颜色信息控件
        $lyric = $(".lyric");//显示歌词控件
    }

//绑定事件----------------------------------------------------------------------
    /**
     * 绑定歌曲列表点击事件
     */
    $(".songList #songList li").click(function () {
        index = $(this).index() + 1;
        getSongName(index)
        changeSongNameColor(index);
        nowColorNum = lyricColor;
        changeNowLyricColorInfo(nowColorNum);
    });

    /**
     * 绑定显示歌词颜色事件
     */
    $iconLyric.hover(function () {
        $lyricAlert.fadeIn(400);
    }, function () {
        $lyricAlert.fadeOut(400);
    });

    /**
     * 绑定拖动小滑块改变音量事件
     */
    $volumeBar.bind("mousedown", function (e) {
        e.stopPropagation();
        let x = e.pageX - $(this).offset().left;
        let allWidth = $volumeWall.width() - $volumeBar.width();
        $(document).bind("mousemove", function (e) {
            var l = e.pageX;
            var _left = l - x - $volumeWall.offset().left;
            if (_left < 0) {
                _left = 0;
            }
            if (_left > allWidth) {
                _left = allWidth;
            }
            $volumeBar.css("transform", "translate(" + _left + "px,0px)");
            setVolume((_left / allWidth) * 100);
        });
        $(document).bind("mouseup", function (e) {
            $(this).unbind("mousemove");
        });
    });

    /**
     * 绑定点击音量条调整播放音量事件
     */
    $volumeWall.bind("click", function (e) {
        let _left = e.pageX - $(this).offset().left;
        let allWidth = $volumeWall.width() - $volumeBar.width();
        if (_left < 0) {
            _left = 0;
        }
        if (_left > allWidth) {
            _left = allWidth;
        }
        $(".volume_bar").css("transform", "translate(" + _left + "px,0px)");
        setVolume((_left / allWidth) * 100);
    });

    /**
     * 绑定监听歌曲时间更新事件
     */
    $myMusic.bind("timeupdate", function () {
        let timer = $(this)[0].currentTime;//歌曲当前播放到的时间
        let resTimer = $(this)[0].duration;//歌曲总时间
        let allWidth = $progress.width() - $progressBar.width();
        let _left = (timer / resTimer) * allWidth
        $progressBar.css("transform", "translate(" + _left + "px,-7px)");
        $progressBg.css("width", _left + "px");
        let s = parseInt(timer);
        for (let i = 0; i < s; i++) {
            $("#" + i).addClass("sizeC color" + nowColorNum).siblings().removeClass("sizeC color" + nowColorNum);
            $musicL.scrollTop(($(".color" + nowColorNum).index() - 5) * 25);
        }
        if (timer == resTimer) {//当歌曲播放到结尾
            if (playStyle == 4) {//单曲循环，调用重新播放函数
                replay();
            } else {//除了单曲循环，都调用下一首函数
                //如果是顺序播放,(如果当前歌曲为最后一首则暂停播放，否者下一首)，否者下一首
                playStyle == 1 ? (index == max ? stop() : nextSong()) : nextSong();
            }
            $progressBar.css("transform", "translate(0px,-7px)");
        }
        if (!isNaN(resTimer)) {
            $timeInfo.html(changeToTime(timer) + "/" + changeToTime(resTimer));
        }
    });

    /**
     * 绑定时间小滑块控制事件
     */
    $progressBar.bind("mousedown", function (e) {
        let allWidth = $progress.width() - $progressBar.width();
        let x = e.pageX - $(this).offset().left;
        $(document).bind("mousemove", function (e) {
            let l = e.pageX;
            let _left = l - x - $progress.offset().left;
            if (_left < 0) {
                _left = 0;
            }
            if (_left > allWidth) {
                _left = allWidth;
            }
            $progressBar.css("transform", "translate(" + _left + "px,-7px)");
            $progressBg.css("width", _left + "px");
            $myMusic[0].currentTime = (_left / allWidth) * $myMusic[0].duration;
        });
        $(document).bind("mouseup", function (e) {
            $(this).unbind("mousemove");
        });
    });
    /**
     * 绑定点击进度条调整播放时间事件
     */
    $progress.bind("click", function (e) {
        let allWidth = $progress.width() - $progressBar.width();
        let _left = e.pageX - $(this).offset().left;
        $progressBar.css("transform", "translate(" + _left + "px,-7px)");
        $progressBg.css("width", _left + "px");
        $myMusic[0].currentTime = ((_left / allWidth) * $myMusic[0].duration);
    });

    /**
     * 把毫秒转化为正常的时间表示
     * @param time
     * @returns {string}
     */
    function changeToTime(time) {
        var msTime = parseInt(time);
        var m = parseInt(msTime / 60);
        var s = msTime - (m * 60);
        return m + ":" + s;
    }
}

//播放样式-------------------------------------------------------------------
/**
 * 播放样式点击事件
 */
function playStyleClick() {
    (playStyle += 1) > 4 ? changePlayStyle(1) : changePlayStyle(playStyle);
}

/**
 * 改变播放样式
 */
function changePlayStyle(styleNum) {
    let strClass = "";
    let strId = "";
    switch (styleNum) {
        case 1:
            strClass = "iconfont icon-liebiaoshunxu playStyle";
            strId = "顺序播放";
            break;
        case 2:
            strClass = "iconfont icon-liebiaoxunhuan playStyle";
            strId = "列表循环";
            break;
        case 3:
            strClass = "iconfont icon-suijibofang01 playStyle";
            strId = "随机播放";
            break;
        case 4:
            strClass = "iconfont icon-danquxunhuan playStyle";
            strId = "单曲循环";
            break;
    }
    $playStyleClass.attr("class", strClass);
    $playStyleID.html(strId);
}

//播放控制-------------------------------------------------------------------
/**
 * 歌曲是否处于暂停状态
 * @returns {boolean | jQuery}
 */
function isPause() {
    return $myMusic[0].paused;
}

/**
 * 播放/暂停
 */
function playAndStop() {
    isPause() ? play() : stop();
}

/**
 * 上下首共同调用的参数
 */
function allToUse() {
    changeSongNameColor(index);
    getSongName(index);
    scrollSongList();
    nowColorNum = lyricColor;
    changeNowLyricColorInfo(nowColorNum);
}

/**
 * 播放
 */
function play() {
    $myMusic[0].play();
    $songFace.addClass("roateImg");
    $play.removeClass("icon-bofang");
    $play.addClass("icon-zanting");
}

/**
 * 暂停
 */
function stop() {
    $myMusic[0].pause();
    $songFace.removeClass("roateImg");
    $play.addClass("icon-bofang");
    $play.removeClass("icon-zanting");
}

/**
 * 上一首
 */
function preSong() {
    if (playStyle == 3) {//随机播放
        index = Math.floor((Math.random() * max) + 1);
    } else {
        index -= 1;
        if (playStyle == 1) {//如果当前是顺序播放，当遇到第一首首歌时，点击上一首就一直是第一首
            if (index <= 0) {
                index = 1;
            }
        }
        if (index <= 0) {
            index = max;
        }
    }
    allToUse();
}

/**
 * 下一首
 */
function nextSong() {
    if (playStyle == 3) {//随机播放
        index = Math.floor((Math.random() * max) + 1);
    } else {
        index += 1;
        if (playStyle == 1) {//如果当前是顺序播放，当遇到最后一首歌时，点击下一首就是最后一首
            if (index > max) {
                index = max;
            }
        }
        if (index > max) {
            index = 1;
        }
    }
    allToUse();
}

/**
 * 重新播放
 */
function replay() {
    $myMusic[0].load();
    play();
}

/**
 * 静音
 */
function ableOrEnableVolume() {
    let volume = $myMusic[0].muted;
    if (!volume) {
        $myMusic[0].muted = true;
        $volume.addClass("icon-jingyin");
        $volume.removeClass("icon-icon_huabanfuben");
    } else {
        $myMusic[0].muted = false;
        $volume.removeClass("icon-jingyin");
        $volume.addClass("icon-icon_huabanfuben");
    }
}

//获取函数-------------------------------------------------------------------
/**
 * 加载歌曲列表信息
 */
function getMusicList() {
    let musicList = loadMusicList();
    let musicListArray = musicList.split("[");
    let musicIndex = 0;
    for (let i = 0; i < musicListArray.length; i++) {
        let arr = musicListArray[i].split("]")[0];
        if (arr) {
            let music = arr.split(",");
            let musicArray = new Array();
            musicArray[0] = music[0];
            musicArray[1] = music[1];
            songList[musicIndex++] = musicArray;
        }
    }
}


/**
 * 获取总歌曲量
 */
function getMaxSongNum() {
    max = $maxSongNum.html();
}

/**
 *获取歌曲列表
 */
function getSong() {
    $maxSongNum.html(songList.length)
    let lis = "";
    $.each(songList, function (i, songInfo) {
        let song = songInfo[0] + " - " + songInfo[1];
        lis += "<li id=song" + (i + 1) + ">" + song + "</li>";
    });
    $songList.html(lis);
}

/**
 * 获取歌名
 */
function getSongName(i) {
    let songAndAutor = $("#song" + i).text();
    let songName = songAndAutor.split(" - ")[0];
    let autor = songAndAutor.split(" - ")[1];
    $infoSongName.html(songName);
    $infoAutor.html(autor);
    loadLyric(songName);
    changeSongStatus(songName);
}


/**
 * 解析歌词
 */
function getLyric(text) {
    let p = "";
    let lyricArray = text.split('[');
    for (let i = 0; i < lyricArray.length; i++) {
        let arr = lyricArray[i].split(']');
        let timer = arr[0].split('.');
        let stime = timer[0].split(':');
        let ms = stime[0] * 60 + stime[1] * 1;
        let songLrc = arr[1];
        if (songLrc) {
            p += "<p id=" + ms + ">" + songLrc + "</p>";
            $lyric.html(p);
        }
    }
}

//修改和设置值函数-----------------------------------------------------------

/**
 * 根据音量修改滑块所处的位置
 * @param value
 */
function changeVolumeBar(value) {
    $volumeBar.css("transform", "translate(" + (1.65 * value) + "px,0px)");
    setVolume(value);
}

/**
 * 根据数值设置音量
 * @param value
 */
function setVolume(value) {
    $myMusic[0].volume = value / 100;
    $volumeNum.html(parseInt(value) + "%");
}

/**
 * 移动歌曲列表
 */
function scrollSongList() {
    index % 7 == 0 ? changeScroolTop(parseInt(index / 7) - 1) : changeScroolTop(parseInt(index / 7));
}

/**
 * 移动歌曲列表滚轮
 * @param i
 */
function changeScroolTop(i) {
    $songListClass.scrollTop(i * 300);
}


/**
 * 改变下一首播放歌曲歌词颜色
 */
function changeLyricColor() {
    lyricColor += 1;
    if (lyricColor > 3) {
        lyricColor = 1;
    }
    changeNextLyricColorInfo(lyricColor);
}

/**
 * 修改下一首播放歌曲歌词播放颜色
 * @param value
 */
function changeNextLyricColorInfo(value) {
    $nextLyricColor.attr("class", "color" + value);
    let strColor = "";
    switch (value) {
        case  1:
            strColor = "绿色";
            break;
        case  2:
            strColor = "粉色";
            break;
        case  3:
            strColor = "黄色";
            break;
    }
    $nextLyricColor.html(strColor);
}

/**
 * 修改当前歌曲歌词播放颜色
 * @param value
 */
function changeNowLyricColorInfo(value) {
    $nowLyricColor.attr("class", "color" + value);
    let strColor = "";
    switch (value) {
        case  1:
            strColor = "绿色";
            break;
        case  2:
            strColor = "粉色";
            break;
        case  3:
            strColor = "黄色";
            break;
    }
    $nowLyricColor.html(strColor);
}

/**
 * 改变歌曲状态
 * @param songName
 */
function changeSongStatus(songName) {
    changeSongName(songName);
    changeSongImg(songName);
    $myMusic[0].src = "music/" + songName + ".mp3";
    play();
}

/**
 * 改变页面歌曲名称
 * @param songName
 */
function changeSongName(songName) {
    $songName.html(songName);
}

/**
 * 改变页面歌曲图片
 */
function changeSongImg(songName) {
    if (songName) {
        var path = "music/songImg/" + songName + ".jpg";
        $songFace.attr('src', path);
    }
}

/**
 * 改变被选中歌曲样式
 * @param index
 */
function changeSongNameColor(i) {
    $("#song" + i).addClass("songNameColor").siblings().removeClass("songNameColor");
}

//加载函数------------------------------------------------------------------------------------
/**
 * 加载文件
 * @param name
 * @returns {any}
 */
function loadFile(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=gbk");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}


/**
 * 加载歌词到lyric文本域里后进行歌词解析
 * @param songName
 */
function loadLyric(songName) {
    let text = loadFile("music/Lyric/" + songName + ".lrc");
    getLyric(text);
}

/**
 * 加载json数据
 * @returns {any}
 */
function loadMusicList() {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', "music/musicList.txt", false);
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

//-----------------------------------------------------------------------------


