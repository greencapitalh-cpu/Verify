(function autoTranslate() {
  const lang = navigator.language.split("-")[0];
  if (lang === "en") return;

  const notranslate = ["UDoChain", "You do. We validate."];

  if (!document.querySelector("#google-translate-script")) {
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    const div = document.createElement("div");
    div.id = "google_translate_element";
    div.style.display = "none";
    document.body.appendChild(div);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "es,pt,fr,it,de,zh,ja",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }

  notranslate.forEach((t) => {
    document.querySelectorAll("*").forEach((el) => {
      if (el.textContent?.includes(t)) {
        el.classList.add("notranslate");
        el.setAttribute("translate", "no");
      }
    });
  });
})();
