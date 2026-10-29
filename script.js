/* =========================================================
   DATA
========================================================= */

const DEMO_EMAIL = "admin@gmail.com";
const DEMO_PASSWORD = "admin123";

let products =
JSON.parse(localStorage.getItem("groceryProducts")) || [

    {
        id:1,
        name:"Basmati Rice",
        category:"Grains",
        price:85,
        stock:42,
        unit:"kg",
        icon:"🍚"
    },

    {
        id:2,
        name:"Wheat Flour",
        category:"Grains",
        price:48,
        stock:35,
        unit:"kg",
        icon:"🌾"
    },

    {
        id:3,
        name:"Fresh Milk",
        category:"Dairy",
        price:32,
        stock:25,
        unit:"litre",
        icon:"🥛"
    },

    {
        id:4,
        name:"Apples",
        category:"Fruits",
        price:120,
        stock:4,
        unit:"kg",
        icon:"🍎"
    },

    {
        id:5,
        name:"Potatoes",
        category:"Vegetables",
        price:35,
        stock:30,
        unit:"kg",
        icon:"🥔"
    },

    {
        id:6,
        name:"Biscuits",
        category:"Snacks",
        price:20,
        stock:3,
        unit:"packet",
        icon:"🍪"
    },

    {
        id:7,
        name:"Cooking Oil",
        category:"Essentials",
        price:135,
        stock:18,
        unit:"litre",
        icon:"🫗"
    },

    {
        id:8,
        name:"Sugar",
        category:"Essentials",
        price:52,
        stock:28,
        unit:"kg",
        icon:"🍬"
    }

];


let cart =
JSON.parse(localStorage.getItem("groceryCart")) || [];


let orders =
JSON.parse(localStorage.getItem("groceryOrders")) || [];


let addresses =
JSON.parse(localStorage.getItem("groceryAddresses")) || [];


let selectedPayment = "Cash";


let currentCategory = "All";


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded",()=>{

    checkLogin();

    setupForms();

    setupNavigation();

    renderPOSProducts();

    renderProducts();

    renderInventory();

    renderOrders();

    renderCustomers();

    renderAddresses();

    updateCart();

    updateDashboard();

    loadTheme();

});


/* =========================================================
   LOGIN
========================================================= */

document
.getElementById("loginForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    const email =
    document.getElementById("loginEmail").value.trim();

    const password =
    document.getElementById("loginPassword").value;


    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if(!emailPattern.test(email)){

        alert("Please enter a valid email address.");

        return;

    }


    if(!password){

        alert("Please enter a password.");

        return;

    }


    // Any valid email + password combination is accepted.
    // This keeps the original demo account working too.

    localStorage.setItem("isLoggedIn","true");

    localStorage.setItem("userEmail",email);

    showApp();

});


/* =========================================================
   LOGIN STATE
========================================================= */

function checkLogin(){

    if(
        localStorage.getItem("isLoggedIn")
        === "true"
    ){

        showApp();

    }

}


function showApp(){

    document.getElementById("loginPage")
    .style.display="none";

    document.getElementById("app")
    .style.display="block";


    const email =
    localStorage.getItem("userEmail")
    || DEMO_EMAIL;


    document.getElementById("userEmail")
    .textContent=email;


    document.getElementById("settingsEmail")
    .textContent=email;

}


