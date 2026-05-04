// script.js - 完整交互逻辑
// 兼容安卓4+老浏览器的localStorage
function getStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // 老浏览器不支持localStorage时静默失败
    }
}

// 音乐列表（可自行扩展）
const musicList = [
    {
        name: "Patience",
        artist: "Patience",
        url: "https://templeovo.github.io/Patience.mp3"
    },
 {
        name: "Oppai",
        artist: "Oppai",
        url: "https://templeovo.github.io/Oppai.mp3"
    },
 {
        name: "LateNightDrive",
        artist: "LateNightDrive",
        url: "https://templeovo.github.io/LateNightDrive.mp3"
    },
 {
        name: "entry",
        artist: "entry",
        url: "https://templeovo.github.io/entry.mp3"
    },
 {
        name: "lostintranslation",
        artist: "lostintranslation",
        url: "https://templeovo.github.io/lostintranslation.mp3"
    },
];

// 全局变量
let currentMusicIndex = 0;
let audio = null;
let isPlaying = false;
let musicPreference = getStorage('musicPreference'); // 'play' 或 'pause'

// DOM元素
const musicModal = document.getElementById('musicModal');
const musicOverlay = document.getElementById('musicOverlay');
const playMusicBtn = document.getElementById('playMusicBtn');
const cancelMusicBtn = document.getElementById('cancelMusicBtn');
const musicFloatBtn = document.getElementById('musicFloatBtn');
const musicPlayerPanel = document.getElementById('musicPlayerPanel');
const togglePlayBtn = document.getElementById('togglePlayBtn');
const prevMusicBtn = document.getElementById('prevMusicBtn');
const nextMusicBtn = document.getElementById('nextMusicBtn');
const musicTitle = document.getElementById('musicTitle');
const musicArtist = document.getElementById('musicArtist');
const musicProgress = document.getElementById('musicProgress');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const avatarImg = document.getElementById('avatarImg');
const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');
const noticeModal = document.getElementById('noticeModal');
const noticeConfirm = document.getElementById('noticeConfirm');

// 格式化时间为 MM:SS 格式
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
}

// 初始化音频
function initAudio() {
    if (!audio) {
        audio = new Audio();
        // 老浏览器兼容
        audio.preload = 'metadata';
    }
    
    audio.src = musicList[currentMusicIndex].url;
    audio.volume = parseFloat(volumeSlider.value) || 0.7;
    musicTitle.textContent = musicList[currentMusicIndex].name;
    musicArtist.textContent = musicList[currentMusicIndex].artist;

    // 监听音频加载完成事件
    audio.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    // 监听音频进度
    audio.addEventListener('timeupdate', updateProgress);
    // 音频播放结束自动下一首
    audio.addEventListener('ended', playNextMusic);
    // 音频错误处理
    audio.addEventListener('error', function(e) {
        console.error('音频播放错误:', e);
        // 老浏览器兼容的提示
        if (typeof alert !== 'undefined') {
            alert('当前歌曲无法播放，自动切换下一首');
        }
        playNextMusic();
    });
}

