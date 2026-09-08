particlesJS('particles-js', {
    particles: {
        number: { 
            value: 80,
            density: { 
                enable: true, 
                value_area: 700
            } 
        },
        color: { 
            value: '#aaaaaa'
        },
        shape: { 
            type: 'circle', 
            stroke: { 
                width: 0, 
                color: '#000000' 
            } 
        },
        opacity: { 
            value: 0.5,
            random: true, 
            anim: { 
                enable: true, 
                speed: 1.0,
                opacity_min: 0.2,
                sync: false 
            } 
        },
        size: { 
            value: 4,
            random: true, 
            anim: { 
                enable: true, 
                speed: 3,
                size_min: 2,
                sync: false 
            } 
        },
        line_linked: { 
            enable: true, 
            distance: 180,
            color: '#888888',
            opacity: 0.4,
            width: 1.0
        },
        move: { 
            enable: true, 
            speed: 1.0,
            direction: 'none', 
            random: true, 
            straight: false, 
            out_mode: 'out', 
            bounce: false, 
            attract: { 
                enable: false, 
                rotateX: 600, 
                rotateY: 1200 
            } 
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { 
                enable: true, 
                mode: 'repulse'
            }, 
            onclick: { 
                enable: true, 
                mode: 'push'
            }, 
            resize: true 
        },
        modes: { 
            repulse: { 
                distance: 150,
                duration: 0.4 
            }, 
            push: { 
                particles_nb: 6
            } 
        }
    },
    retina_detect: true
});


document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');
    const cursorElement = document.querySelector('.cursor-blink');
    const text = 'D) 420username';
    let index = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!isDeleting) {
            if (index <= text.length) {
                textElement.textContent = text.substring(0, index);
                index++;
                setTimeout(typeEffect, 100 + Math.random() * 80);
            } else {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
            }
        } else {
            if (index > 0) {
                textElement.textContent = text.substring(0, index - 1);
                index--;
                setTimeout(typeEffect, 50 + Math.random() * 40);
            } else {
                isDeleting = false;
                setTimeout(typeEffect, 500);
            }
        }
    }

    setTimeout(typeEffect, 500);
});

const enterScreen = document.getElementById('enterScreen');
const page = document.getElementById('page');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');

let progressInterval = null;

enterScreen.addEventListener('click', async () => {
    try {
        music.volume = 0.1;
        await music.play();
        musicBtn.classList.add('active');
        progressFill.classList.add('playing');
        startProgress();
    } catch (error) {
        console.error('Nie udało się uruchomić muzyki:', error);
    }
    enterScreen.classList.add('hidden');
    page.classList.add('visible');
});

musicBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    toggleMusic();
});

progressBar.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (music.duration) {
        music.currentTime = percent * music.duration;
    }
});

volumeSlider.addEventListener('input', function() {
    music.volume = this.value;
    if (this.value == 0) {
        volumeBtn.classList.add('muted');
    } else {
        volumeBtn.classList.remove('muted');
    }
});

volumeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (music.volume > 0) {
        music.volume = 0;
        volumeSlider.value = 0;
        this.classList.add('muted');
    } else {
        music.volume = 0.3;
        volumeSlider.value = 0.3;
        this.classList.remove('muted');
    }
});

document.getElementById('musicPlayer').addEventListener('mouseenter', function() {
    const container = this.querySelector('.volume-slider-container');
    container.classList.add('active');
});
document.getElementById('musicPlayer').addEventListener('mouseleave', function() {
    const container = this.querySelector('.volume-slider-container');
    container.classList.remove('active');
});

volumeBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const container = this.closest('.music-player').querySelector('.volume-slider-container');
    container.classList.toggle('active');
});

function toggleMusic() {
    if (music.paused) {
        music.volume = 0.1;
        music.play().then(() => {
            musicBtn.classList.add('active');
            progressFill.classList.add('playing');
            startProgress();
        }).catch(err => console.error('Błąd odtwarzania:', err));
    } else {
        music.pause();
        musicBtn.classList.remove('active');
        progressFill.classList.remove('playing');
        clearInterval(progressInterval);
    }
}

function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (music.duration && !music.paused) {
            const percent = (music.currentTime / music.duration) * 100;
            progressFill.style.width = percent + '%';
            timeDisplay.textContent = formatTime(music.currentTime);
        }
    }, 100);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

music.addEventListener('timeupdate', () => {
    if (music.duration) {
        const percent = (music.currentTime / music.duration) * 100;
        progressFill.style.width = percent + '%';
        timeDisplay.textContent = formatTime(music.currentTime);
    }
});

music.addEventListener('ended', () => {
    music.currentTime = 0;
    progressFill.style.width = '0%';
    timeDisplay.textContent = '0:00';
    musicBtn.classList.remove('active');
    progressFill.classList.remove('playing');
    clearInterval(progressInterval);
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ['c', 'v', 'x', 'a', 's', 'u', 'p', 'i', 'j'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            return false;
        }
    }
    if (e.key === 'F12' || e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
    }
    if (e.key === ' ' && !e.repeat && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        toggleMusic();
    }
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});
document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});
document.addEventListener('paste', function(e) {
    e.preventDefault();
    return false;
});

let devtoolsOpen = false;
const threshold = 160;
setInterval(function() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            console.clear();
            console.log(
                '%c🛑 Zabezpieczenie! DevTools wykryte!',
                'color: red; font-size: 20px; font-weight: bold;'
            );
        }
    } else {
        devtoolsOpen = false;
    }
}, 1000);

music.volume = 0.1;

volumeSlider.addEventListener('input', function() {
    let val = parseFloat(this.value);
    if (val > 0.15) {
        val = 0.15;
        this.value = 0.15;
    }
    music.volume = val;
    if (val == 0) {
        volumeBtn.classList.add('muted');
    } else {
        volumeBtn.classList.remove('muted');
    }
});