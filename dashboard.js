import './components/Navbar.js';

let banjirData = { features: [] };
let genanganData = { features: [] };
let riauData = { features: [] };
let newsData = [];
let allPointData = [];
let filteredData = [];
let victimsChart = null;
let classificationChart = null;
let miniMap = null;
let miniOverlay = null;
let currentPage = 1;

const ITEMS_PER_PAGE = 8;
const ol = window.ol;

const $ = (id) => document.getElementById(id);

function safeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function numberValue(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchJsonSafe(path, fallback = null) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Gagal mengambil ${path}`);
      return fallback;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Gagal parse ${path}`, error);
    return fallback;
  }
}

async function loadData() {
  const [banjirRes, genanganRes, riauRes, newsRes] = await Promise.all([
    fetchJsonSafe('/data/banjir.json', { features: [] }),
    fetchJsonSafe('/data/csvjson.json', { features: [] }),
    fetchJsonSafe('/data/polygon_riau.json', { features: [] }),
    fetchJsonSafe('/data/news.json', [])
  ]);

  banjirData = banjirRes?.features ? banjirRes : { features: [] };
  genanganData = genanganRes?.features ? genanganRes : { features: [] };
  riauData = riauRes?.features ? riauRes : { features: [] };
  newsData = Array.isArray(newsRes) ? newsRes : [];
}

function calculateAndDisplayMetrics() {
  allPointData = [
    ...(banjirData.features || []).map((feature) => ({ ...feature, _type: 'Banjir' })),
    ...(genanganData.features || []).map((feature) => ({ ...feature, _type: 'Genangan' }))
  ];
  filteredData = [...allPointData];

  const totalFloodPoints = banjirData.features.length;
  const totalWaterloggingPoints = genanganData.features.length;
  const totalVictims = banjirData.features.reduce((sum, feature) => {
    return sum + numberValue(feature.properties?.Jumlah_Korban);
  }, 0);

  const districts = new Set();
  genanganData.features.forEach((feature) => {
    const district = feature.properties?.kecamatan;
    if (district) districts.add(normalizeText(district));
  });
  banjirData.features.forEach((feature) => {
    const district = feature.properties?.kecamatan || feature.properties?.KECAMATAN;
    if (district) districts.add(normalizeText(district));
  });

  animateMetric('totalFloodPoints', totalFloodPoints);
  animateMetric('totalWaterloggingPoints', totalWaterloggingPoints);
  animateMetric('totalVictims', totalVictims);
  animateMetric('affectedDistricts', districts.size);
}

function initCharts() {
  if (!window.Chart) {
    showErrorNotification('Chart.js gagal dimuat. Grafik tidak bisa ditampilkan.');
    return;
  }

  renderVictimsChart();
  renderClassificationChart();
}

function renderVictimsChart() {
  const ctx = $('victimsChart');
  if (!ctx) return;

  const victimsByLocation = {};
  banjirData.features.forEach((feature) => {
    const location = feature.properties?.Nama_Pemetaan || 'Tidak diketahui';
    victimsByLocation[location] = (victimsByLocation[location] || 0) + numberValue(feature.properties?.Jumlah_Korban);
  });

  const sorted = Object.entries(victimsByLocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (victimsChart) victimsChart.destroy();
  const existingChart = window.Chart.getChart(ctx);
  if (existingChart) existingChart.destroy();

  victimsChart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(([label]) => label),
      datasets: [{
        label: 'Jumlah Korban',
        data: sorted.map(([, value]) => value),
        backgroundColor: 'rgba(56, 189, 248, 0.65)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 0 }
        }
      },
      plugins: {
        legend: { labels: { color: '#f8fafc' } },
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });
}

function renderClassificationChart() {
  const ctx = $('classificationChart');
  if (!ctx) return;

  const classCount = {};
  riauData.features.forEach((feature) => {
    const status = feature.properties?.KLASIFIKAS || feature.properties?.STATUS_KOT || 'Tidak Terklasifikasi';
    classCount[status] = (classCount[status] || 0) + 1;
  });

  const labels = Object.keys(classCount);
  const data = Object.values(classCount);

  if (classificationChart) classificationChart.destroy();
  const existingChart = window.Chart.getChart(ctx);
  if (existingChart) existingChart.destroy();

  classificationChart = new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#38bdf8', '#818cf8', '#f59e0b', '#22c55e', '#ef4444', '#14b8a6'],
        borderColor: '#0f172a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#f8fafc', boxWidth: 14 } }
      }
    }
  });
}

