const fillProducts = (products) => {
    clearBoard();
    const templateH = document.querySelector("div.products-grid div.template");
    products.forEach((product) => {
        const template = templateH.cloneNode(true);
        template.querySelector("h3.name").textContent = product.title;
        template.querySelector("p.price").textContent = `€${product.price}`;
        template.querySelector("span.description").textContent = product.description;
        const imgElement = template.querySelector("img");
        imgElement.src = product.image_url;
        imgElement.alt = product.alt;
        imgElement.onerror = () => {
            imgElement.src = "image-not-found.jpeg";
        };
        template.querySelector("button.primary").setAttribute("product_id", product.id);

        template.classList.remove("template");
        template.removeAttribute("hidden");
        templateH.parentElement.appendChild(template);
    });
};

const applyTranslations = async (languageFile) => {
    try {
        const response = await fetch(languageFile);
        const translations = await response.json();

        document.querySelectorAll("[data-translate]").forEach((element) => {
            const key = element.getAttribute("data-translate");
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        fillProducts(translations.products);
        setupBasket();

        return translations.products;
    } catch (error) {
        console.error("Error loading translations:", error);
    }
};

const clearBoard = () => {
    document.querySelectorAll("div.products-grid div:not(.template)").forEach((x) => x.remove());
};

const updateProductAmount = (element, quantityVal = "1", total) => {
    const productDiv = element.closest("div.product");
    const productName = productDiv.querySelector("h3.name").textContent;
    const productPrice = parseFloat(productDiv.querySelector("p.price").textContent.replace("€", ""));
    const quantityNode = productDiv.querySelector("input.quantity");
    const quantity = parseInt(quantityVal || "0");

    quantityNode.value = total ? quantity : parseInt(quantityNode.value) + quantity;

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
            const cardArr = [...document.querySelectorAll("div.product h3.name")].find(el => el.textContent.trim() === productName);
            cardArr.closest(".product").querySelector(".quantity").value = 0;
            cartRow.remove();
            updateTotalPrice();
        });
    }
    updateTotalPrice();
};

const setupBasket = () => {
    document.querySelectorAll(".add_to_cart").forEach((button) => {
        button.addEventListener("click", (event) => {
            updateProductAmount(event.target, "1", false);
        });
    });

    document.querySelectorAll(".quantity").forEach((input) => {
        input.addEventListener("keyup", (event) => {
            updateProductAmount(event.target, event.target.value, true);
        });
    });

    document.querySelector(".clear_cart").addEventListener("click", () => {
        document.querySelectorAll("div.product input.quantity").forEach((input) => {
            updateProductAmount(input, "0", true);
        });

        updateTotalPrice();
        document.querySelectorAll(".product_list tr").forEach((row) => row.remove());
    });
};

const updateTotalPrice = () => {
    const total = [...document.querySelectorAll("tbody.product_list tr")].reduce((sum, row) => {
        const totalCell = parseFloat(row.querySelector(".cart-total").textContent.replace("€", ""));
        return sum + totalCell;
    }, 0);
    document.querySelector("p.total_price").textContent = `Total: €${total.toFixed(2)}`;
};

const checkout = () => {
    document.querySelector("button.checkout").addEventListener("click", () => {
        const items = [...document.querySelectorAll("div.product_list p")].map(row => row.textContent);
        // sendMail(items.join("\n"));
        var text = "";
        document.querySelectorAll(".featured_product_list tr").forEach((f) => {
            f.querySelectorAll("td").forEach((x, index, array) => {
                if (index !== array.length - 1) { // Skip the last td
                    text += x.innerHTML;
                }
            });
            text += "\n";
        });
        sendMail(text);
    });
};

const sendMail = (body) => {
    const order = document.querySelector("footer span.order").textContent;
    const total = document.querySelector("p.total_price").textContent;
    document.location.href = `mailto:martins9436@gmail.com?subject=${order}&body=${encodeURIComponent(`${body}\n${total}`)}`;
};

document.addEventListener("DOMContentLoaded", () => {
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);

    applyTranslations("https://martinsdeveloper.github.io/lavander_site/translations/lv.json");
    checkout();
});

window.onload = () => {
    document.getElementById("loading-screen").style.display = "none";
};
