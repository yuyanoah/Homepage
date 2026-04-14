(async () => {
  const res = await fetch('assets/publications.json');
  const data = await res.json();
  const fullList = document.getElementById('pub-list');
  const homeList = document.getElementById('home-pub-list');
  if (!fullList && !homeList) return;

  const pubs = data.publications.slice().sort((a, b) => b.year - a.year || b.citations - a.citations);

  function renderPubs(items) {
    return items.map(p => {
      const authorsHl = p.authors.replace(/Y(uya)? Kiguchi/g, '<strong>Y Kiguchi</strong>');
      const citeBadge = p.citations > 0
        ? `<span class="badge badge-cite">Cited by ${p.citations}</span>` : '';
      return `<div class="pub-card">
  <a class="pub-title" href="${p.url}" target="_blank" rel="noopener">${p.title}</a>
  <div class="pub-meta">
    <span class="pub-authors">${authorsHl}</span>
    <span class="badge badge-venue">${p.venue}</span>
    <span class="badge badge-year">${p.year}</span>
    ${citeBadge}
  </div>
</div>`;
    }).join('');
  }

  if (fullList) fullList.innerHTML = renderPubs(pubs);
  if (homeList) homeList.innerHTML = renderPubs(pubs.slice(0, 3));
})();
