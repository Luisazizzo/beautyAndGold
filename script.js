import { GET } from "./api.js";
import { removeElements, cardGenerator, categoryLi } from "./utils.js";

const contaierEl = document.querySelector(".container-card");
const ulSidebar = document.querySelector(".sidebar");
const allProducts = document.querySelector(".all");
const titleCAtegory = document.querySelector(".title-category");
const titlePage = document.querySelector(".title");
const slider = document.querySelector(".slide-hero");
const searchEl = document.querySelector(".search");

const globalState = {
  all: [],
};

GET().then((data) => {
  globalState.all = data;
  removeElements(".loader");
  data.forEach((item) => contaierEl.appendChild(cardGenerator(item)));
});

GET("/categories").then((data) => {
  data.forEach((item) => ulSidebar.appendChild(categoryLi(item, contaierEl)));
});

titlePage.addEventListener("click", () => {
  removeElements(".card");
  if (globalState.all) {
    slider.style.display = "block";
    titleCAtegory.textContent = "";
    globalState.all.forEach((item) =>
      contaierEl.appendChild(cardGenerator(item))
    );
  } else {
    GET().then((data) => {
      slider.style.display = "block";
      titleCAtegory.textContent = "";
      data.forEach((item) => contaierEl.appendChild(cardGenerator(item)));
    });
  }
});

allProducts.addEventListener("click", () => {
  removeElements(".card");

  if (globalState.all) {
    titleCAtegory.textContent = "all";
    slider.style.display = "none";
    globalState.all.forEach((item) =>
      contaierEl.appendChild(cardGenerator(item))
    );
  } else {
    GET().then((data) => {
      titleCAtegory.textContent = "all";
      slider.style.display = "none";
      data.forEach((item) => contaierEl.appendChild(cardGenerator(item)));
    });
  }
});

searchEl.addEventListener("input", (e) => {
  e.preventDefault();
  removeElements(".card");
  const filterSearch = globalState.all.filter((products) =>
    products.title.includes(e.target.value.toLowerCase())
  );
  filterSearch.forEach((element) => {
    contaierEl.appendChild(cardGenerator(element));
  });
});

export { globalState };
