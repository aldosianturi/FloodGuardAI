function safeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getCategoryClass(category) {
  if (category === 'Berita') return 'category-news';
  if (category === 'Analisis Data') return 'category-analysis';
  return 'category-update';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function loadNews() {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer) return;

  const loadingSpinner = newsContainer.querySelector('.loading-spinner');

  try {
    const response = await fetch('/data/news.json');
    if (!response.ok) throw new Error('Gagal memuat data berita');

    const newsData = await response.json();
    if (!Array.isArray(newsData)) throw new Error('Format news.json harus array');

    if (loadingSpinner) loadingSpinner.remove();
    newsContainer.innerHTML = '';

    if (newsData.length === 0) {
      newsContainer.innerHTML = '<p class="text-center text-muted">Belum ada berita.</p>';
      return;
    }

    const newsGrid = document.createElement('div');
    newsGrid.className = 'row g-4';

    newsData.forEach((article) => {
      const card = document.createElement('div');
      card.className = 'col-lg-4 col-md-6';

      const title = article.title || 'Tanpa Judul';
      const category = article.category || 'Update';
      const excerpt = article.excerpt || article.description || 'Tidak ada ringkasan.';
      const imageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1170&q=80';
      const date = article.date || article.publishedAt;
      const url = article.url || '#';

      card.innerHTML = `
        <article class="news-card h-100">
          <img src="${safeHtml(imageUrl)}" class="card-img-top" alt="${safeHtml(title)}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge ${getCategoryClass(category)}">${safeHtml(category)}</span>
            <h5 class="card-title mt-2">${safeHtml(title)}</h5>
            <p class="card-text text-muted">${safeHtml(excerpt)}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto gap-3">
              <small class="text-muted">${safeHtml(formatDate(date))}</small>
              <a href="${safeHtml(url)}" class="btn btn-sm btn-outline-light read-more-btn" data-id="${safeHtml(article.id || '')}">Baca</a>
            </div>
          </div>
        </article>
      `;
      newsGrid.appendChild(card);
    });

    newsContainer.appendChild(newsGrid);

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.utils.toArray('.news-card').forEach((card, index) => {
        window.gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          delay: index * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%'
          }
        });
      });
    }
  } catch (error) {
    console.error('Error:', error);
    newsContainer.innerHTML = '<p class="text-danger text-center">Gagal memuat data berita. Periksa file <code>public/data/news.json</code>.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
