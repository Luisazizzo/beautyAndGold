import { GET } from "./api.js";
import { globalState } from "./script.js";

const slider = document.querySelector(".slide-hero");
const titleCAtegory = document.querySelector(".title-category");
const bgCard = document.querySelector(".bg-card");
const divCardModal = document.querySelector(".div-card");
const tendinaCart = document.querySelector(".tendina-cart");
const carrelloEl = document.querySelector(".carrello");
const divDescription = document.querySelector(".div-description");
const divInTendina = document.querySelector(".div-tendina-cart");
const loading = document.querySelector(".loading");
const viewBtn = document.querySelector(".view-cart");
const viewBtnDue = document.querySelector(".view-cart2");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const siderBar = document.querySelector(".sidebar");
const preferiti = document.querySelector(".cuore");
const tendinaPreferiti = document.querySelector(".tendina-preferiti");
const slidePink = document.querySelector(".slide-pink");
const slideGreen = document.querySelector(".slide-green");
const slideViolet = document.querySelector(".slide-violet");
const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");
const pallino = document.querySelector(".pallino-text");
const quantitaCart = document.querySelector(".quantita-cart");

preferiti.addEventListener("click", () => {
  tendinaPreferiti.classList.toggle("block");
  if (tendinaCart.classList.contains("flex")) {
    tendinaCart.classList.remove("flex");
  }
});

hamburgerMenu.addEventListener("click", () => {
  siderBar.classList.toggle("show");
  siderBar.classList.toggle("margin");
});

let cartArray;

let preferitiArray;

const btnShow = () => {
  if (cartArray.length > 0) {
    viewBtn.classList.add("show");
    viewBtnDue.classList.add("show");
  } else {
    viewBtn.classList.remove("show");
    viewBtnDue.classList.remove("show");
  }
};

carrelloEl.addEventListener("click", () => {
  btnShow();
  tendinaCart.classList.toggle("flex");
  if (tendinaPreferiti.classList.contains("block")) {
    tendinaPreferiti.classList.remove("block");
  }
});

const removeElements = (elements) => {
  const elementsRemove = document.querySelectorAll(elements);
  elementsRemove.forEach((item) => item.remove());
};

const cartGenerator = () => {
  localStorage.setItem("prodottiCarrello", JSON.stringify(cartArray));
  btnShow();
  removeElements(".cart-row");
  cartArray.forEach((item, index) => {
    const divCart = document.createElement("div");
    divCart.className = "cart-row";
    const imgEl = document.createElement("img");
    imgEl.setAttribute("src", item.image);
    imgEl.className = "img-cart-el";
    const titleEl = document.createElement("p");
    titleEl.textContent = `${item.title.slice(0, 11)}...`;
    const deleteX = document.createElement("p");
    deleteX.textContent = "x";
    deleteX.className = "delete-el-cart";

    divCart.append(imgEl, titleEl, deleteX);
    divInTendina.appendChild(divCart);

    deleteX.addEventListener("click", () => {
      cartArray.splice(index, 1);
      cartGenerator();
      quantita();
    });
  });
};

if (localStorage.getItem("prodottiCarrello")) {
  cartArray = JSON.parse(localStorage.getItem("prodottiCarrello"));
  cartGenerator();
} else {
  cartArray = [];
}

const preferitiGenerator = () => {
  localStorage.setItem("preferiti", JSON.stringify(preferitiArray));
  removeElements(".preferiti-row");
  removeElements(".add-cart");
  preferitiArray.forEach((item, index) => {
    const divCart = document.createElement("div");
    divCart.className = "preferiti-row";
    const imgEl = document.createElement("img");
    imgEl.setAttribute("src", item.image);
    imgEl.className = "img-preferiti-el";
    const titleEl = document.createElement("p");
    titleEl.textContent = `${item.title.slice(0, 11)}...`;
    const deleteX = document.createElement("p");
    deleteX.textContent = "x";
    deleteX.className = "delete-el-cart";
    const btnAdd = document.createElement("button");
    btnAdd.textContent = "Add cart";
    btnAdd.className = "add-cart";

    divCart.append(imgEl, titleEl, deleteX);
    tendinaPreferiti.append(divCart, btnAdd);

    btnAdd.addEventListener("click", () => {
      const newObject = {
        ...item,
        qty: 1,
      };

      const filtered = cartArray.filter((item) => {
        if (item.id === newObject.id) {
          item.qty++;
          return item;
        }
      });

      if (filtered.length === 0) {
        cartArray.push(newObject);
      }
      preferitiArray.splice(index, 1);
      cartGenerator();
      quantita();
      preferitiGenerator();
    });

    deleteX.addEventListener("click", () => {
      preferitiArray.splice(index, 1);
      console.log(preferitiArray);
      preferitiGenerator();
    });
  });
};

