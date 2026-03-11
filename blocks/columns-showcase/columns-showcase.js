function createVideoElement(link) {
  const videoSrc = link.href;
  const wrapper = document.createElement('div');
  wrapper.className = 'columns-showcase-video';

  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';

  const playBtn = document.createElement('button');
  playBtn.className = 'columns-showcase-video-play';
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="31" stroke="white" stroke-width="2"/>
    <path d="M26 20L46 32L26 44V20Z" fill="white"/>
  </svg>`;

  wrapper.append(video, playBtn);

  let isPlaying = false;
  wrapper.addEventListener('click', () => {
    if (isPlaying) {
      video.pause();
      wrapper.classList.remove('playing');
    } else {
      video.play();
      wrapper.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  video.addEventListener('ended', () => {
    isPlaying = false;
    wrapper.classList.remove('playing');
    video.currentTime = 0;
  });

  return wrapper;
}

function addScrollZoom(imgCol) {
  imgCol.classList.add('columns-showcase-zoom');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgCol.classList.add('in-view');
        }
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(imgCol);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-showcase-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Handle MP4 links - convert to video players
      const mp4Link = col.querySelector('a[href$=".mp4"], a[href*=".mp4#"]');
      if (mp4Link && col.children.length === 1 && col.querySelector('p')) {
        const videoEl = createVideoElement(mp4Link);
        col.textContent = '';
        col.append(videoEl);
        col.classList.add('columns-showcase-img-col');
        return;
      }

      // Handle picture columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-showcase-img-col');
          addScrollZoom(picWrapper);
        }
      }
    });
  });
}
