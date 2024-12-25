async function fillProducts(products){
    const template_h = document.querySelector("div.products-grid div.template")
    products.forEach((product) => {
        template = template_h.cloneNode(true)
        template.querySelector("h3.name").textContent = product.title;
        template.querySelector("p.price").textContent = "€" + product.price;
        template.querySelector("img").setAttribute("src", product.image_url);
        template.querySelector("img").setAttribute("alt", product.alt);
        template.querySelector("button.primary").setAttribute("product_id", product.id);
        template.classList.remove("template");
        template.removeAttribute("hidden");
        template_h.parentElement.appendChild(template);
        console.log(product);
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
        return translations["products"];
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

// Load Latvian translations on page load
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations("https://martinsdeveloper.github.io/lavander_site/translations/lv.json");
});