// 更新进度条和时间显示
function updateProgress() {
    if (audio && !isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

// 播放/暂停切换
function togglePlay() {
    if (!audio) initAudio();
    
    if (isPlaying) {
        audio.pause();
        togglePlayBtn.textContent = "▶️";
    } else {
        // 老浏览器播放兼容
        audio.play().catch(function(e) {
            console.error('播放失败:', e);
        });
        togglePlayBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
}

// 播放上一首
function playPrevMusic() {
    currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
    initAudio();
    if (isPlaying) {
        audio.play().catch(function(e) {
            console.error('播放失败:', e);
        });
        togglePlayBtn.textContent = "⏸️";
    }
}

// 播放下一首
function playNextMusic() {
    currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
    initAudio();
    if (isPlaying) {
        audio.play().catch(function(e) {
            console.error('播放失败:', e);
        });
        togglePlayBtn.textContent = "⏸️";
    }
}

// 点击进度条调整播放进度
function setProgress(e) {
    if (!audio) return;
    
    const width = musicProgress.offsetWidth;
    const clickX = e.offsetX || (e.touches && e.touches[0].clientX - musicProgress.getBoundingClientRect().left);
    const duration = audio.duration;
    if (clickX && duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// 调整音量
function setVolume() {
    if (!audio) initAudio();
    
    audio.volume = parseFloat(volumeSlider.value);
    // 更新音量图标
    const volumeIcon = document.querySelector('.volume-icon');
    if (audio.volume === 0) {
        volumeIcon.textContent = "🔇";
    } else if (audio.volume < 0.5) {
        volumeIcon.textContent = "🔉";
    } else {
        volumeIcon.textContent = "🔊";
    }
}

// 显示/隐藏播放器面板
function togglePlayerPanel() {
    musicPlayerPanel.classList.toggle('show');
}

// 头像点击旋转
function toggleAvatarRotate() {
    // 移除现有动画类（如果存在）
    avatarImg.classList.remove('rotating');
    // 强制重绘
    void avatarImg.offsetWidth;
    // 添加旋转类
    avatarImg.classList.add('rotating');
    // 动画结束后移除类
    setTimeout(function() {
        avatarImg.classList.remove('rotating');
    }, 500);
}

// 复制壁纸链接 - 兼容老浏览器
function copyWallpaperLink(id) {
    const input = document.getElementById(id);
    try {
        input.select();
        document.execCommand('copy');
        alert('链接已复制！');
    } catch (e) {
        // 老浏览器兼容
        input.focus();
        input.setSelectionRange(0, input.value.length);
        alert('链接已选中，请手动复制：' + input.value);
    }
}

// 初始化侧栏/菜单逻辑
function initMenu() {
    // 移动端：汉堡按钮控制侧栏显示/隐藏
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuPanel.classList.toggle('show');
        });
    }
}

// 初始化公告弹窗
function initNoticeModal() {
    // 显示公告弹窗
    noticeModal.style.display = 'flex';
    // 确认按钮关闭弹窗
    noticeConfirm.addEventListener('click', function() {
        noticeModal.style.display = 'none';
    });
}

// 初始化音乐相关逻辑
function initMusic() {
    // 音乐弹窗逻辑
    if (musicPreference === null) {
        // 首次访问显示弹窗
        musicModal.style.display = 'block';
        musicOverlay.classList.add('show');
    } else if (musicPreference === 'play') {
        // 用户之前选择播放
        initAudio();
        audio.play().catch(e => console.error('自动播放失败:', e));
        isPlaying = true;
        togglePlayBtn.textContent = "⏸️";
    }

    // 音乐弹窗按钮事件
    playMusicBtn.addEventListener('click', function() {
        musicModal.style.display = 'none';
        musicOverlay.classList.remove('show');
        setStorage('musicPreference', 'play');
        initAudio();
        audio.play().catch(e => console.error('播放失败:', e));
        isPlaying = true;
        togglePlayBtn.textContent = "⏸️";
    });

    cancelMusicBtn.addEventListener('click', function() {
        musicModal.style.display = 'none';
        musicOverlay.classList.remove('show');
        setStorage('musicPreference', 'pause');
    });

    // 音乐播放器按钮事件
    musicFloatBtn.addEventListener('click', togglePlayerPanel);
    togglePlayBtn.addEventListener('click', togglePlay);
    prevMusicBtn.addEventListener('click', playPrevMusic);
    nextMusicBtn.addEventListener('click', playNextMusic);
    musicProgress.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    avatarImg.addEventListener('click', toggleAvatarRotate);

    // 复制壁纸链接事件
    document.getElementById('copyWallpaperLink1').addEventListener('click', () => copyWallpaperLink('wallpaperLink1'));
    document.getElementById('copyWallpaperLink2').addEventListener('click', () => copyWallpaperLink('wallpaperLink2'));
}

// 初始化网站运行时间
function initRuntime() {
    const runtimeSpan = document.getElementById('runtimeSpan');
    if (runtimeSpan) {
        const startDate = new Date('2024-10-01');
        setInterval(function() {
            const now = new Date();
            const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
            runtimeSpan.textContent = ` | 网站已运行 ${diff} 天`;
        }, 86400000);
    }
}

// 页面加载完成后初始化所有逻辑
window.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initNoticeModal();
    initMusic();
    initRuntime();
});