function logout(){

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("userEmail");

    location.reload();

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation(){

    document
    .querySelectorAll(".nav-item")
    .forEach(button=>{

        button.addEventListener("click",()=>{

            navigate(
                button.dataset.page
            );

        });

    });

}


function navigate(page){

    document
    .querySelectorAll(".page")
    .forEach(p=>{

        p.classList.remove("active");

    });


    const target =
    document.getElementById(page);


    if(target){

        target.classList.add("active");

    }


    document
    .querySelectorAll(".nav-item")
    .forEach(item=>{

        item.classList.toggle(
            "active",
            item.dataset.page === page
        );

    });


    if(page==="dashboard")
        updateDashboard();

    if(page==="pos")
        renderPOSProducts();

    if(page==="products")
        renderProducts();

    if(page==="inventory")
        renderInventory();

    if(page==="orders")
        renderOrders();

    if(page==="customers")
        renderCustomers();

    if(page==="addresses")
        renderAddresses();

}


function openPOS(){

    navigate("pos");

}


/* =========================================================
   FORMS
========================================================= */

function setupForms(){

    document
    .getElementById("productForm")
    .addEventListener("submit",function(e){

        e.preventDefault();

        addProduct();

    });


    document
    .getElementById("productSearch")
    .addEventListener("input",function(){

        renderProducts(this.value);

    });


    document
    .getElementById("globalSearch")
    .addEventListener("input",function(){

        if(this.value.trim()){

            navigate("pos");

            renderPOSProducts(
                this.value.trim()
            );

        }

    });


    document
    .getElementById("addressForm")
    .addEventListener("submit",function(e){

        e.preventDefault();

        addAddress();

    });


    document
    .getElementById("darkMode")
    .addEventListener("change",function(){

        document.body.classList.toggle(
            "dark",
            this.checked
        );

        localStorage.setItem(
            "darkMode",
            this.checked
        );

    });

}


/* =========================================================
   POS PRODUCTS
========================================================= */

function renderPOSProducts(search=""){

    const container =
    document.getElementById("posProducts");


    if(!container) return;


    container.innerHTML="";


    const filtered =
    products.filter(product=>{

        const categoryMatch =
        currentCategory==="All"
        ||
        product.category===currentCategory;


        const searchMatch =
        product.name
        .toLowerCase()
        .includes(
            search.toLowerCase()
        );


        return categoryMatch &&
        searchMatch;

    });


    filtered.forEach(product=>{

        const div =
        document.createElement("div");


        div.className="product";


        div.innerHTML=`

            <div class="product-image">
                ${product.icon || "🛒"}
            </div>

            <h4>
                ${product.name}
            </h4>

            <div class="product-category">
                ${product.category}
            </div>

            <div class="product-bottom">

                <div>

                    <div class="price">
                        ₹${product.price}
                    </div>

                    <small>
                        ${product.stock}
                        ${product.unit}
                    </small>

                </div>


                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                    ${product.stock<=0?"disabled":""}>

                    +

                </button>

            </div>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   CATEGORY
========================================================= */

function filterCategory(category,button){

    currentCategory=category;


    document
    .querySelectorAll(".category-btn")
    .forEach(btn=>{

        btn.classList.remove("active");

    });


    button.classList.add("active");


    renderPOSProducts();

}


/* =========================================================
   CART
========================================================= */

function addToCart(id){

    const product =
    products.find(p=>p.id===id);


    if(!product || product.stock<=0){

        alert("Product is out of stock.");

        return;

    }


    const item =
    cart.find(i=>i.id===id);


    if(item){

        if(item.quantity>=product.stock){

            alert("Maximum available stock reached.");

            return;

        }

        item.quantity++;

    }

    else{

        cart.push({

            id:id,

            name:product.name,

            price:product.price,

            quantity:1

        });

    }


    saveCart();

    updateCart();

}


function updateCart(){

    const container =
    document.getElementById("cartItems");


    if(!container) return;


    container.innerHTML="";


    let subtotal=0;

    let count=0;


    if(cart.length===0){

        container.innerHTML=`

            <p style="
            color:#6b7280;
            font-size:13px;
            padding:20px 0;
            text-align:center">

            Cart is empty.

            </p>

        `;

    }


    cart.forEach(item=>{

        subtotal +=
        item.price*item.quantity;


        count += item.quantity;


        const div =
        document.createElement("div");


        div.className="cart-item";


        div.innerHTML=`

            <div>

                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-price">
                    ₹${item.price}
                    × ${item.quantity}
                </div>

            </div>


            <div class="qty">

                <button
                    onclick="changeQuantity(${item.id},-1)">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${item.id},1)">
                    +
                </button>

            </div>

        `;


        container.appendChild(div);

    });


    const tax =
    Math.round(subtotal*0.05);


    const total =
    subtotal+tax;


    document.getElementById("subtotal")
    .textContent="₹"+subtotal;


    document.getElementById("tax")
    .textContent="₹"+tax;


    document.getElementById("cartTotal")
    .textContent="₹"+total;


    document.getElementById("cartCount")
    .textContent=
    count+" item"+(count!==1?"s":"");

}


function changeQuantity(id,amount){

    const item =
    cart.find(i=>i.id===id);


    const product =
    products.find(p=>p.id===id);


    if(!item || !product) return;


    item.quantity += amount;


    if(item.quantity<=0){

        cart =
        cart.filter(i=>i.id!==id);

    }


    if(item.quantity>product.stock){

        item.quantity=product.stock;

        alert("Stock limit reached.");

    }


    saveCart();

    updateCart();

}


function clearCart(){

    cart=[];

    saveCart();

    updateCart();

}


function saveCart(){

    localStorage.setItem(
        "groceryCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   PAYMENT
========================================================= */

function selectPayment(button,method){

    selectedPayment=method;


    document
    .querySelectorAll(".payment-btn")
    .forEach(btn=>{

        btn.classList.remove("active");

    });


    button.classList.add("active");

}


/* =========================================================
   CUSTOMER CODES
========================================================= */

let customerCodes =
JSON.parse(localStorage.getItem("groceryCustomerCodes")) || {};


function getCustomerCode(name){

    const key = name.trim().toLowerCase();


    if(customerCodes[key]){

        return customerCodes[key];

    }


    const code =
    "CUST-"+Math.random()
    .toString(36)
    .substring(2,6)
    .toUpperCase();


    customerCodes[key]=code;


    localStorage.setItem(
        "groceryCustomerCodes",
        JSON.stringify(customerCodes)
    );


    return code;

}


/* =========================================================
   CHECKOUT
========================================================= */

function checkout(){

    if(cart.length===0){

        alert("Please add products to the cart.");

        return;

    }


    let subtotal=0;


    cart.forEach(item=>{

        subtotal +=
        item.price*item.quantity;

    });


    const tax =
    Math.round(subtotal*0.05);


    const total =
    subtotal+tax;


    cart.forEach(item=>{

        const product =
        products.find(p=>p.id===item.id);


        if(product){

            product.stock -=
            item.quantity;

        }

    });


    const customerNameInput =
    document.getElementById("customerName");


    const customerName =
    (customerNameInput && customerNameInput.value.trim())
    || "Walk-in Customer";


    const customerCode =
    getCustomerCode(customerName);


    const order={

        id:
        "GH-"+Date.now().toString().slice(-6),

        date:
        new Date().toLocaleString(),

        customer:customerName,

        customerCode:customerCode,

        items:[...cart],

        subtotal:subtotal,

        tax:tax,

        total:total,

        payment:selectedPayment,

        status:"Completed"

    };


    orders.unshift(order);


    localStorage.setItem(
        "groceryOrders",
        JSON.stringify(orders)
    );


    saveProducts();


    cart=[];

    saveCart();


    if(customerNameInput){

        customerNameInput.value="";

    }


    updateCart();

    updateDashboard();

    renderPOSProducts();

    renderProducts();

    renderInventory();

    renderOrders();

    renderCustomers();


    alert(
        "Payment successful!\n\n"+
        "Customer: "+order.customer+
        "\nCustomer Code: "+order.customerCode+
        "\nOrder Code: "+order.id+
        "\nPayment: "+order.payment+
        "\nTotal: ₹"+order.total
    );

}


/* =========================================================
   PRODUCTS MANAGEMENT
========================================================= */

function addProduct(){

    const product={

        id:Date.now(),

        name:
        document.getElementById("productName")
        .value.trim(),

        category:
        document.getElementById("productCategory")
        .value,

        price:
        Number(
            document.getElementById("productPrice")
            .value
        ),

        stock:
        Number(
            document.getElementById("productStock")
            .value
        ),

        unit:
        document.getElementById("productUnit")
        .value,

        icon:"🛒"

    };


    products.push(product);

    saveProducts();


    document
    .getElementById("productForm")
    .reset();


    renderProducts();

    renderPOSProducts();

    renderInventory();

    updateDashboard();


    alert("Product added successfully.");

}


function saveProducts(){

    localStorage.setItem(
        "groceryProducts",
        JSON.stringify(products)
    );

}


function renderProducts(search=""){

    const container =
    document.getElementById("productTable");


    if(!container) return;


    const filtered =
    products.filter(p=>
        p.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );


    container.innerHTML=`

        <table>

            <thead>

                <tr>

                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                ${filtered.map(p=>`

                    <tr>

                        <td>
                            ${p.icon || "🛒"}
                            ${p.name}
                        </td>

                        <td>
                            ${p.category}
                        </td>

                        <td>
                            ₹${p.price}
                        </td>

                        <td>
                            ${p.stock} ${p.unit}
                        </td>

                        <td>

                            ${
                                p.stock===0
                                ?
                                `<span class="badge badge-red">
                                    Out of Stock
                                </span>`
                                :
                                p.stock<=5
                                ?
                                `<span class="badge badge-orange">
                                    Low Stock
                                </span>`
                                :
                                `<span class="badge badge-green">
                                    Available
                                </span>`
                            }

                        </td>

                        <td>

                            <button
                                class="btn btn-danger"
                                onclick="deleteProduct(${p.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


function deleteProduct(id){

    if(!confirm("Delete this product?"))
        return;


    products =
    products.filter(p=>p.id!==id);


    saveProducts();

    renderProducts();

    renderPOSProducts();

    renderInventory();

    updateDashboard();

}


/* =========================================================
   INVENTORY
========================================================= */

function renderInventory(){

    const container =
    document.getElementById("inventoryTable");


    if(!container) return;


    container.innerHTML=`

        <table>

            <thead>

                <tr>

                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Unit</th>
                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                ${products.map(p=>`

                    <tr>

                        <td>
                            ${p.icon || "🛒"}
                            ${p.name}
                        </td>

                        <td>
                            ${p.category}
                        </td>

                        <td>
                            <strong>
                                ${p.stock}
                            </strong>
                        </td>

                        <td>
                            ${p.unit}
                        </td>

                        <td>

                            ${
                                p.stock===0
                                ?
                                `<span class="badge badge-red">
                                    Out of Stock
                                </span>`
                                :
                                p.stock<=5
                                ?
                                `<span class="badge badge-orange">
                                    Reorder
                                </span>`
                                :
                                `<span class="badge badge-green">
                                    In Stock
                                </span>`
                            }

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


/* =========================================================
   ORDERS
========================================================= */

function renderOrders(){

    const container =
    document.getElementById("ordersTable");


    if(!container) return;


    if(orders.length===0){

        container.innerHTML=
        "<p>No transactions yet.</p>";

        return;

    }


    container.innerHTML=`

        <table>

            <thead>

                <tr>

                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                ${orders.map(o=>`

                    <tr>

                        <td>
                            <strong>
                                ${o.id}
                            </strong>
                        </td>

                        <td>
                            ${o.date}
                        </td>

                        <td>
                            ${o.customer}
                        </td>

                        <td>
                            ${o.payment}
                        </td>

                        <td>
                            ₹${o.total}
                        </td>

                        <td>

                            <span class="badge badge-green">
                                ${o.status}
                            </span>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


/* =========================================================
   CUSTOMERS
========================================================= */

function renderCustomers(){

    const container =
    document.getElementById("customerTable");


    if(!container) return;


    const customers={};


    orders.forEach(order=>{

        const name=order.customer;


        if(!customers[name]){

            customers[name]={
                orders:0,
                spent:0,
                code:
                order.customerCode
                || getCustomerCode(name)
            };

        }


        customers[name].orders++;

        customers[name].spent +=
        order.total;

    });


    container.innerHTML=
    Object.entries(customers)
    .map(([name,data])=>`

        <tr>

            <td>
                ${name}
            </td>

            <td>
                <span class="badge badge-green">
                    ${data.code}
                </span>
            </td>

            <td>
                Walk-in
            </td>

            <td>
                ${data.orders}
            </td>

            <td>
                ₹${data.spent}
            </td>

        </tr>

    `).join("");


    if(!container.innerHTML){

        container.innerHTML=`

            <tr>

                <td colspan="5">
                    No customer transactions yet.
                </td>

            </tr>

        `;

    }

}


/* =========================================================
   ADDRESS BOOK
========================================================= */

function addAddress(){

    const address={

        id:Date.now(),

        label:
        document.getElementById("addressLabel").value,

        contact:
        document.getElementById("addressContact").value,

        phone:
        document.getElementById("addressPhone").value,

        city:
        document.getElementById("addressCity").value,

        state:
        document.getElementById("addressState").value,

        pincode:
        document.getElementById("addressPincode").value,

        full:
        document.getElementById("fullAddress").value

    };


    addresses.push(address);


    localStorage.setItem(
        "groceryAddresses",
        JSON.stringify(addresses)
    );


    document
    .getElementById("addressForm")
    .reset();


    renderAddresses();


    alert("Address saved successfully.");

}


function renderAddresses(){

    const container =
    document.getElementById("addressList");


    if(!container) return;


    if(addresses.length===0){

        container.innerHTML=`
            <div class="panel">
                <div class="panel-body">
                    No saved addresses.
                </div>
            </div>
        `;

        return;

    }


    container.innerHTML=
    addresses.map(a=>`

        <div class="panel">

            <div class="panel-body">

                <h3>
                    ${a.label}
                </h3>

                <br>

                <p>
                    <strong>
                        ${a.contact}
                    </strong>
                </p>

                <p>
                    ${a.phone}
                </p>

                <p>
                    ${a.full}
                </p>

                <p>
                    ${a.city},
                    ${a.state}
                    -
                    ${a.pincode}
                </p>

                <br>

                <button
                    class="btn btn-danger"
                    onclick="deleteAddress(${a.id})">

                    Delete

                </button>

            </div>

        </div>

    `).join("");

}


function deleteAddress(id){

    addresses =
    addresses.filter(a=>a.id!==id);


    localStorage.setItem(
        "groceryAddresses",
        JSON.stringify(addresses)
    );


    renderAddresses();

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard(){

    const sales =
    orders.reduce(
        (sum,o)=>sum+o.total,
        0
    );


    document.getElementById("todaySales")
    .textContent="₹"+sales;


    document.getElementById("transactionCount")
    .textContent=orders.length;


    document.getElementById("productCount")
    .textContent=products.length;


    document.getElementById("lowStockCount")
    .textContent=
    products.filter(p=>p.stock<=5).length;


    renderRecentOrders();

    renderStockAlerts();

}


function renderRecentOrders(){

    const container =
    document.getElementById("recentOrders");


    if(!container) return;


    container.innerHTML=
    orders.slice(0,5).map(o=>`

        <div class="order-row">

            <span>
                <strong>
                    ${o.id}
                </strong>
            </span>

            <span>
                ${o.customer}
            </span>

            <span>
                ₹${o.total}
            </span>

            <span>

                <span class="badge badge-green">
                    ${o.status}
                </span>

            </span>

        </div>

    `).join("");


    if(!container.innerHTML){

        container.innerHTML=`

            <p style="
            color:#6b7280;
            font-size:13px">

            No transactions yet.

            </p>

        `;

    }

}


function renderStockAlerts(){

    const container =
    document.getElementById("stockAlerts");


    if(!container) return;


    const low =
    products.filter(p=>p.stock<=5);


    container.innerHTML=
    low.map(p=>`

        <div class="stock-item">

            <div class="stock-product">

                <div class="product-mini">

                    ${p.icon || "🛒"}

                </div>

                <div>

                    <strong>
                        ${p.name}
                    </strong>

                    <br>

                    <small>
                        ${p.category}
                    </small>

                </div>

            </div>


            <div class="stock-number">

                ${p.stock} left

            </div>

        </div>

    `).join("");


    if(!container.innerHTML){

        container.innerHTML=`

            <p style="
            color:#16a34a;
            font-size:13px">

            ✓ All products have healthy stock.

            </p>

        `;

    }

}


/* =========================================================
   DARK MODE
========================================================= */

function loadTheme(){

    const dark =
    localStorage.getItem("darkMode")
    ==="true";


    document.body.classList.toggle(
        "dark",
        dark
    );


    document.getElementById("darkMode")
    .checked=dark;

}