function initializeMiniMap() {
  const mapTarget = $('miniMap');
  if (!mapTarget) return;

  if (!ol) {
    mapTarget.innerHTML = '<div class="p-4 text-danger">OpenLayers gagal dimuat.</div>';
    return;
  }

  mapTarget.innerHTML = '';

  if (miniMap) {
    miniMap.setTarget(null);
    miniMap = null;
  }

  const geoOptions = { featureProjection: 'EPSG:3857' };
  const banjirSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(banjirData, geoOptions)
  });
  const genanganSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(genanganData, geoOptions)
  });

  const banjirStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({ color: '#ef4444' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
    })
  });

  const genanganStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: '#38bdf8' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 1.5 })
    })
  });

  miniMap = new ol.Map({
    target: mapTarget,
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM() }),
      new ol.layer.Vector({ source: banjirSource, style: banjirStyle }),
      new ol.layer.Vector({ source: genanganSource, style: genanganStyle })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([101.4478, 0.5071]),
      zoom: 12
    })
  });

  const popup = document.createElement('div');
  popup.className = 'ol-popup dashboard-popup';
  popup.innerHTML = '<a href="#" class="ol-popup-closer"></a><div class="dashboard-popup-content"></div>';
  mapTarget.appendChild(popup);

  const popupContent = popup.querySelector('.dashboard-popup-content');
  const popupCloser = popup.querySelector('.ol-popup-closer');

  miniOverlay = new ol.Overlay({
    element: popup,
    autoPan: { animation: { duration: 250 } },
    positioning: 'bottom-center',
    offset: [0, -10]
  });
  miniMap.addOverlay(miniOverlay);

  popupCloser.addEventListener('click', (event) => {
    event.preventDefault();
    miniOverlay.setPosition(undefined);
  });

  miniMap.on('singleclick', (evt) => {
    const feature = miniMap.forEachFeatureAtPixel(evt.pixel, (feat) => feat, { hitTolerance: 8 });

    if (!feature) {
      miniOverlay.setPosition(undefined);
      return;
    }

    const props = feature.getProperties();
    const status = props.Nama_Pemetaan ? 'Banjir' : 'Genangan';
    const name = props.Nama_Pemetaan || props.jalan || 'Tanpa Nama';
    const district = props.kecamatan || props.KECAMATAN || '-';
    const victims = numberValue(props.Jumlah_Korban);

    popupContent.innerHTML = `
      <h6 class="mb-1 fw-bold text-dark">${safeHtml(status)}</h6>
      <hr class="my-1">
      <p class="mb-0 small text-dark"><strong>Lokasi:</strong> ${safeHtml(name)}</p>
      <p class="mb-0 small text-dark"><strong>Kecamatan:</strong> ${safeHtml(district)}</p>
      <p class="mb-0 small text-dark"><strong>Korban:</strong> ${safeHtml(victims)} Jiwa</p>
    `;
    miniOverlay.setPosition(evt.coordinate);
  });
}

function initializeDataTable() {
  const tableSearch = $('tableSearch');
  if (tableSearch) {
    tableSearch.addEventListener('input', (event) => {
      const term = normalizeText(event.target.value);
      filteredData = allPointData.filter((item) => {
        const props = item.properties || {};
        const text = normalizeText([
          item._type,
          props.Nama_Pemetaan,
          props.jalan,
          props.kecamatan,
          props.KECAMATAN
        ].filter(Boolean).join(' '));
        return text.includes(term);
      });
      currentPage = 1;
      renderTable();
    });
  }

  renderTable();
}

