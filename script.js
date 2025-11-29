// fetch shop items
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("sobneRastlineGrid")) {
    fetch("items.json")
      .then((res) => res.json())
      .then((data) => {
        generateItems("sobneRastlineGrid", data.sobneRastline);
        generateItems("cvetlicniAranzmajiGrid", data.cvetlicniAranzmaji);
        generateItems("cvetlicniLonciGrid", data.cvetlicniLonci);

        attachAddToCartEvents(); // run once after all cards are generated
      });
  }

  if (window.location.pathname.includes("basket.html")) {
    renderCart();
  }
});

// display shop items
function generateItems(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("shop-item-card");

    card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="img-fluid">
            <h5>${item.name}</h5>
            <p>${item.desc}</p>
            <p>${item.price.toFixed(2)} €</p>

            <button 
                class="add-to-cart"
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${item.image}">
                Dodaj v košarico
            </button>
        `;

    container.appendChild(card);
  });
}

// add to cart, save to local storage
function attachAddToCartEvents() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
      };

      addToCart(item);
    });
  });
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((p) => p.id === item.id);

  if (existing) {
    existing.quantity++;
  } else {
    item.quantity = 1;
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// cart items
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const emptyMessage = document.getElementById("emptyCart");
  const container = document.getElementById("cartContainer");

  // If HTML doesn't have a cart container, stop
  if (!container) return;

  // If cart empty
  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    container.style.display = "none";
    return;
  }

  emptyMessage.style.display = "none";
  container.style.display = "block";
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add(
      "cart-item",
      "d-flex",
      "align-items-center",
      "gap-4",
      "flex-wrap",
      "py-3",
      "border-bottom"
    );

    div.innerHTML = `
            <img src="${item.image}" class="cart-img" alt="${item.name}">

            <div class="cart-info flex-grow-1">
                <h5>${item.name}</h5>
            </div>

            <div class="cart-quantity d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" data-id="${
                  item.id
                }" data-action="minus">-</button>
                <span class="fw-bold">${item.quantity}</span>
                <button class="btn btn-outline-secondary btn-sm" data-id="${
                  item.id
                }" data-action="plus">+</button>
            </div>

            <div class="cart-price text-end">
                <h6>${itemTotal.toFixed(2)} €</h6>
                
            </div>

        `;

    container.appendChild(div);
  });

  // Total
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total", "text-end", "pt-4");
  totalDiv.innerHTML = `<h5>Skupaj: <span class="text-success">€ ${total.toFixed(
    2
  )}</span></h5>
    <div class="text-end mt-4">
                <button class="submit-btn" id="placeOrder">Oddaj naročilo</button>
            </div>`;
  container.appendChild(totalDiv);

  attachCartButtons();

  const placeOrder = document.querySelector("#placeOrder");

  placeOrder.addEventListener("click", () => {
    localStorage.clear();
    const modal = document.querySelector("#modal");
    modal.classList.add("active");
    const overlay = document.querySelector("#overlay");
    overlay.classList.add("active");
    const closeBtn = document.querySelector("#close-modal");
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      overlay.classList.remove("active");
      navigation.navigate("./index.html");
    });
  });
}

// cart quantity buttons
function attachCartButtons() {
  document.querySelectorAll(".cart-quantity button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let item = cart.find((i) => i.id === id);

      if (!item) return;

      if (action === "plus") item.quantity++;
      if (action === "minus") {
        item.quantity--;
        if (item.quantity <= 0) {
          cart = cart.filter((i) => i.id !== id);
        }
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}
