/**
 * Audio Player Controller
 *
 * Handles standard audio players, voice messages, and inline autoplay.
 */
(function () {
    function formatTime(s) {
        if (!isFinite(s) || s < 0) return '00:00';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }
    function drawVoiceWave(canvas, duration, isPlaying, progress) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var w = canvas.clientWidth || 160;
        var h = canvas.clientHeight || 24;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        var bars = Math.floor(w / 5);
        var barW = 2;
        var gap = 3;
        for (var i = 0; i < bars; i++) {
            var barH = 4 + Math.random() * (h - 8);
            var x = i * (barW + gap);
            var y = (h - barH) / 2;
            var barProgress = (x + barW / 2) / w;
            var isActive = isPlaying && barProgress <= progress;
            ctx.fillStyle = isActive ? 'var(--accent-color, #4a7c59)' : 'rgba(0,0,0,0.12)';
            if (canvas.closest('[data-theme="dark"]') || document.documentElement.classList.contains('dark')) {
                ctx.fillStyle = isActive ? 'var(--accent-color, #4a7c59)' : 'rgba(255,255,255,0.15)';
            }
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, 1);
            ctx.fill();
        }
    }
    var activeAudio = null;
    var activeVoice = null;
    document.addEventListener('click', function (e) {
        var player = e.target.closest('.md-audio-player');
        if (player) {
            var container = player.closest('.md-directive-audio');
            var audioEl = container.querySelector('audio');
            var playBtn = player.querySelector('.md-audio-play');
            var pauseBtn = player.querySelector('.md-audio-pause');
            var progressBar = player.querySelector('.md-audio-progress-bar');
            var progressFill = player.querySelector('.md-audio-progress-fill');
            var timeCurrent = player.querySelector('.md-audio-time-current');
            var timeTotal = player.querySelector('.md-audio-time-total');
            var clickedPlay = e.target.closest('.md-audio-btn');
            var clickedBar = e.target.closest('.md-audio-progress-bar');
            if (!audioEl._inited) {
                audioEl._inited = true;
                audioEl.addEventListener('loadedmetadata', function () {
                    timeTotal.textContent = formatTime(audioEl.duration);
                });
                audioEl.addEventListener('timeupdate', function () {
                    if (!audioEl.duration) return;
                    var pct = audioEl.currentTime / audioEl.duration;
                    progressFill.style.width = (pct * 100) + '%';
                    timeCurrent.textContent = formatTime(audioEl.currentTime);
                });
                audioEl.addEventListener('ended', function () {
                    playBtn.style.display = 'inline-flex';
                    pauseBtn.style.display = 'none';
                    progressFill.style.width = '0%';
                    timeCurrent.textContent = '00:00';
                    if (activeAudio === audioEl) activeAudio = null;
                });
            }
            if (clickedPlay) {
                if (audioEl.paused) {
                    if (activeAudio && activeAudio !== audioEl) { activeAudio.pause(); }
                    audioEl.play();
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'inline-flex';
                    activeAudio = audioEl;
                } else {
                    audioEl.pause();
                    playBtn.style.display = 'inline-flex';
                    pauseBtn.style.display = 'none';
                    if (activeAudio === audioEl) activeAudio = null;
                }
                return;
            }
            if (clickedBar && audioEl.duration) {
                var rect = progressBar.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                audioEl.currentTime = pct * audioEl.duration;
                progressFill.style.width = (pct * 100) + '%';
            }
            return;
        }
        var voicePlayer = e.target.closest('.md-audio-voice-player');
        if (voicePlayer) {
            var container = voicePlayer.closest('.md-directive-audio');
            var src = container.dataset.src;
            var playIcon = voicePlayer.querySelector('.md-voice-icon-play');
            var pauseIcon = voicePlayer.querySelector('.md-voice-icon-pause');
            var canvas = voicePlayer.querySelector('.md-voice-wave');
            var duration = parseInt(container.dataset.duration, 10) || 0;
            if (!voicePlayer._audio) {
                voicePlayer._audio = new Audio(src);
                voicePlayer._audio.addEventListener('ended', function () {
                    playIcon.style.display = 'inline-flex';
                    pauseIcon.style.display = 'none';
                    if (activeVoice === voicePlayer._audio) activeVoice = null;
                });
                voicePlayer._audio.addEventListener('timeupdate', function () {
                    var progress = voicePlayer._audio.duration ? voicePlayer._audio.currentTime / voicePlayer._audio.duration : 0;
                    drawVoiceWave(canvas, duration, true, progress);
                });
            }
            var audio = voicePlayer._audio;
            if (audio.paused) {
                if (activeVoice && activeVoice !== audio) { activeVoice.pause(); }
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline-flex';
                activeVoice = audio;
                drawVoiceWave(canvas, duration, true, 0);
            } else {
                audio.pause();
                playIcon.style.display = 'inline-flex';
                pauseIcon.style.display = 'none';
                if (activeVoice === audio) activeVoice = null;
                drawVoiceWave(canvas, duration, false, 0);
            }
            return;
        }
    });

    function initInlineAudioAutoplay() {
        document.querySelectorAll('.md-audio-player[data-autoplay="1"]').forEach(function (player) {
            var container = player.closest('.md-directive-audio');
            if (!container) return;
            var audioEl = container.querySelector('audio');
            var playBtn = player.querySelector('.md-audio-play');
            var pauseBtn = player.querySelector('.md-audio-pause');
            if (!audioEl || !playBtn || !pauseBtn) return;
            if (!audioEl._inited) {
                audioEl._inited = true;
                audioEl.addEventListener('loadedmetadata', function () {
                    var timeTotal = player.querySelector('.md-audio-time-total');
                    if (timeTotal) timeTotal.textContent = formatTime(audioEl.duration);
                });
                audioEl.addEventListener('timeupdate', function () {
                    if (!audioEl.duration) return;
                    var progressFill = player.querySelector('.md-audio-progress-fill');
                    var timeCurrent = player.querySelector('.md-audio-time-current');
                    var pct = audioEl.currentTime / audioEl.duration;
                    if (progressFill) progressFill.style.width = (pct * 100) + '%';
                    if (timeCurrent) timeCurrent.textContent = formatTime(audioEl.currentTime);
                });
                audioEl.addEventListener('ended', function () {
                    playBtn.style.display = 'inline-flex';
                    pauseBtn.style.display = 'none';
                    var progressFill = player.querySelector('.md-audio-progress-fill');
                    if (progressFill) progressFill.style.width = '0%';
                    var timeCurrent = player.querySelector('.md-audio-time-current');
                    if (timeCurrent) timeCurrent.textContent = '00:00';
                    if (activeAudio === audioEl) activeAudio = null;
                });
            }
            audioEl.play().then(function () {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-flex';
                if (activeAudio && activeAudio !== audioEl) activeAudio.pause();
                activeAudio = audioEl;
            }).catch(function () {});
        });
    }
    if (document.readyState !== 'loading') initInlineAudioAutoplay();
    document.addEventListener('astro:page-load', initInlineAudioAutoplay);
})();
