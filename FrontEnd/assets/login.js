// Sélection des éléments du DOM
const mailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitLog = document.querySelector('input[type="submit"]');
const errorDisplay = document.getElementById("notFound");

// Définition des variables pour stocker l'e-mail et le mot de passe saisis par l'utilisateur
let stockEmail = "";
let stockPassword = "";

// Fonction pour envoyer la requête de connexion au serveur
function requestLogin() {
  return fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      // Transforme en JSON l'e-mail et le mot de passe stockés dans les variables
      email: stockEmail,
      password: stockPassword,
    }),
    credentials: "same-origin", // Inclut les cookies lors de la requête
  });
}

//-------------------------------
// Vérification de l'e-mail
//-------------------------------

// Fonction pour vérifier le format de l'e-mail
const emailChecker = (value) => {
  const errorMail = document.querySelector(".log_form span");

  // Vérifie si l'e-mail correspond à un format valide
  if (
    !value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
  ) {
    // Si l'e-mail est invalide, affiche un message d'erreur
    errorMail.classList.add("errorEmail");
    errorMail.textContent = "Email incorrect";
  } else {
    // Sinon, enlève le message d'erreur
    errorMail.classList.remove("errorEmail");
    errorMail.textContent = "";
  }
};

// Ajoute un écouteur d'événement sur le champ de saisie de l'e-mail
const emailInput = () => {
  mailInput.addEventListener("input", (e) => {
    emailChecker(e.target.value); // Appelle la fonction pour vérifier le format de l'e-mail
  });
};
//----------------------------------------------------

// Vérification de l'identifiant (e-mail) et du mot de passe lors de la tentative de connexion
const verifEmailAndPassword = () => {
  // Ajoute un écouteur d'événement sur le bouton de soumission du formulaire de connexion
  submitLog.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche le comportement par défaut (soumission du formulaire)

    // Récupère les valeurs saisies par l'utilisateur pour l'e-mail et le mot de passe
    stockEmail = mailInput.value;
    stockPassword = passwordInput.value;

    // Envoie la requête de connexion au serveur en utilisant la fonction requestLogin()
    requestLogin()
      .then((response) => response.json())
      .then((login) => {
        // Si le serveur renvoie un token valide (connexion réussie)
        if (login.token) {
          localStorage.setItem("token", login.token); // Stocke le token dans le localStorage du navigateur
          window.location.href = "./index.html"; // Redirige l'utilisateur vers la page "index.html"
        } else {
          // Si le serveur renvoie une réponse d'erreur (connexion échouée)
          errorDisplay.textContent = "Identifiant ou Mot de passe incorrect";
          errorDisplay.classList.add("notFound");
        }
      });
  });
};

// Appelle les fonctions de vérification de l'e-mail et du mot de passe
emailInput();
verifEmailAndPassword();
