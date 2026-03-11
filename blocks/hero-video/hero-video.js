export default function decorate(block) {
  const rows = [...block.children];

  // Find MP4 link in the block
  let videoSrc = '';
  let ctaLink = null;

  rows.forEach((row) => {
    const link = row.querySelector('a[href$=".mp4"], a[href*=".mp4#"]');
    if (link) {
      const text = link.textContent.trim().toLowerCase();
      if (text === 'video' || !ctaLink) {
        if (text === 'video') {
          videoSrc = link.href;
        } else if (!videoSrc) {
          videoSrc = link.href;
          ctaLink = link;
        } else {
          ctaLink = link;
        }
      }
      if (text !== 'video' && ctaLink !== link) {
        ctaLink = link;
      }
    }
  });

  // Find the CTA row (the one with "Assistir vídeo" or similar)
  rows.forEach((row) => {
    const link = row.querySelector('a[href$=".mp4"], a[href*=".mp4#"]');
    if (link && link.textContent.trim().toLowerCase() !== 'video') {
      ctaLink = link;
    }
  });

  if (!videoSrc) return;

  // Clear the block
  block.textContent = '';

  // Create video element
  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('playsinline', '');
  block.append(video);

  // Create overlay with play button
  const overlay = document.createElement('div');
  overlay.className = 'hero-video-overlay';

  const playBtn = document.createElement('button');
  playBtn.className = 'hero-video-play';
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="31" stroke="white" stroke-width="2"/>
    <path d="M26 20L46 32L26 44V20Z" fill="white"/>
  </svg>`;
  overlay.append(playBtn);

  if (ctaLink) {
    const ctaText = document.createElement('p');
    ctaText.className = 'hero-video-cta';
    ctaText.textContent = ctaLink.textContent.trim();
    overlay.append(ctaText);
  }

  block.append(overlay);

  // Play/pause toggle
  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      video.pause();
      overlay.classList.remove('playing');
    } else {
      video.play();
      overlay.classList.add('playing');
    }
    isPlaying = !isPlaying;
  }

  overlay.addEventListener('click', togglePlay);

  video.addEventListener('ended', () => {
    isPlaying = false;
    overlay.classList.remove('playing');
    video.currentTime = 0;
  });
}
