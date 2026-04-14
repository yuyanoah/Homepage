(async () => {
  const res = await fetch('assets/publications.json?v=3');
  const data = await res.json();
  const fullList = document.getElementById('pub-list');
  const homeList = document.getElementById('home-pub-list');
  if (!fullList && !homeList) return;

  const pubs = data.publications.slice().sort((a, b) => b.year - a.year || b.citations - a.citations);

  function highlightAuthors(p) {
    let authors = p.authors;
    const coFirstNames = p.co_first_authors || (p.co_first ? ['Y Kiguchi'] : []);

    coFirstNames.forEach(name => {
      const isKiguchi = /Y(uya)? Kiguchi/.test(name);
      if (isKiguchi) {
        const suffix = '\u2020' + (p.corresponding ? '*' : '');
        authors = authors.replace(/Y(uya)? Kiguchi/g, `<strong>Y Kiguchi${suffix}</strong>`);
      } else {
        const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        authors = authors.replace(new RegExp(esc, 'g'), `<strong>${name}\u2020</strong>`);
      }
    });

    // corresponding only (no co-first)
    if (p.corresponding && !coFirstNames.some(n => /Y(uya)? Kiguchi/.test(n))) {
      authors = authors.replace(/Y(uya)? Kiguchi/g, '<strong>Y Kiguchi*</strong>');
    }

    // bold Y Kiguchi if not yet highlighted
    if (!p.co_first && !p.corresponding && !p.co_first_authors) {
      authors = authors.replace(/Y(uya)? Kiguchi/g, '<strong>Y Kiguchi</strong>');
    }

    return authors;
  }

  function renderPubs(items) {
    return items.map(p => {
      const authorsHl = highlightAuthors(p);
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
  if (homeList) homeList.innerHTML = renderPubs(pubs.filter(p => p.selected));
})();
