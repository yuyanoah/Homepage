(async () => {
  const res = await fetch('assets/conferences.json');
  const data = await res.json();
  const fullList = document.getElementById('conf-list');
  const homeList = document.getElementById('home-conf-list');
  if (!fullList && !homeList) return;

  const talks = data.conferences.slice().sort((a, b) => b.year - a.year);

  const typeColor = {
    'Invited Talk': 'badge-invited',
    'Selected Talk': 'badge-invited',
    'Oral': 'badge-oral'
  };

  function renderTalks(items) {
    return items.map(c => {
      const badgeClass = typeColor[c.type] || 'badge-oral';
      const upcomingTag = c.upcoming ? '<span class="badge badge-upcoming">Upcoming</span>' : '';
      return `<div class="pub-card">
  <span class="conf-title">${c.title}</span>
  <div class="pub-meta">
    <span class="pub-authors conf-venue">${c.venue}</span>
    <span class="badge badge-year">${c.year}</span>
    <span class="badge badge-location">${c.location}</span>
    <span class="badge ${badgeClass}">${c.type}</span>
    ${upcomingTag}
  </div>
</div>`;
    }).join('');
  }

  if (fullList) fullList.innerHTML = renderTalks(talks);
  if (homeList) homeList.innerHTML = renderTalks(talks.slice(0, 3));
})();
