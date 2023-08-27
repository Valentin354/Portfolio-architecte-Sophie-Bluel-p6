// Récupération des éléments du DOM à l'aide de sélecteurs
const galery = document.querySelector(".gallery");
const portFolio = document.getElementById("portfolio");
const token = localStorage.getItem("token");
const modalBody = document.querySelector(".modal-body");
const titleGalery = document.getElementById("modal-title");
const returnModal = document.querySelector(".return-modal");
const modifPortfolio = document.querySelector(".modif-portfolio");
const formAddPicture = document.querySelector(".formAddPicture");

//-----------------
// Récupération des catégories depuis l'API (pour les filtres)
//-----------------
const fetchCategories = async () => {
  // Appel à l'API pour obtenir les catégories
  const categories = await fetch("http://localhost:5678/api/categories");
  // Décodage de la réponse en format JSON
  const categoriesDecoded = await categories.json();
  return categoriesDecoded;
};
//-------------------------------- */

//Création des boutons de filtre
const displayCategories = async () => {
  // Sélection de l'élément HTML où les boutons de filtre seront ajoutés
  const categoriesFilter = document.getElementById("categoriesFilter");
  // Récupération des catégories depuis l'API
  const categories = await fetchCategories();
  // Récupération des projets depuis l'API pour afficher tous les projets lorsque le bouton "Tous" est sélectionné
  const works = await fetchWork();

  // Ajout de la catégorie "Tous" au début de la liste des catégories pour montrer tous les projets
  categories.unshift({ id: -1, name: "Tous" });

  // Pour chaque catégorie, créer un bouton de filtre et l'ajouter à l'élément HTML
  categories.forEach((categorie) => {
    const addButtonFilter = document.createElement("button");
    categoriesFilter.appendChild(addButtonFilter);
    addButtonFilter.classList.add("button_form");
    addButtonFilter.textContent = categorie.name;
    addButtonFilter.setAttribute("id", categorie.id);

    // Ajout d'un écouteur d'événement pour le clic sur le bouton de filtre
    addButtonFilter.addEventListener("click", (event) => {
      // Récupérer l'ID de la catégorie associée au bouton cliqué
      const idCategorie = event.target.id;
      let objetWork = null;

      // Si la catégorie "Tous" est sélectionnée, afficher tous les projets, sinon filtrer les projets par catégorie
      if (idCategorie == -1) {
        objetWork = works;
      } else {
        // Filtrer les projets pour obtenir seulement ceux appartenant à la catégorie sélectionnée
        objetWork = works.filter(function (objet) {
          return objet.category.id == idCategorie;
        });
      }

      // Vider la galerie pour empêcher que de nouveaux projets s'ajoutent lors du filtrage
      galery.innerHTML = "";

      // Afficher les projets filtrés dans la galerie
      objetWork.forEach((work, index) => {
        const workElement = createWorkElement(work);
        galery.appendChild(workElement);
      });
    });
    categoriesFilter.appendChild(addButtonFilter);
  });
};

// -------------------------
// Récupération des projets depuis l'API (pour les images du portfolio)
// -------------------------
const fetchWork = async () => {
  // Appel à l'API pour obtenir les projets
  const work = await fetch("http://localhost:5678/api/works");
  // Décodage de la réponse en format JSON
  const workDecoded = await work.json();
  return workDecoded;
};

// -------------------------
// Affichage des projets dans la galerie
// -------------------------
const displayWorks = async () => {
  // Récupération des projets depuis l'API
  const works = await fetchWork();
  // Vider la galerie pour afficher les nouveaux projets
  galery.innerHTML = "";
  // Pour chaque projet, créer un élément de projet (figure) avec image et légende, puis l'ajouter à la galerie
  works.forEach((work, index) => {
    const workElement = createWorkElement(work);
    galery.appendChild(workElement);
  });
};

