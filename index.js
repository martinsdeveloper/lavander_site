async function fillProducts(products){
    clear_board();
    const template_h = document.querySelector("div.products-grid div.template");
    products.forEach((product) => {
        template = template_h.cloneNode(true)
        template.querySelector("h3.name").textContent = product.title;
        template.querySelector("p.price").textContent = "€" + product.price;
        template.querySelector("span.description").textContent = product.description;
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
        setupBasket();

        return translations["products"];
    } catch (error) {
        console.error("Error loading translations:", error);
    }

}

async function clear_board(){
    document.querySelectorAll("div.products-grid div:not(.template)").forEach((x)=>{
        x.remove()
    });

}
async function setupBasket(){
    Array.from(document.getElementsByClassName("add_to_cart")).forEach((bu) => {
        bu.addEventListener("click", (a) => {
            var productDiv = a.target.closest("div.product");
            if(document.querySelector('p[prod_name="'+productDiv.querySelector("h3.name").textContent+'"]')){
                p = document.querySelector('p[prod_name="'+productDiv.querySelector("h3.name").textContent+'"]');
                p.setAttribute("prod_count", parseInt(p.getAttribute("prod_count"))+1)
                p.textContent = productDiv.querySelector("h3.name").textContent + "(" + productDiv.querySelector("span.description").textContent + ")" + p.getAttribute("prod_count");
                
                document.querySelector("div.product_list").appendChild(p);
            }else{
                p = document.createElement("p");
                p.setAttribute("prod_name", productDiv.querySelector("h3.name").textContent)
                p.setAttribute("prod_count", 1)
                p.textContent = productDiv.querySelector("h3.name").textContent + "(" + productDiv.querySelector("span.description").textContent + ")" + p.getAttribute("prod_count");
                document.querySelector("div.product_list").appendChild(p);
            }
        })
    });

    Array.from(document.getElementsByClassName("remove_from_cart")).forEach((bu) => {
        bu.addEventListener("click", (a) => {
            var productDiv = a.target.closest("div.product");
            if(document.querySelector('p[prod_name="'+productDiv.querySelector("h3.name").textContent+'"]')){
                document.querySelector('p[prod_name="'+productDiv.querySelector("h3.name").textContent+'"]').remove();
            }
        })
    });
}

async function checkout(){
    document.querySelector("button.checkout").addEventListener("click", (c) => {
        var l = [];
        document.querySelectorAll("div.product_list p").forEach((row) => {
            l.push(row.textContent);
        });
        sendMail(l.join("\n"));
    });
}
function sendMail(body)
{
    var order = document.querySelector("footer span.order").textContent;
    document.location.href = "mailto:martins9436@gmail.com?subject="
        + order
        + "&body=" + encodeURIComponent(body);
}

// Load Latvian translations on page load
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations("https://martinsdeveloper.github.io/lavander_site/translations/lv.json");
    checkout()
});

window.onload = function() {
    // Hide the loading screen
    document.getElementById("loading-screen").style.display = "none";
    
};