function renderTable() {
  const tableBody = $('dataTableBody');
  const pagination = document.querySelector('.pagination');
  if (!tableBody || !pagination) return;

  tableBody.innerHTML = '';
  pagination.innerHTML = '';

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(start, start + ITEMS_PER_PAGE);

  if (pageData.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Tidak ada data ditemukan.</td></tr>';
    return;
  }

  pageData.forEach((item) => {
    const props = item.properties || {};
    const type = item._type || (props.Nama_Pemetaan ? 'Banjir' : 'Genangan');
    const name = props.Nama_Pemetaan || props.jalan || '-';
    const district = props.kecamatan || props.KECAMATAN || '-';
    const victims = numberValue(props.Jumlah_Korban);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4"><span class="badge ${type === 'Banjir' ? 'bg-danger' : 'bg-info'}">${safeHtml(type)}</span></td>
      <td class="px-4">${safeHtml(name)}</td>
      <td class="px-4">${safeHtml(district)}</td>
      <td class="px-4">${safeHtml(victims)}</td>
      <td class="px-4 text-end">
        <button class="btn btn-sm btn-outline-light view-map-btn" type="button" title="Lihat di peta">
          <i class="ri-map-pin-line"></i>
        </button>
      </td>
    `;

    row.querySelector('.view-map-btn').addEventListener('click', () => focusMiniMap(item));
    tableBody.appendChild(row);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;

  function createButton(label, page, disabled = false, active = false) {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link bg-dark border-secondary text-light" href="#">${label}</a>`;
    li.addEventListener('click', (event) => {
      event.preventDefault();
      if (disabled || page === currentPage) return;
      currentPage = page;
      renderTable();
    });
    return li;
  }

  pagination.appendChild(createButton('Prev', Math.max(1, currentPage - 1), currentPage === 1));

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let page = start; page <= end; page++) {
    pagination.appendChild(createButton(String(page), page, false, page === currentPage));
  }

  pagination.appendChild(createButton('Next', Math.min(totalPages, currentPage + 1), currentPage === totalPages));
}

function focusMiniMap(item) {
  if (!miniMap || !ol || !item.geometry?.coordinates) return;

  const coords = ol.proj.fromLonLat(item.geometry.coordinates);
  miniMap.getView().animate({ center: coords, zoom: 15, duration: 700 });
  $('miniMap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function populateNewsSection() {
  const container = $('newsContainer');
  if (!container) return;

  const items = newsData.slice(0, 4);
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p class="text-muted p-3">Belum ada berita terkini.</p>';
    return;
  }

  items.forEach((news) => {
    const title = news.title || 'Tanpa Judul';
    const date = news.publishedAt || news.date || null;
    const description = news.description || news.excerpt || 'Tidak ada deskripsi.';
    const url = news.url || '#';
    const formattedDate = date
      ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-';

    const card = document.createElement('div');
    card.className = 'news-mini-card mb-3';
    card.innerHTML = `
      <div class="p-3 border border-secondary rounded bg-dark-subtle h-100">
        <h6 class="fw-bold text-light mb-1">${safeHtml(title)}</h6>
        <small class="text-muted d-block mb-2">${safeHtml(formattedDate)}</small>
        <p class="small text-secondary mb-2">${safeHtml(description)}</p>
        <a href="${safeHtml(url)}" class="btn btn-sm btn-link p-0">Baca selengkapnya &rarr;</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupEventListeners() {
  $('refreshBtn')?.addEventListener('click', () => location.reload());
  $('exportBtn')?.addEventListener('click', exportData);
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    total: allPointData.length,
    data: allPointData
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'floodguard-data-export.json';
  link.click();
  URL.revokeObjectURL(url);
  showSuccessNotification('Data berhasil diekspor. Akhirnya ada yang keluar dari sistem selain error.');
}

function showLoadingSpinner() {
  let spinner = $('loadingSpinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'loading-overlay';
    spinner.innerHTML = '<div class="spinner-border text-primary" role="status"></div><p class="mt-3 mb-0">Memuat dashboard...</p>';
    document.body.appendChild(spinner);
  }
}

function hideLoadingSpinner() {
  $('loadingSpinner')?.remove();
}

function animateMetric(id, targetValue) {
  const element = $(id);
  if (!element) return;

  const target = numberValue(targetValue);
  const duration = 700;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.floor(progress * target).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function showSuccessNotification(message) {
  console.log('Success:', message);
}

function showErrorNotification(message) {
  console.error(message);
}

document.addEventListener('DOMContentLoaded', async () => {
  showLoadingSpinner();

  try {
    await loadData();
    calculateAndDisplayMetrics();
    populateNewsSection();
    initCharts();
    initializeDataTable();
    initializeMiniMap();
    setupEventListeners();
    showSuccessNotification('Dashboard berhasil dimuat. Hidup sedikit lebih tertata.');
  } catch (error) {
    console.error('Critical Error:', error);
    showErrorNotification('Terjadi kesalahan saat memuat dashboard. Cek console untuk detail.');
  } finally {
    hideLoadingSpinner();
  }
});