// -------------------------
// Fonction pour créer l'élément d'un projet (figure) avec image et légende
// -------------------------
const createWorkElement = (work, modal = false) => {
  // Création des éléments HTML pour l'affichage du projet
  const viewElement = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");

  // Vérification si le projet existe
  if (work === undefined) {
    return; // Si le projet est vide, ne rien faire
  }

  // Définition des attributs de l'élément figure et de l'image
  viewElement.setAttribute("id", work.id);
  image.setAttribute("src", work.imageUrl);
  image.setAttribute("alt", work.title);
  image.setAttribute("data-id", work.id);

  // Si on est sur la modal, ajouter un bouton "éditer" et une icône de suppression pour chaque projet
  if (modal) {
    figCaption.innerText = "éditer";
    const divIconDelete = document.createElement("div");
    const iconDelete = document.createElement("i");

    divIconDelete.classList.add("divDeleteFigure");
    iconDelete.classList.add("fas", "fa-trash-can", "deleteFigure");
    iconDelete.setAttribute("id", `${work.id}`);

    viewElement.appendChild(divIconDelete);
    divIconDelete.appendChild(iconDelete);
  } else {
    // Sur la page principale, afficher le titre du projet dans la légende
    figCaption.innerText = work.title;
  }

  // Ajout de l'image et de la légende à l'élément figure
  viewElement.appendChild(image);
  viewElement.appendChild(figCaption);
  return viewElement;
};

// ------------------------------
// Mise en forme de la page d'accueil si l'utilisateur est connecté
// ------------------------------
const admin = () => {
  if (token) {
    // Vérifie si un token (jeton d'authentification) est présent dans le stockage local (localStorage)
    const buttonLog = document.getElementById("buttonLog");
    const header = document.querySelector("header");
    const adminHead = document.querySelector(".admin-header");
    const modifIntro = document.querySelector(".modif-intro");

    // Masque les filtres et affiche les boutons pour l'administrateur
    document.getElementById("categoriesFilter").style.display = "none";
    buttonLog.textContent = "logout";
    adminHead.style.display = "flex";
    header.style.marginTop = "100px";
    modifIntro.style.display = "flex";
    modifPortfolio.style.display = "flex";
  }
};

// ------------------------------
// Gestion du bouton "logout" pour se déconnecter
// ------------------------------
buttonLog.addEventListener("click", () => {
  if (token) {
    // Si un token est présent dans le stockage local, le supprimer pour se déconnecter
    localStorage.removeItem("token");
  }
});

// -----------------------------------
// Fonction pour ouvrir la galerie en tant que modal
// -----------------------------------
const openGalerieModal = async () => {
  // Récupération des projets depuis l'API
  const works = await fetchWork();

  // Affiche la superposition et la modal de la galerie
  document.querySelector(".overlay").style.display = "block";
  document.querySelector(".modal").style.display = "block";
  formAddPicture.style.display = "none";
  titleGalery.textContent = "Galerie photo";
  modalBody.innerHTML = "";

  // Ajoute chaque projet à la modal de la galerie
  works.forEach((work) => {
    const workElement = createWorkElement(work, true);
    modalBody.appendChild(workElement);
  });

  returnModal.style.display = "none";

  // Ferme la modal si on clique en dehors de celle-ci
  const overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", closeGalerieModal);
  document.getElementById("add_photo").style.display = "block";
  document.getElementById("DeleteAllGalerie").style.display = "block";
};

// -----------------------------------
// Ouverture de la galerie en tant que modal lorsque le bouton "Modifier le portfolio" est cliqué
// -----------------------------------
modifPortfolio.addEventListener("click", openGalerieModal);

// -----------------------------------
// Fonction pour supprimer un projet
// -----------------------------------
const deleteProjet = () => {
  const galeryModal = document.querySelector(".modal-body");
  galeryModal.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
      e.preventDefault();
      const selectedPicture =
        e.target.parentNode.parentNode.querySelector("img");
      const pictureId = selectedPicture.getAttribute("data-id");
      selectedPicture.parentNode.parentNode.removeChild(
        selectedPicture.parentNode
      );
      await fetchDeletePhoto(pictureId);
    }
  });
};

// -----------------------------------
// Supprimer un projet en appelant l'API DELETE
// -----------------------------------
const fetchDeletePhoto = async (photoId) => {
  const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    await displayWorks(); // Actualise la galerie après suppression d'un projet
  }
  return;
};

