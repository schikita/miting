// Loading animation
window.addEventListener('load', function () {
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    }, 2000);
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigation bar visibility on scroll
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }

    lastScrollTop = scrollTop;
});

// Burger menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Закрытие меню при клике по ссылке
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Counter animation for statistics
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number[data-count]');
            counters.forEach(counter => {
                animateCounter(counter);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Modal functionality
function openModal(element) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');

    const placeholder = element.querySelector('.photo-placeholder');
    const content = placeholder.innerHTML;

    modalContent.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    padding: 60px 40px;
                    border-radius: 15px;
                    text-align: center;
                    font-size: 1.5rem;
                    line-height: 1.4;
                    max-width: 600px;
                    margin: 10% auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                ">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📸</div>
                    ${content}
                    <div style="margin-top: 30px; font-size: 1rem; opacity: 0.8;">
                        * Фотография будет загружена из архива события
                    </div>
                </div>
            `;

    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function openVideoModal(element) {
    const modal = document.getElementById('videoModal');
    const modalContent = document.getElementById('videoModalContent');
    
    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }

    // Получаем данные из атрибутов элемента
    const videoSrc = element.getAttribute('data-video');
    const title = element.getAttribute('data-title');
    const description = element.getAttribute('data-description');
    
    // Если есть реальный видеофайл, показываем видео плеер
    if (videoSrc && videoSrc !== '#') {
        modalContent.innerHTML = `
            <div class="video-player">
                <video controls autoplay>
                    <source src="${videoSrc}" type="video/mp4">
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
                <div style="padding: 20px; background: #1a1a1a; color: white;">
                    <h3 style="margin: 0 0 10px 0;">${title}</h3>
                    <p style="margin: 0; opacity: 0.8;">${description}</p>
                </div>
            </div>
        `;
    } else {
        // Показываем заглушку, если видео еще не загружено
        modalContent.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #333, #555);
                color: white;
                padding: 60px 40px;
                border-radius: 15px;
                text-align: center;
                max-width: 700px;
                margin: 5% auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <div style="font-size: 4rem; margin-bottom: 20px;">🎬</div>
                <h3 style="font-size: 2rem; margin-bottom: 10px; color: #fff;">${title || 'Видеоматериал'}</h3>
                <p style="font-size: 1.2rem; opacity: 0.8; margin-bottom: 30px;">${description || 'Загрузка...'}</p>
                <div style="
                    aspect-ratio: 16/9;
                    background: linear-gradient(45deg, #1a472a, #ce1126);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 100px;
                        height: 100px;
                        background: rgba(255,255,255,0.9);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            width: 0;
                            height: 0;
                            border-left: 30px solid #1a472a;
                            border-top: 18px solid transparent;
                            border-bottom: 18px solid transparent;
                            margin-left: 8px;
                        "></div>
                    </div>
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 20px,
                            rgba(255,255,255,0.1) 20px,
                            rgba(255,255,255,0.1) 40px
                        );
                        animation: slide 2s linear infinite;
                    "></div>
                </div>
                <p style="font-size: 1rem; opacity: 0.7;">
                    * Видеоматериал будет загружен из архива события
                </p>
            </div>
        `;
    }

    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Функция закрытия видео модального окна
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            // Останавливаем видео при закрытии
            const video = modal.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }, 300);
    }
}
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal on click outside content
window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic background animation
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 100 + 50}px;
                    height: ${Math.random() * 100 + 50}px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
        hero.appendChild(element);
    }
}

// Initialize floating elements
createFloatingElements();

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 4px;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                z-index: 10001;
                transition: width 0.1s ease;
            `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrolled / maxScroll) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

createScrollProgress();

// Add ripple effect to buttons and interactive elements
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Apply ripple to interactive elements
document.querySelectorAll('.photo-item, .video-item, .nav-links a').forEach(el => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', createRipple);
});

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after loading
setTimeout(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    typeWriter(subtitle, text, 30);
}, 3000);

// Add 3D tilt effect to cards
document.querySelectorAll('.photo-item, .video-item, .stat-item, .info-card, .participant-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

function createEmbers(count = 30) {
    const hero = document.querySelector('.hero');

    for (let i = 0; i < count; i++) {
        const ember = document.createElement('div');
        ember.classList.add('ember');

        // случайный размер
        const size = Math.random() * 4 + 2;
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;

        // случайная позиция по ширине
        ember.style.left = `${Math.random() * 100}%`;

        // случайная длительность и задержка
        const duration = Math.random() * 5 + 4; // 4–9s
        const delay = Math.random() * 5;
        ember.style.animationDuration = `${duration}s`;
        ember.style.animationDelay = `${delay}s`;

        hero.appendChild(ember);
    }
}

createEmbers();


const images = [
    "./assets/img/brest-1.JPG",
    "./assets/img/brest-2.JPG",
    "./assets/img/brest-3.JPG",
    "./assets/img/brest-4.JPG",
    "./assets/img/brest-5.JPG",
    "./assets/img/brest-6.JPG",
    "./assets/img/brest-7.JPG",
    "./assets/img/brest-8.JPG"
];

let currentIndex = 0;

function openGallery(index) {
    currentIndex = index;
    const galleryModal = document.getElementById("galleryModal");
    galleryModal.style.display = "flex"; // показываем модалку
    updateImage(); // обновляем фото
}


function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
}

function changeSlide(step) {
    currentIndex = (currentIndex + step + images.length) % images.length;
    updateImage();
}

function updateImage() {
    const img = document.getElementById("modalImage");
    if (images[currentIndex]) {
        img.src = images[currentIndex];
        img.style.display = "block";
    } else {
        img.style.display = "none"; // если картинка не найдена
    }
}


// поддержка клавиатуры
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeSlide(-1);
    if (e.key === "ArrowRight") changeSlide(1);
    if (e.key === "Escape") closeGallery();
});


let startX = 0;

const modal = document.getElementById("galleryModal");
const modalImg = document.getElementById("modalImage");

modalImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

modalImg.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) {
    changeSlide(1); // свайп влево → следующее фото
  } else if (endX - startX > 50) {
    changeSlide(-1); // свайп вправо → предыдущее фото
  }
});

function updateImage() {
  const modalImg = document.getElementById("modalImage");
  modalImg.style.opacity = 0;
  setTimeout(() => {
    modalImg.src = images[currentIndex];
    modalImg.onload = () => {
      modalImg.style.opacity = 1;
    };
  }, 200);
}


 // Кнопка "Наверх" + прогресс прокрутки
  (function(){
    const btn = document.getElementById('toTop');
    if(!btn) return;
    const fg = btn.querySelector('.fg');
    const CIRCUM = 120; // stroke-dasharray

    function onScroll(){
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const progress = Math.min(scrollTop / max, 1);
      if(fg) fg.style.strokeDashoffset = String(CIRCUM * (1 - progress));

      if(scrollTop > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});

    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();


  document.addEventListener("DOMContentLoaded", function () {
  const lazyMedia = document.querySelectorAll("img[loading=lazy], video[preload=none]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.dataset.src) {
          el.src = el.dataset.src;
        }

        if (el.tagName === "VIDEO") {
          el.preload = "auto";
        }

        observer.unobserve(el);
      }
    });
  });

  lazyMedia.forEach(el => observer.observe(el));
});

