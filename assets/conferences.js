(async () => {
  const res = await fetch('assets/conferences.json');
  const data = await res.json();
  const fullList = document.getElementById('conf-list');
  const homeList = document.getElementById('home-conf-list');
  if (!fullList && !homeList) return;

  const confs = data.conferences.slice().sort((a, b) => b.year - a.year);

  const typeColor = {
    'Oral': 'badge-oral',
    'Selected Talk': 'badge-oral',
    'Oral & Poster': 'badge-oral',
    'Poster': 'badge-poster'
  };

  function renderConfs(items) {
    return items.map(c => {
      const badgeClass = typeColor[c.type] || 'badge-poster';
      return `<div class="pub-card">
  <span class="conf-title">${c.title}</span>
  <div class="pub-meta">
    <span class="pub-authors conf-venue">${c.venue}</span>
    <span class="badge badge-year">${c.year}</span>
    <span class="badge badge-location">${c.location}</span>
    <span class="badge ${badgeClass}">${c.type}</span>
  </div>
</div>`;
    }).join('');
  }

  if (fullList) fullList.innerHTML = renderConfs(confs);
  if (homeList) homeList.innerHTML = renderConfs(confs.slice(0, 3));
})();
