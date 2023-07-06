const userAuth = sessionStorage.getItem("savedToken"); // Récupère le token d'authentification de l'utilisateur depuis la session storage

let errorDisplayed = false; // Variable pour vérifier si un message d'erreur a déjà été affiché

const formLogin = document.querySelector(".form-login"); // Sélectionne le formulaire de connexion
formLogin.addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le comportement par défaut
  const email = document.getElementById("email").value; // Récupère la valeur email
  const password = document.getElementById("password").value; // Récupère la valeur MDP
  sendLoginRequest(email, password); // Appelle la fonction pour envoyer la requête de connexion
});

// Fonction pour envoyer la requête
function sendLoginRequest(email, password) {
  const userData = {
    email: email,
    password: password,
  };
  fetch("http://localhost:5678/api/users/login", {
    // Effectue une requête POST vers l'API pour se connecter
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData), // Convertit les données de l'utilisateur en JSON et les envoie dans le corps de la requête
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Renvoie les données JSON de la réponse si ok
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseData) => {
      console.log(responseData.token); // afficher token dans la console
      sessionStorage.setItem("savedToken", responseData.token); // Stocke le token dans la session storage
      window.location.href = "index.html"; // Redirige l'utilisateur vers la page "index.html"
    })
    .catch((error) => {
      console.error(error);
      if (!errorDisplayed) {
        // Vérifie si aucun message d'erreur n'a été affiché
        errorMessage(); // Apl la fonction pour afficher un message d'erreur
        errorDisplayed = true; // Définit la variable errorDisplayed à true pour indiquer qu'un message d'erreur a été affiché
      }
    });
}

// Fonction pour afficher un message d'erreur
function errorMessage() {
  const errorDiv = document.querySelector(".div-error"); // Sélectionne la div qui contiendra le message d'erreur
  const errorElement = document.createElement("p"); // Créer <p> pour afficher le message d'erreur
  errorElement.innerText = "Erreur dans l’identifiant ou le mot de passe"; //texte du message d'erreur
  errorDiv.appendChild(errorElement); // relie à la div
}
