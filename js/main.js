// ============================================
// QUEROCHE — JavaScript principal
// ============================================

let currentLang = 'es';

// --- Navbar scroll ---
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// --- Cambio de idioma ---
document.getElementById('langToggle').addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  document.getElementById('langToggle').textContent = currentLang === 'es' ? 'EN' : 'ES';
  document.documentElement.lang = currentLang;
  translateAll();
});

function translateAll() {
  // Texto en data-es / data-en
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // Placeholders con data-placeholder-es / data-placeholder-en
  document.querySelectorAll('[data-placeholder-es]').forEach(el => {
    const text = el.getAttribute('data-placeholder-' + currentLang);
    if (text) el.placeholder = text;
  });
}

// --- Imagen hero: ocultar placeholder si carga bien ---
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  heroImg.addEventListener('load', () => {
    heroImg.classList.add('loaded');
  });
  heroImg.addEventListener('error', () => {
    heroImg.style.display = 'none';
  });
}

// --- Animación de entrada al hacer scroll ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .project-item, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
