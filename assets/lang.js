
async function setLang(lang) {
  localStorage.setItem("lang", lang);
  const res = await fetch("assets/lang.json");
  const dict = await res.json();
  const trans = dict[lang] || dict.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (trans[key]) el.textContent = trans[key];
  });
}
(async () => {
  const lang = localStorage.getItem("lang") || "en";
  await setLang(lang);
  document.querySelectorAll(".lang-switch").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
})();
