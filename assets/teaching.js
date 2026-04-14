(async () => {
  const res = await fetch('assets/teaching.json');
  const data = await res.json();

  const supEl = document.getElementById('supervision-list');
  const courseEl = document.getElementById('course-list');

  const audienceColor = {
    'Undergraduate': 'badge-oral',
    'Graduate': 'badge-venue',
    'Industry': 'badge-invited',
    'High school': 'badge-poster'
  };

  if (supEl && data.supervision.length > 0) {
    supEl.innerHTML = data.supervision.map(s => `
      <div class="pub-card">
        <span class="conf-title">${s.name}</span>
        <div class="pub-meta">
          <span class="pub-authors">${s.degree} &mdash; ${s.institution}</span>
          <span class="badge badge-year">${s.period}</span>
        </div>
      </div>`).join('');
  }

  if (courseEl) {
    const sorted = data.courses.slice().sort((a, b) => b.year - a.year);
    courseEl.innerHTML = sorted.map(c => {
      const bc = audienceColor[c.audience] || 'badge-year';
      return `<div class="pub-card">
  <span class="conf-title">${c.course}</span>
  <div class="pub-meta">
    <span class="pub-authors conf-venue">${c.institution}</span>
    <span class="badge badge-year">${c.year}</span>
    <span class="badge ${bc}">${c.audience}</span>
  </div>
</div>`;
    }).join('');
  }
})();