// -----------------------------------
// Ajouter un nouveau projet en appelant l'API POST
// -----------------------------------
const addNewPicture = async (event) => {
  event.preventDefault();

  // Récupération des valeurs du formulaire (titre, catégorie et image)
  const titleInput = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  const imageInput = document.getElementById("file");
  const title = titleInput.value;
  const category = selectedcategory.id;
  const image = imageInput.files[0];

  // Vérification si tous les champs sont remplis
  if (!title || !category || !image) {
    alert("Veuillez remplir tous les champs pour ajouter un nouveau projet.");
    return;
  }

  // Création d'un objet FormData pour envoyer les données du formulaire
  const formData = new FormData();
  formData.append("image", image, image.name);
  formData.append("title", title);
  formData.append("category", category);

  await fetchAddPhoto(formData); // Appel à la fonction pour ajouter le projet en utilisant l'API POST
  closeGalerieModal();
};

// -----------------------------------
// Écouteur d'événement pour soumettre le formulaire d'ajout de projet
// -----------------------------------
const submitForm = document.querySelector(".formAddPicture");
submitForm.addEventListener("submit", addNewPicture);

// -----------------------------------
// Ajouter un nouveau projet en appelant l'API POST
// -----------------------------------
const fetchAddPhoto = async (formData) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    await displayWorks(); // Actualise la galerie après l'ajout d'un nouveau projet
  } else {
    alert("Une erreur s'est produite lors de l'ajout de la photo.");
  }
  return;
};

// -----------------------------------
// Ouvrir la modal d'ajout de projet
// -----------------------------------
const openAddphotoModal = async () => {
  const buttonValid = document.getElementById("valid");
  const inputTitlePicture = document.getElementById("titleNewPicture");
  const selectCategory = document.getElementById("categorie");
  const inputFile = document.getElementById("file");

  // Renvoyer vers la modal pour supprimer un projet lorsqu'on clique sur "Retour"
  returnToDeleteProject();
  // Mise en forme de la modal pour ajouter un projet
  modalAddPictureBuild();

  // Vérifier que les trois champs du formulaire (photo, titre et catégorie) sont remplis
  inputTitlePicture.addEventListener("input", updateValidButton);
  selectCategory.addEventListener("change", updateValidButton);
  inputFile.addEventListener("input", updateValidButton);

  // Ajouter un nouveau projet lorsque le bouton "Valider" est cliqué
  buttonValid.addEventListener("click", addNewPicture);
  updateValidButton();
};

// -----------------------------------
// Créer les options de la liste déroulante pour les catégories d'ajout de projet
// -----------------------------------
const createCategoryForAddPicture = async () => {
  const categories = await fetchCategories();
  const categoryInput = document.getElementById("categorie");

  categories.forEach((cat) => {
    const option = document.createElement("option");

    option.value = "";
    option.text = cat.name;
    option.setAttribute("id", cat.id);
    categoryInput.appendChild(option);
  });
};

// -----------------------------------
// Revenir à la galerie après avoir cliqué sur "Retour" dans la modal d'ajout de projet
// -----------------------------------
const returnToDeleteProject = () => {
  returnModal.addEventListener("click", () => {
    const buttonValid = document.getElementById("valid");
    const buttonAddPhoto = document.getElementById("add_photo");
    const image = document.getElementById("img-preview");
    const inputTitlePicture = document.getElementById("titleNewPicture");
    const categoryInput = document.getElementById("categorie");
    const picture = document.getElementById("file");
    const pictureSelected = picture.files[0];
    const icone = document.querySelector(".icone-img");

    image.style.display = "none";
    inputTitlePicture.value = "";
    categoryInput.selectedIndex = 0;
    icone.classList.add("display-flex");
    image.classList.remove("image-preview");
    buttonAddPhoto.style.display = "block";
    buttonValid.style.display = "none";
    openGalerieModal(); // Affiche à nouveau la galerie principale
  });
};