if (localStorage.getItem("preferiti")) {
  preferitiArray = JSON.parse(localStorage.getItem("preferiti"));
  preferitiGenerator();
} else {
  preferitiArray = [];
}

const cardGenerator = (data) => {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  const imgElCard = document.createElement("img");
  imgElCard.setAttribute("src", data.image);
  imgElCard.className = "img-card";
  const priceElCard = document.createElement("p");
  priceElCard.textContent = `€ ${data.price}`;
  const descriptionElCArd = document.createElement("p");
  descriptionElCArd.textContent = `${data.description.slice(0, 21)}...`;
  descriptionElCArd.className = "descrizione";

  cardEl.addEventListener("click", () => {
    openCard(data);
    bgCard.style.display = "flex";
    divCardModal.style.display = "flex";
  });

  bgCard.addEventListener("click", () => {
    divCardModal.style.display = "none";
    bgCard.style.display = "none";
  });

  cardEl.append(imgElCard, priceElCard, descriptionElCArd);

  return cardEl;
};

const categoryLi = (data, container) => {
  const liCategoryEl = document.createElement("li");
  liCategoryEl.className = "li-category";
  liCategoryEl.textContent = data;

  liCategoryEl.addEventListener("click", () => {
    slider.style.display = "none";
    titleCAtegory.textContent = "";
    loading.style.display = "block";
    removeElements(".card");

    if (globalState[data]) {
      loading.style.display = "none";
      titleCAtegory.textContent = data;
      globalState[data].forEach((item) =>
        container.appendChild(cardGenerator(item))
      );
    } else {
      GET(`/category/${data}`).then((products) => {
        loading.style.display = "none";
        titleCAtegory.textContent = data;
        globalState[data] = products;
        products.forEach((item) => container.appendChild(cardGenerator(item)));
      });
    }
  });

  return liCategoryEl;
};

const openCard = (data) => {
  const imgCardModal = document.querySelector("#img-cart");
  imgCardModal.setAttribute("src", data.image);
  const descriptionCardModal = document.querySelector(
    ".descrizione-card-modal"
  );
  descriptionCardModal.textContent = data.description.slice(0, 201);
  const rateCardModal = document.querySelector(".rate");
  rateCardModal.textContent = data.rating.rate;
  const priceCardModal = document.querySelector(".price");
  priceCardModal.textContent = `€${data.price}`;

  removeElements(".btn-cart");
  removeElements(".preferiti");

  const addPreferiti = document.createElement("p");
  addPreferiti.className = "preferiti";
  addPreferiti.textContent = "Add to favorities";

  const btnCart = document.createElement("button");
  btnCart.className = "btn-cart";
  btnCart.textContent = "Add to cart";

  addPreferiti.addEventListener("click", () => {
    const object = {
      ...data,
      qty: 1,
    };

    const filteredD = preferitiArray.filter((item) => item.id === object.id);

    if (filteredD.length === 0) {
      preferitiArray.push(object);
    }
    preferitiGenerator();
  });

  btnCart.addEventListener("click", () => {
    const newObject = {
      ...data,
      qty: 1,
    };

    const filtered = cartArray.filter((item) => {
      if (item.id === newObject.id) {
        item.qty++;
        return item;
      }
    });

    if (filtered.length === 0) {
      cartArray.push(newObject);
    }
    quantita();
    cartGenerator();
  });

  divDescription.append(addPreferiti, btnCart);
};

const quantita = () => {
  let quantita = 0;

  cartArray.forEach((item) => {
    quantita = quantita + item.qty;
  });
  pallino.textContent = quantita;
  quantitaCart.textContent = `Prodotti: ${quantita}`;
};

quantita();

btn1.addEventListener("click", () => {
  slidePink.classList.add("show");
  slideGreen.classList.remove("show");
  slideViolet.classList.remove("show");

  btn1.classList.add("active");
  btn2.classList.remove("active");
  btn3.classList.remove("active");
});

btn2.addEventListener("click", () => {
  slidePink.classList.remove("show");
  slideGreen.classList.add("show");
  slideViolet.classList.remove("show");

  btn1.classList.remove("active");
  btn2.classList.add("active");
  btn3.classList.remove("active");
});

btn3.addEventListener("click", () => {
  slidePink.classList.remove("show");
  slideGreen.classList.remove("show");
  slideViolet.classList.add("show");

  btn1.classList.remove("active");
  btn2.classList.remove("active");
  btn3.classList.add("active");
});

export { removeElements, cardGenerator, categoryLi };
