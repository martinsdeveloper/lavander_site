async function fillProducts(products){
    const template = document.querySelector("div.products-grid div.template")
    products.forEach((e) => {
        console.log(e);
    });
}
async function applyTranslations(languageFile) {
    try {
        // Fetch translations from the JSON file
        const response = await fetch(languageFile);
        const translations = await response.json();

        // Map translations to elements using data attributes
        document.querySelectorAll("[data-translate]").forEach((element) => {
            const key = element.getAttribute("data-translate");
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        fillProducts(translations["products"]);
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

// Load Latvian translations on page load
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations("https://martinsdeveloper.github.io/lavander_site/translations/lv.json");
});