// -----------------------------------
// Mise en forme de la modal d'ajout de projet
// -----------------------------------
const modalAddPictureBuild = () => {
  const buttonAddPhoto = document.getElementById("add_photo");
  const suppAllGalery = document.getElementById("DeleteAllGalerie");
  const buttonValid = document.getElementById("valid");
  const categoryInput = document.getElementById("categorie");

  // Afficher la modal d'ajout de projet lorsqu'on clique sur "Ajouter une photo"
  buttonAddPhoto.addEventListener("click", () => {
    formAddPicture.style.display = "flex";
    returnModal.style.display = "block";
    buttonValid.style.display = "block";
    buttonAddPhoto.style.display = "none";
    suppAllGalery.classList.add("display-none");
    titleGalery.textContent = "Ajout photo";
    modalBody.innerHTML = "";
    categoryInput.innerHTML = "";

    // Ajouter une option vide pour la liste déroulante des catégories d'ajout de projet
    const option = document.createElement("option");
    option.value = "";
    option.text = "";
    categoryInput.appendChild(option);

    createCategoryForAddPicture(); // Créer les options de la liste déroulante pour les catégories
    addPictureDisplay(); // Gérer l'affichage de l'image sélectionnée pour l'ajout de projet
  });
};

// -----------------------------------
// Affichage de l'image sélectionnée pour l'ajout de projet
// -----------------------------------
const addPictureDisplay = () => {
  const inputFile = document.getElementById("file");
  const icone = document.querySelector(".icone-img");
  inputFile.addEventListener("change", (e) => {
    if (e.target.files.length == 0) {
      alert("Veuillez sélectionner une photo");
      return false;
    }
    const imgPreview = document.getElementById("img-preview");
    const file = e.target.files[0];
    const urlFile = URL.createObjectURL(file);
    const buttonAddPhoto = document.querySelector(".button-add-picture");
    const infoPicture = document.getElementById("info-add-picture");
    imgPreview.setAttribute("src", urlFile);
    imgPreview.style.display = "flex";
    infoPicture.classList.add("display-none");
    icone.classList.add("display-none");
    icone.classList.remove("display-flex");
    imgPreview.classList.add("image-preview");
    buttonAddPhoto.style.marginTop = "10px";
  });
};

// -----------------------------------
// Fermer la galerie en tant que modal
// -----------------------------------
const closeGalerieModal = () => {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "none";

  document.querySelector(".modal").style.display = "none";
};

// Gérer la fermeture de la modal lorsque l'icône de croix est cliquée
const closeModifPortfolio = document.querySelector(".fa-xmark");
closeModifPortfolio.addEventListener("click", () => {
  closeGalerieModal();
});

// -----------------------------------
// Vérifier si les champs du formulaire d'ajout de projet sont remplis
// -----------------------------------
const checkerAddWork = () => {
  const inputTitlePicture = document.getElementById("titleNewPicture");
  const categoryInput = document.getElementById("categorie");
  const selectedIndex = categoryInput.selectedIndex;
  const selectedcategory = categoryInput.options[selectedIndex];
  const picture = document.getElementById("file");

  if (picture.files.length === 0) {
    return false; // Si aucune photo n'est sélectionnée, retourner false
  }
  if (inputTitlePicture.value.trim() === "") {
    return false; // Si aucun titre n'est saisi, retourner false
  }

  if (selectedcategory.text === "") {
    return false; // Si aucune catégorie n'est sélectionnée, retourner false
  }

  // Si tous les champs sont remplis, retourner true
  return true;
};

// -----------------------------------
// Mettre à jour le bouton "Valider" pour l'ajout de projet en changeant sa couleur en vert
// -----------------------------------
const updateValidButton = () => {
  const validButton = document.getElementById("valid");
  const isValid = checkerAddWork();

  if (!isValid) {
    //validButton.style.background = "#1D6154"; // Si tous les champs sont remplis, changer la couleur du bouton en vert
    validButton.disabled = true;
    validButton.style.cursor = "not-allowed";
  } else {
    validButton.disabled = false;
    validButton.style.cursor = "pointer"; 
  }
};

// -----------------------------------
// Fonction d'initialisation (point d'entrée du code)
// -----------------------------------
(function Main() {
  displayCategories(); // Afficher les boutons de filtre
  admin(); // Vérifier si l'utilisateur est connecté en tant qu'administrateur
  displayWorks(); // Afficher les projets dans la galerie principale
  openAddphotoModal(); // Ouvrir la modal d'ajout de projet
  deleteProjet(); // Gérer la suppression d'un projet
  createWorkElement(); // Créer l'élément HTML d'un projet (figure)
})();
