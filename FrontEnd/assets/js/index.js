const gallery = document.querySelector(".gallery");

function creaPortfolio(data) {
  document.querySelector(".gallery").innerHTML = "";
  for (i = 0; i < data.length; i++) {
    //création des éléments image et assignation du contenu dynamique via l'API
    const card = document.createElement("figure");
    card.setAttribute("id", data[i].category.name);
    card.setAttribute("data-id", data[i].id);
    card.classList.add("fig");
    const image = document.createElement("img");
    image.src = data[i].imageUrl;
    const imgTitle = document.createElement("figcaption");
    imgTitle.innerHTML = data[i].title;

    //lier les contenuss aux parents
    gallery.appendChild(card);
    card.appendChild(image);
    card.appendChild(imgTitle);
  }
}

fetch("http://localhost:5678/api/works")
  .then((reponse) => reponse.json())

  .then((data) => {
    dataAll = data;
    creaPortfolio(data);
  });

// filtres

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");
    //si filtervalue=0 alors j'apl cardportfolio ac data all et "return" pour stop

    if (filterValue == 0) {
      creaPortfolio(dataAll);
      return;
    }
    const filterData = [];

    dataAll.forEach((item) => {
      if (item.categoryId == filterValue) {
        filterData.push(item);
      }
    });
    console.log(filterData);
    creaPortfolio(filterData);
  });
});
