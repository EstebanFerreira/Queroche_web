// ============================================
// QUEROCHE — JavaScript principal
// ============================================

let currentLang = 'es';
let projectsData = [];

// --- Cargar proyectos desde JSON ---
fetch('/data/projects.json')
  .then(r => r.json())
  .then(data => {
    projectsData = data.projects || [];
    renderProjects();
  })
  .catch(() => {
    // Si falla el fetch (ej. abrir index.html local), mostrar placeholder
    renderProjects();
  });

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (projectsData.length === 0) {
    grid.innerHTML = '<p style="color:var(--gray); text-align:center; grid-column:1/-1;">Próximamente...</p>';
    return;
  }

  grid.innerHTML = projectsData.map((p, i) => {
    const isLarge  = p.destacado === true;
    const nombre   = currentLang === 'es' ? p.nombre    : (p.nombre_en    || p.nombre);
    const foto     = p.foto || '';

    return `
      <div class="project-item${isLarge ? ' large' : ''}">
        ${foto
          ? `<img src="${foto}" alt="${nombre}" class="project-img" loading="lazy">`
          : `<div class="project-placeholder"><span>${nombre}</span></div>`
        }
        <div class="project-caption">
          <p class="project-name">${nombre}</p>
          <p class="project-location">${p.lugar}, ${p.fecha}</p>
        </div>
      </div>`;
  }).join('');

  // Reaplicar animaciones
  applyScrollAnimation(grid.querySelectorAll('.project-item'));
}

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
  renderProjects();
});

function translateAll() {
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
  document.querySelectorAll('[data-placeholder-es]').forEach(el => {
    const text = el.getAttribute('data-placeholder-' + currentLang);
    if (text) el.placeholder = text;
  });
}

// --- Imagen hero ---
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  heroImg.addEventListener('load',  () => heroImg.classList.add('loaded'));
  heroImg.addEventListener('error', () => heroImg.style.display = 'none');
}

// --- Animación scroll ---
function applyScrollAnimation(elements) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

applyScrollAnimation(document.querySelectorAll('.service-card, .stat'));
