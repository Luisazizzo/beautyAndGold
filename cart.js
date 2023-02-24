const container = document.querySelector(".container-page");
const carteDiCredito = document.querySelector(".carte-di-credito");
const payPal = document.querySelector(".paypal");
const btnCheck = document.querySelector(".btn-check");
const modalBg = document.querySelector(".modal-bg");
const modalCheck = document.querySelector(".modal-check");
const formCheck = document.querySelector(".form-check");
const alertEl = document.querySelector(".inserisci");
const modalThanks = document.querySelector(".modal-thanks");
const removeModal = document.querySelector(".spanX");
const cantainerTotale = document.querySelector(".prodotti");

let cartArray;

if (localStorage.getItem("prodottiCarrello")) {
  cartArray = JSON.parse(localStorage.getItem("prodottiCarrello"));
} else {
  cartArray = [];
}

const removeElements = (elements) => {
  const elementsRemove = document.querySelectorAll(elements);
  elementsRemove.forEach((item) => item.remove());
};

const productsCart = () => {
  removeElements(".element-cart");
  removeElements(".quantity");
  cartArray.forEach((element) => {
    const elementCart = document.createElement("div");
    elementCart.className = "element-cart";
    const imgCart = document.createElement("img");
    imgCart.setAttribute("src", element.image);
    imgCart.className = "img-cart-page";
    const description = document.createElement("p");
    description.textContent = element.description.slice(0, 50);
    description.className = "descrizione-prodotto";
    const prezzo = document.createElement("p");
    prezzo.textContent = `€${element.price}`;
    prezzo.className = "price-cart";

    const divQty = document.createElement("div");
    divQty.className = "quantity";
    const pQty = document.createElement("p");
    pQty.textContent = "Quantity:";
    const spanMeno = document.createElement("span");
    spanMeno.className = "meno";
    spanMeno.textContent = "-";
    const qty = document.createElement("p");
    qty.textContent = element.qty;
    qty.className = "qty";
    const spanPiu = document.createElement("span");
    spanPiu.className = "piu";
    spanPiu.textContent = "+";

    spanMeno.addEventListener("click", () => {
      if (element.qty === 1) {
        spanMeno.remove();
      } else {
        element.qty--;
      }
      totaleCart();
      productsCart();
    });

    spanPiu.addEventListener("click", () => {
      element.qty++;
      totaleCart();
      productsCart();
    });

    divQty.append(pQty, spanMeno, qty, spanPiu);
    elementCart.append(imgCart, description, prezzo);
    container.append(elementCart, divQty);
  });
};

productsCart();

const totaleCart = () => {
  let quantita = 0;
  let totaleParziale = 0;
  let spedizione = 5;

  cartArray.forEach((item) => {
    quantita = quantita + item.qty;
    totaleParziale = totaleParziale + item.price * item.qty;
  });
  let iva = (totaleParziale * 22) / 100;

  let totale = totaleParziale + spedizione + iva;

  const totaleProdotti = document.querySelector("#totale-prodotti");
  totaleProdotti.textContent = quantita;

  const totaleTutto = document.querySelector("#totale-tutto");
  totaleTutto.textContent = `€ ${totaleParziale.toFixed(2)}`;

  const ivaProdotti = document.querySelector("#iva");
  ivaProdotti.textContent = `€ ${iva.toFixed(2)}`;

  const totaleEl = document.querySelector("#totale");
  totaleEl.textContent = `€ ${totale.toFixed(2)}`;
};

totaleCart();

let payment;

carteDiCredito.addEventListener("click", () => {
  alertEl.style.display = "none";
  carteDiCredito.classList.toggle("color");
  payPal.classList.remove("color");
  payment = "carta";
});
payPal.addEventListener("click", () => {
  alertEl.style.display = "none";
  payPal.classList.toggle("color");
  carteDiCredito.classList.remove("color");
  payment = "paypal";
});

btnCheck.addEventListener("click", () => {
  if (payment) {
    modalBg.style.display = "flex";
    modalCheck.style.display = "flex";
  } else {
    alertEl.style.display = "block";
  }
});

removeModal.addEventListener("click", () => {
  modalCheck.style.display = "none";
  modalBg.style.display = "none";
});

formCheck.addEventListener("submit", (e) => {
  e.preventDefault();
  modalCheck.style.display = "none";
  modalThanks.classList.add("block");
  localStorage.removeItem("prodottiCarrello");
});
