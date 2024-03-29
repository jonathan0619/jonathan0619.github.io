﻿const products = [
    { name: "Cereals", price: 8, category: "Vegetarian" },
    { name: "Tomatoes", price: 10, category: "Vegetarian" },
    { name: "Carrots", price: 12, category: "Vegetarian" },
    { name: "Broccoli", price: 9, category: "Vegetarian" },
    { name: "Bread", price: 11, category: "Vegetarian" },
    { name: "Beef", price: 15, category: "Gluten-Free" },
    { name: "Pork", price: 14, category: "Gluten-Free" },
    { name: "Chicken", price: 13, category: "Gluten-Free" },
    { name: "Sausage", price: 16, category: "Gluten-Free" },
    { name: "Bacon", price: 18, category: "Gluten-Free" },
];


let userPreferences = {
    vegetarian: false,
    glutenAllergy: false,
    organicPreference: false,
};


let cart = [];

function showPage(page) {
    const contentDiv = document.getElementById("content");

    const viewCartButton = document.getElementById('viewCartButton');
    if (page === 'products' || page === 'customer') {
        viewCartButton.style.display = 'block';
    } else {
        viewCartButton.style.display = 'none';
    }

    switch (page) {
        case 'customer':
            contentDiv.innerHTML = getCustomerPage();
            break;
        case 'products':
            contentDiv.innerHTML = getProductsPage();
            break;
        case 'cart':
            contentDiv.innerHTML = getCartPage();
            viewCartButton.style.display = 'none';
            break;
        default:
            contentDiv.innerHTML = "Page not found";
    }
}
function getCustomerPage() {
    return `
        <h2>Customer Page</h2>
        <ul>
            <li>
                <label>
                    Choose a Category:
                    <select id="dietaryPreferences">
                        <option value="none">None</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="glutenFree">Gluten-Free</option>
                    </select>
                </label>
            </li>
            <li>
                <label>
                    Organic Preference:
                    <select id="organicPreference">
                        <option value="false">Non-Organic</option>
                        <option value="true">Organic</option>
                    </select>
                </label>
            </li>
            <li>
                <fieldset>
                    <legend>Delivery Options:</legend>
                    <label><input type="radio" name="delivery" value="standard"> Standard</label>
                    <label><input type="radio" name="delivery" value="express"> Express</label>
                </fieldset>
            </li>
            <li>
                <label>
                    <input type="checkbox" id="subscribe" value="subscribe"> Subscribe to Newsletter
                </label>
            </li>
        </ul>

        <button onclick="updateUserPreferences()">Update Preferences</button>
    `;
}



function updateUserPreferences() {
    userPreferences.vegetarian = document.getElementById("dietaryPreferences").value === 'vegetarian';
    userPreferences.glutenAllergy = document.getElementById("dietaryPreferences").value === 'glutenFree';
    userPreferences.organicPreference = JSON.parse(document.getElementById("organicPreference").value);

    
}
const productImages = [
    'cereals.jpg',
    'tomatoes.jpg',
    'carrots.jpg',
    'broccoli.jpg',
    'bread.jpg',
    'beef.jpg',
    'pork.jpg',
    'chicken.jpg',
    'sausage.jpg',
    'bacon.jpg',
];
function getProductsPage() {
    const dietaryPreference = userPreferences.vegetarian ? 'vegetarian' : userPreferences.glutenAllergy ? 'glutenFree' : 'none';

    const filteredProducts = products.filter(product => {
        if (dietaryPreference === 'vegetarian') {
            return product.category === 'Vegetarian';
        } else if (dietaryPreference === 'glutenFree') {
            return product.category === 'Gluten-Free';
        } else {
            return true;
        }
    });


    const groupedProducts = groupProductsByCategory(filteredProducts);

    const categoryListHTML = Object.keys(groupedProducts).map(category => {
        const categoryProducts = groupedProducts[category];
        const productListHTML = categoryProducts.map((product, index) => `
            <div class="product">
                <img src="images/${productImages[category === 'Vegetarian' ? index : index + 5 ]}" alt="${product.name}" style="width: 100px; height: 100px; margin-right: 10px;">
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Category: ${product.category}</p>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity${product.name}" value="1" min="1">
                <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, "&quot;")}, ${"quantity" + product.name}.value)">Add to Cart</button>
            </div>
        `).join('');

        return `
            <div class="category">
                <h2>${category}</h2>
                <div class="product-list">
                    ${productListHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <h2>Products Page</h2>
        ${categoryListHTML}
    `;
}

function groupProductsByCategory(products) {
    const groupedProducts = {};
    products.forEach(product => {
        if (!groupedProducts[product.category]) {
            groupedProducts[product.category] = [];
        }
        groupedProducts[product.category].push(product);
    });
    return groupedProducts;
}

function addToCart(product, quantity) {
    
    const parsedQuantity = parseInt(quantity, 10);

    
    const totalPrice = product.price * parsedQuantity;

   
    cart.push({ ...product, quantity: parsedQuantity, totalPrice: totalPrice });
}

function getCartPage() {
    
    const totalInfo = cart.reduce((acc, product) => {
        acc.totalPrice += product.totalPrice;
        acc.totalQuantity += product.quantity;
        return acc;
    }, { totalPrice: 0, totalQuantity: 0 });

    
    const cartContentHTML = cart.map(product => `
        <div class="cart-item">
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Total Price: $${product.totalPrice.toFixed(2)}</p>
        </div>
    `).join('');

    
    const headerHTML = `<h2 onclick="showPage('products')">Cart Page</h2>`;

    
    const clearCartButtonHTML = `<button onclick="clearCart()">Clear Cart</button>`;

    
    const finalTotalHTML = `
        <div class="final-total">
            <h3>Final Total</h3>
            <p>Total Quantity: ${totalInfo.totalQuantity}</p>
            <p>Total Price: $${totalInfo.totalPrice.toFixed(2)}</p>
        </div>
    `;

    return `
        ${headerHTML}
        <div class="cart-content">
            ${cartContentHTML}
        </div>
        ${finalTotalHTML}
        ${clearCartButtonHTML}
    `;
}

function clearCart() {
    cart = []; 
    showPage('products');

}

// Initial load
showPage('customer');