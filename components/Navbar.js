const root = document.getElementById('navbar-root');

if (root) {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html', label: 'Home', icon: 'ri-home-5-line' },
    { href: 'map.html', label: 'Peta', icon: 'ri-map-pin-line' },
    { href: 'dashboard.html', label: 'Dashboard', icon: 'ri-dashboard-3-line' },
    { href: 'laporan.html', label: 'Laporan', icon: 'ri-file-chart-line' }
  ];

  const isActive = (href) => current === href || (current === '' && href === 'index.html');

  root.innerHTML = `
    <nav class="fixed left-0 top-0 z-[3000] w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div class="mx-auto flex min-h-[72px] w-[min(100%-28px,1400px)] items-center justify-between gap-4">
        <a href="index.html" class="group flex items-center gap-3 text-white no-underline">
          <span class="grid h-11 w-11 place-items-center rounded-2xl border border-sky-400/30 bg-sky-400/10 shadow-glow transition group-hover:scale-105">
            <i class="ri-flood-line text-xl text-sky-300"></i>
          </span>
          <span class="leading-tight">
            <span class="block font-display text-lg font-extrabold tracking-tight">FloodGuard AI</span>
            <span class="hidden text-xs font-semibold text-slate-400 sm:block">WebGIS Monitoring Banjir Riau</span>
          </span>
        </a>

        <button id="navToggle" type="button" class="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white lg:hidden" aria-label="Buka navigasi" aria-expanded="false">
          <i class="ri-menu-3-line"></i>
        </button>

        <div id="navLinks" class="hidden items-center gap-2 lg:flex">
          ${links.map((link) => `
            <a href="${link.href}" class="nav-pill ${isActive(link.href) ? 'nav-pill-active' : ''}">
              <i class="${link.icon}"></i>
              <span>${link.label}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <div id="mobileNavPanel" class="hidden border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div class="mx-auto grid w-[min(100%,720px)] gap-2">
          ${links.map((link) => `
            <a href="${link.href}" class="nav-mobile-pill ${isActive(link.href) ? 'nav-mobile-active' : ''}">
              <i class="${link.icon}"></i>
              <span>${link.label}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </nav>
  `;

  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNavPanel');

  toggle?.addEventListener('click', () => {
    const opened = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden', opened);
    toggle.setAttribute('aria-expanded', String(!opened));
    toggle.innerHTML = opened ? '<i class="ri-menu-3-line"></i>' : '<i class="ri-close-line"></i>';
  });
}
