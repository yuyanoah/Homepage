(async () => {
  const base = location.pathname.includes('/Homepage/') ? '/Homepage/' : '/';
  const res = await fetch(base + 'assets/fellowship.json');
  const data = await res.json();

  const fellowList = document.getElementById('fellowship-list');
  const awardList  = document.getElementById('award-list');

  function renderItems(items) {
    return items.map(item => `<div class="pub-card">
  <span class="conf-title">${item.title}</span>
  <div class="pub-meta">
    <span class="pub-authors">${item.organization}</span>
    <span class="badge badge-year">${item.year}</span>
  </div>
</div>`).join('');
  }

  if (fellowList) fellowList.innerHTML = renderItems(data.fellowships);
  if (awardList)  awardList.innerHTML  = renderItems(data.awards);
})();
