// 音乐播放器逻辑（兼容老浏览器）
window.onload = function() {
    var audio = document.getElementById('audioPlayer');
    var playPauseBtn = document.getElementById('playPauseMusic');
    var prevBtn = document.getElementById('prevMusic');
    var nextBtn = document.getElementById('nextMusic');
    var progressBar = document.getElementById('musicProgress');

    // 音乐列表（可扩展）
    var musicList = [
        "https://example.com/music1.mp3",
        "https://example.com/music2.mp3",
        "https://example.com/music3.mp3"
    ];
    var currentMusicIndex = 0;

    // 播放/暂停切换
    playPauseBtn.onclick = function() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = "❚❚";
        } else {
            audio.pause();
            playPauseBtn.innerHTML = "▶";
        }
    };

    // 上一首
    prevBtn.onclick = function() {
        currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
        audio.src = musicList[currentMusicIndex];
        audio.play();
        playPauseBtn.innerHTML = "❚❚";
    };

    // 下一首
    nextBtn.onclick = function() {
        currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
        audio.src = musicList[currentMusicIndex];
        audio.play();
        playPauseBtn.innerHTML = "❚❚";
    };

    // 进度条更新
    audio.addEventListener('timeupdate', function() {
        var progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = isNaN(progress) ? 0 : progress;
    });

    // 拖动进度条调整播放进度
    progressBar.onchange = function() {
        var seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    };

    // 音乐播放结束自动下一首
    audio.addEventListener('ended', function() {
        nextBtn.onclick();
    });
};