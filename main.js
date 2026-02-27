// 兼容老浏览器的localStorage判断
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// 公告弹窗逻辑
window.onload = function() {
    // 检查是否今日已关闭公告
    var noticeShown = supportsLocalStorage() ? localStorage.getItem('noticeShown') : null;
    if (!noticeShown) {
        document.getElementById('noticeModal').style.display = 'block';
    }

    // 公告确认按钮
    document.getElementById('noticeConfirm').onclick = function() {
        document.getElementById('noticeModal').style.display = 'none';
        if (supportsLocalStorage()) {
            localStorage.setItem('noticeShown', 'true');
            // 设置24小时后过期
            setTimeout(function() {
                localStorage.removeItem('noticeShown');
            }, 86400000);
        }
        // 显示音乐询问弹窗
        document.getElementById('musicModal').style.display = 'block';
    };

    // 音乐弹窗逻辑
    document.getElementById('musicYes').onclick = function() {
        document.getElementById('musicModal').style.display = 'none';
        document.getElementById('audioPlayer').play();
    };
    document.getElementById('musicNo').onclick = function() {
        document.getElementById('musicModal').style.display = 'none';
    };

    // 汉堡菜单逻辑
    var menuToggle = document.getElementById('menuToggle');
    var menuPanel = document.getElementById('menuPanel');
    menuToggle.onclick = function() {
        if (menuPanel.style.display === 'block') {
            menuPanel.style.display = 'none';
        } else {
            menuPanel.style.display = 'block';
        }
    };

    // 友情链接添加逻辑
    document.getElementById('addFriendLink').onclick = function() {
        var name = document.getElementById('newLinkName').value;
        var url = document.getElementById('newLinkUrl').value;
        if (name && url) {
            var newLink = document.createElement('div');
            newLink.className = 'friend-link-item';
            newLink.innerHTML = '<a href="' + url + '" target="_blank">' + name + '</a>';
            document.getElementById('addFriendLink').parentNode.before(newLink);
            // 清空输入框
            document.getElementById('newLinkName').value = '';
            document.getElementById('newLinkUrl').value = '';
        } else {
            alert('请输入完整的链接名称和地址！');
        }
    };

    // 复制猫猫壁纸链接
    document.getElementById('copyWallpaperLink').onclick = function() {
        var linkInput = document.getElementById('wallpaperLink');
        linkInput.select();
        try {
            document.execCommand('copy');
            alert('链接复制成功！');
        } catch (e) {
            alert('复制失败，请手动复制！');
        }
    };

    // 网站运行时间计算
    function runtime() {
        // 初始时间：2024/10/6 9:00:00
        var X = new Date("10/6/2024 9:00:00");
        var Y = new Date();
        var T = (Y.getTime() - X.getTime());
        var M = 24*60*60*1000;
        var a = T/M;
        var A = Math.floor(a);
        var b = (a - A)*24;
        var B = Math.floor(b);
        var c = (b - B)*60;
        var C = Math.floor((b - B)*60);
        var D = Math.floor((c - C)*60);
        // 写入到span
        document.getElementById('runtimeSpan').innerHTML = "本小破站已运行"+A+"天"+B+"小时"+C+"分"+D+"秒了......";
    }
    setInterval(runtime, 1000);
    runtime(); // 初始执行一次
};