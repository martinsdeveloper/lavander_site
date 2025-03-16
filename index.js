async function fillProducts(products){
    clear_board();
    const template_h = document.querySelector("div.products-grid div.template");
    products.forEach((product) => {
        template = template_h.cloneNode(true)
        template.querySelector("h3.name").textContent = product.title;
        template.querySelector("p.price").textContent = "€" + product.price;
        template.querySelector("span.description").textContent = product.description;
        const imgElement = template.querySelector("img");
        imgElement.setAttribute("src", product.image_url);
        imgElement.setAttribute("alt", product.alt);
        imgElement.onerror = () => {
            imgElement.setAttribute("src", "image-not-found.jpeg");
        };
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
async function update_prouct_amount(a, quantity_val="1", total){
    if(quantity_val === ""){
        quantity_val = "0";
    }
    const productDiv = a.target.closest("div.product");
    const productName = productDiv.querySelector("h3.name").textContent;
    const productPrice = parseFloat(productDiv.querySelector("p.price").textContent.replace("€", ""));
    const quantityNode = productDiv.querySelector("input.quantity");
    const quantity = parseInt(quantity_val);
    console.log(total);
    if(total==true){
        console.log(parseInt(quantity));
        quantityNode.value = parseInt(quantity);

    }else{
        quantityNode.value = parseInt(quantityNode.value)+quantity;
    }
    let cartRow = document.querySelector(`tr[prod_name="${productName}"]`);

    if (cartRow) {
        cartRow.querySelector(".cart-quantity").textContent = quantityNode.value;
        cartRow.querySelector(".cart-total").textContent = `€${(quantityNode.value * productPrice).toFixed(2)}`;
    } else {
        cartRow = document.createElement("tr");
        cartRow.setAttribute("prod_name", productName);
        cartRow.innerHTML = `
            <td>${productName}</td>
            <td class="cart-quantity">${quantity}</td>
            <td>€${productPrice.toFixed(2)}</td>
            <td class="cart-total">€${(quantity * productPrice).toFixed(2)}</td>
            <td><button class="btn secondary remove_item" data-translate="remove_from_cart"><i class="fa fa-trash"></i></button></td>
        `;
        document.querySelector("tbody.product_list").appendChild(cartRow);
        cartRow.querySelector(".remove_item").addEventListener("click", () => {

            const card_arr = [...document.querySelectorAll("div.product h3.name")].find(el => el.textContent.trim() === productName);
            card_arr.closest(".product").getElementsByClassName("quantity")[0].value = 0;
            cartRow.remove();
            updateTotalPrice();
        });
    }
    updateTotalPrice();

}

async function setupBasket() {
    Array.from(document.getElementsByClassName("add_to_cart")).forEach((bu) => {
        bu.addEventListener("click", (a) => {
            update_prouct_amount(a, '1', false);
        });
    });

    Array.from(document.getElementsByClassName("quantity")).forEach((bu) => {
        bu.addEventListener("keyup", (a) => {
            update_prouct_amount(a, a.target.value, true);
        });
    });

    document.querySelector(".clear_cart").addEventListener("click", () => {
        document.querySelector("tbody.product_list").innerHTML = "";
        updateTotalPrice();
    });
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll("tbody.product_list tr").forEach((row) => {
        const totalCell = row.querySelector(".cart-total").textContent.replace("€", "");
        total += parseFloat(totalCell);
    });
    document.querySelector("p.total_price").textContent = `Total: €${total.toFixed(2)}`;
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
    const order = document.querySelector("footer span.order").textContent;
    const total = document.querySelector("p.total_price").textContent;
    document.location.href = `mailto:martins9436@gmail.com?subject=${order}&body=${encodeURIComponent(body + "\n" + total)}`;
}

// Load Latvian translations on page load
document.addEventListener("DOMContentLoaded", () => {
    // Add Font Awesome stylesheet for icons
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);

    applyTranslations("https://martinsdeveloper.github.io/lavander_site/translations/lv.json");
    checkout();
});

window.onload = function() {
    // Hide the loading screen
    document.getElementById("loading-screen").style.display = "none";
    
};
