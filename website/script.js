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

const enterScreen = document.getElementById('enterScreen');
const page = document.getElementById('page');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');

let progressInterval = null;

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateProgress() {
    if (music.duration) {
        const percent = (music.currentTime / music.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(music.currentTime);
        totalTimeEl.textContent = formatTime(music.duration);
    }
}

function toggleMusic() {
    if (music.paused) {
        music.play().then(() => {
            musicBtn.classList.add('playing');
            startProgress();
        }).catch(() => {});
    } else {
        music.pause();
        musicBtn.classList.remove('playing');
        clearInterval(progressInterval);
    }
}

function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, 200);
}

function saveMusicState() {
    localStorage.setItem('musicCurrentTime', music.currentTime || 0);
    localStorage.setItem('musicPlaying', !music.paused ? 'true' : 'false');
    localStorage.setItem('musicVolume', music.volume || 0.15);
}

function restoreMusicState() {
    const savedTime = parseFloat(localStorage.getItem('musicCurrentTime')) || 0;
    const savedPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.15;
    
    music.currentTime = savedTime;
    music.volume = savedVolume;
    volumeSlider.value = savedVolume;
    
    if (savedPlaying) {
        music.play().catch(() => {});
        musicBtn.classList.add('playing');
        startProgress();
    }
    updateProgress();
}

musicBtn.addEventListener('click', toggleMusic);

music.addEventListener('timeupdate', updateProgress);
music.addEventListener('loadedmetadata', function() {
    totalTimeEl.textContent = formatTime(music.duration);
});

progressBar.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (music.duration) {
        music.currentTime = percent * music.duration;
        updateProgress();
    }
});

volumeSlider.addEventListener('input', function() {
    music.volume = parseFloat(this.value);
    if (this.value == 0) {
        volumeBtn.classList.add('muted');
    } else {
        volumeBtn.classList.remove('muted');
    }
});

volumeBtn.addEventListener('click', function() {
    if (music.volume > 0) {
        music.volume = 0;
        volumeSlider.value = 0;
        this.classList.add('muted');
    } else {
        music.volume = 0.15;
        volumeSlider.value = 0.15;
        this.classList.remove('muted');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === ' ' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        toggleMusic();
    }
});

window.addEventListener('beforeunload', saveMusicState);

if (sessionStorage.getItem('returningFromProjects') === 'true') {
    sessionStorage.removeItem('returningFromProjects');
    enterScreen.classList.add('hidden');
    page.classList.add('visible');
    restoreMusicState();
}

enterScreen.addEventListener('click', async () => {
    try {
        music.volume = 0.15;
        await music.play();
        musicBtn.classList.add('playing');
        startProgress();
    } catch (error) {
        console.error('Nie udało się uruchomić muzyki:', error);
    }
    enterScreen.classList.add('hidden');
    page.classList.add('visible');
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

(function initTypingAnimation() {
    const lines = [
        { id: 'line1', text: 'code' },
        { id: 'line2', text: 'create' },
        { id: 'line3', text: 'repeat' }
    ];

    const elements = lines.map(line => document.getElementById(line.id));

    if (elements.some(el => !el)) return;

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function clearAllLines() {
        elements.forEach(el => {
            el.textContent = '';
        });
    }

    function typeLine() {
        if (isPaused) {
            isPaused = false;
            currentLineIndex = 0;
            currentCharIndex = 0;
            isDeleting = false;

            clearAllLines();

            setTimeout(typeLine, 300);
            return;
        }

        const line = lines[currentLineIndex];
        const element = elements[currentLineIndex];

        if (!isDeleting) {
            element.textContent = line.text.substring(
                0,
                currentCharIndex + 1
            );

            currentCharIndex++;

            if (currentCharIndex >= line.text.length) {
                if (currentLineIndex === lines.length - 1) {
                    isDeleting = true;

                    setTimeout(typeLine, 1200);
                } else {
                    currentLineIndex++;
                    currentCharIndex = 0;

                    setTimeout(typeLine, 200);
                }

                return;
            }

            setTimeout(
                typeLine,
                60 + Math.random() * 40
            );

        } else {
            currentCharIndex--;

            element.textContent = line.text.substring(
                0,
                currentCharIndex
            );

            if (currentCharIndex <= 0) {
                element.textContent = '';

                if (currentLineIndex === 0) {
                    isPaused = true;

                    setTimeout(typeLine, 500);
                } else {
                    currentLineIndex--;
                    currentCharIndex =
                        lines[currentLineIndex].text.length;

                    setTimeout(typeLine, 150);
                }

                return;
            }

            setTimeout(
                typeLine,
                30 + Math.random() * 30
            );
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(typeLine, 500);
    } else {
        window.addEventListener('load', function () {
            setTimeout(typeLine, 500);
        });
    }
})();
