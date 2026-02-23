// ============================================
// QUEROCHE — JS
// ============================================

let currentLang = 'es';
let projectsData = [];

// --- Cursor personalizado ---
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// --- Menú overlay ---
const menuBtn     = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  menuOverlay.classList.toggle('open');
});

menuOverlay.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    menuOverlay.classList.remove('open');
  });
});

// --- Cargar proyectos ---
fetch('data/projects.json')
  .then(r => r.json())
  .then(data => {
    projectsData = data.projects || [];
    renderProjects();
  })
  .catch(() => renderProjects());

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (projectsData.length === 0) {
    grid.innerHTML = '<p style="color:#888; grid-column:1/-1; padding: 4rem 0;">Próximamente...</p>';
    return;
  }

  grid.innerHTML = projectsData.map(p => {
    const nombre = currentLang === 'es' ? p.nombre : (p.nombre_en || p.nombre);
    const foto   = p.foto || '';
    const large  = p.destacado ? ' large' : '';

    return `
      <div class="project-item${large} reveal">
        <div class="project-img-wrap">
          ${foto
            ? `<img src="${foto}" alt="${nombre}" loading="lazy">`
            : `<div class="project-placeholder"></div>`
          }
        </div>
        <div class="project-caption">
          <span class="project-name">${nombre}</span>
          <span class="project-location">${p.lugar}, ${p.fecha}</span>
        </div>
      </div>`;
  }).join('');

  observeReveal(grid.querySelectorAll('.reveal'));
}

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
    const val = el.getAttribute('data-' + currentLang);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-placeholder-es]').forEach(el => {
    const val = el.getAttribute('data-placeholder-' + currentLang);
    if (val) el.placeholder = val;
  });
}

// --- Reveal on scroll ---
function observeReveal(elements) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => obs.observe(el));
}

observeReveal(document.querySelectorAll('.service-row, .about-statement, .stat, .contact-headline'));
