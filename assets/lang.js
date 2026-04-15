
async function setLang(lang) {
  localStorage.setItem("lang", lang);
  const res = await fetch("assets/lang.json?v=4");
  const dict = await res.json();
  const trans = dict[lang] || dict.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (trans[key]) el.textContent = trans[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if (trans[key]) el.innerHTML = trans[key];
  });
}
(async () => {
  const lang = localStorage.getItem("lang") || "en";
  await setLang(lang);
  document.querySelectorAll(".lang-switch").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
})();
