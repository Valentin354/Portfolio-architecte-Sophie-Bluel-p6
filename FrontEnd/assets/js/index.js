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

    //lier les contenus aux parents
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

// filtres ---------------------------------------------------------

// Sélection des boutons de filtre
const filterButtons = document.querySelectorAll(".filter-button");
// Sélection des éléments de la galerie
const galleryItems = document.querySelectorAll(".gallery");

// Ajout d'un écouteur événement à chaque bouton de filtre
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    // Si la valeur est 0, afficher toutes les images
    if (filterValue == 0) {
      creaPortfolio(dataAll);
      return;
    }

    // Filtrage des données en fonction de la valeur du filtre
    const filterData = [];
    dataAll.forEach((item) => {
      if (item.categoryId == filterValue) {
        filterData.push(item);
      }
    });

    // Affichage de la galerie filtrée
    creaPortfolio(filterData);
  });
});
