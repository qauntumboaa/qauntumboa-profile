let hasUserInteracted = false;

function initStartAmbience() {
  const canvas = document.getElementById('start-ambience');
  const startScreen = document.getElementById('start-screen');
  if (!canvas || !startScreen) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const mouse = { x: -1000, y: -1000 };
  let particles = [];
  let animationFrame = 0;

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const count = Math.min(90, Math.max(36, Math.round(window.innerWidth * window.innerHeight / 18000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.75,
      radius: Math.random() * 1.6 + 0.5,
      hue: Math.random() > 0.75 ? 335 : 180
    }));
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const particle of particles) {
      {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 100) {
          particle.vx += dx / distance * 0.08;
          particle.vy += dy / distance * 0.08;
        }
        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > 1.1) {
          particle.vx = particle.vx / speed * 1.1;
          particle.vy = particle.vy / speed * 1.1;
        } else if (speed < 0.35) {
          particle.vx += (Math.random() - 0.5) * 0.12;
          particle.vy += (Math.random() - 0.5) * 0.12;
        }
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) {
          particle.x = 0;
          particle.vx = Math.abs(particle.vx);
        } else if (particle.x > window.innerWidth) {
          particle.x = window.innerWidth;
          particle.vx = -Math.abs(particle.vx);
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy = Math.abs(particle.vy);
        } else if (particle.y > window.innerHeight) {
          particle.y = window.innerHeight;
          particle.vy = -Math.abs(particle.vy);
        }
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${particle.hue}, 90%, 70%, 0.85)`;
      context.shadowColor = `hsla(${particle.hue}, 90%, 60%, 0.8)`;
      context.shadowBlur = 8;
      context.fill();
    }

    context.shadowBlur = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < 175) {
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(0, 206, 209, ${(1 - distance / 175) * 0.28})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }
    }

    animationFrame = requestAnimationFrame(draw);
  }

  startScreen.addEventListener('pointermove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  startScreen.addEventListener('pointerleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
  window.addEventListener('resize', resize);

  startScreen.addEventListener('click', () => {
    canvas.style.opacity = '0';
    cancelAnimationFrame(animationFrame);
  }, { once: true });
  startScreen.addEventListener('touchstart', () => {
    canvas.style.opacity = '0';
    cancelAnimationFrame(animationFrame);
  }, { once: true });

  resize();
  draw();
}

function initProfileAmbience() {
  const canvas = document.getElementById('profile-network');
  const profileBlock = document.getElementById('profile-block');
  if (!canvas || !profileBlock) return () => {};

  const context = canvas.getContext('2d');
  if (!context) return () => {};

  let width = 0;
  let height = 0;
  let particles = [];
  let started = false;

  function resize() {
    const bounds = profileBlock.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const count = Math.min(48, Math.max(24, Math.round(width * height / 5500)));
    particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.45 + Math.random() * 0.45;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 1.4 + 0.5,
        hue: Math.random() > 0.75 ? 310 : 275
      };
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${particle.hue}, 90%, 75%, 0.8)`;
      context.shadowColor = `hsla(${particle.hue}, 90%, 65%, 0.8)`;
      context.shadowBlur = 7;
      context.fill();
    }

    context.shadowBlur = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < 135) {
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(168, 85, 247, ${(1 - distance / 135) * 0.28})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(profileBlock);
  } else {
    window.addEventListener('resize', resize);
  }

  return () => {
    if (started) return;
    started = true;
    resize();
    draw();
  };
}

function initClickEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function createBurst(x, y) {
    const burst = document.createElement('span');
    burst.className = 'click-burst';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;

    for (let i = 0; i < 7; i++) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.25;
      const distance = 16 + Math.random() * 12;
      particle.className = 'click-burst-particle';
      particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
      burst.appendChild(particle);
    }

    document.body.appendChild(burst);
    window.setTimeout(() => burst.remove(), 450);
  }

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !(event.target instanceof Element) || event.target.closest('input[type="range"]')) return;
    createBurst(event.clientX, event.clientY);
  });

  document.addEventListener('click', (event) => {
    if (event.detail !== 0 || !(event.target instanceof Element)) return;
    if (event.target.closest('input[type="range"]')) return;

    const target = event.target.closest('button, a, #start-screen, #profile-block') || event.target;
    const bounds = target.getBoundingClientRect();
    createBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  });
}

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true; 

  
  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initClickEffects();
  initStartAmbience();
  const startProfileAmbience = initProfileAmbience();
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const backgroundMusic = document.getElementById('background-music');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const songSwitcher = document.getElementById('song-switcher');
  const currentTrackName = document.getElementById('current-track-name');
  const profileBlock = document.getElementById('profile-block');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
  }


  const startMessage = "Click me to enter";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);


  function showProfile() {
    startScreen.classList.add('hidden');
    if (backgroundMusic) {
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(err => {
        console.error("Failed to play music after start screen click:", err);
      });
    }
    profileBlock.classList.remove('hidden');
    startProfileAmbience();
    if (window.gsap) {
      gsap.fromTo(profileBlock,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
          profileBlock.classList.add('profile-appear');
          profileContainer.classList.add('orbit');
        }}
      );
    } else {
      profileBlock.style.opacity = '1';
      profileBlock.style.transform = 'translate(-50%, -50%)';
      profileContainer.classList.add('orbit');
    }
    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    scrambleTabTitle();
    typeWriterBio();
  }

  startScreen.addEventListener('click', showProfile);

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showProfile();
  });


  const name = "QauntumBoa";
  const randomNameCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);

  function scrambleTabTitle() {
    const animationStartedAt = Date.now();
    const scrambleDuration = 500;
    const scrambleInterval = setInterval(() => {
      document.title = Array.from({ length: 24 }, () =>
        randomNameCharacters[Math.floor(Math.random() * randomNameCharacters.length)]
      ).join('');

      if (Date.now() - animationStartedAt >= scrambleDuration) {
        clearInterval(scrambleInterval);
        document.title = name;
        setTimeout(scrambleTabTitle, 1000);
      }
    }, 40);
  }


  const bioMessages = [
    "hi, im qauntumboa, a cybersecurity enthusiast, semi-experienced pentester, malware analyst and reverse engineer/data analyst. im a extreme advocate for privacy and heavily against mass surviellence, unconstitutional privacy intrusions of U.S. citizens commited to the unaware and innocent public. PS- everything i do is LEGAL and is in controlled enviornments ONLY, following U.S. federal law.",
    "\"sudo apt install super-opsec\""
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 1500);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 55 : 100);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;
  const tracks = [
    { title: 'Stop the H8', src: 'assets/h8swag%20-%20stop%20the%20h8.mp3' },
    { title: 'Блюз - Урал Гайсин', src: 'assets/блюз - урал гайсин.mp3' }
  ];
  let currentTrackIndex = 0;

  songSwitcher.addEventListener('click', () => {
    const wasPlaying = !currentAudio.paused;
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    const track = tracks[currentTrackIndex];

    currentAudio.src = track.src;
    currentAudio.load();
    currentTrackName.textContent = track.title;
    songSwitcher.setAttribute('aria-label', `Switch to next song. Now playing ${track.title}`);

    if (wasPlaying) {
      currentAudio.play().catch((err) => {
        console.error('Failed to play selected song:', err);
      });
    }
  });

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    currentAudio.volume = volumeSlider.value;
    isMuted = false;
    currentAudio.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });


  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    if (opacity == 0) {
      profileBlock.style.background = 'rgba(0, 0, 0, 0)';
      profileBlock.style.borderOpacity = '0';
      profileBlock.style.borderColor = 'transparent';
      profileBlock.style.backdropFilter = 'none';
   
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    } else {
      profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileBlock.style.borderOpacity = opacity;
      profileBlock.style.borderColor = '';
      profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    }
  });


  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  typeWriterStart();
});