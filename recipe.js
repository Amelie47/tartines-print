const currentUrl = window.location.href;

// Utilisez l'objet URL pour extraire les paramètres de l'URL
const url = new URL(currentUrl);

// Obtenez la valeur du paramètre 'id'
const id = url.searchParams.get("id")

// Lire les données depuis localStorage
const retrievedData = localStorage.getItem("recipes")

// Convertir la chaîne JSON en objet
const parsedData = JSON.parse(retrievedData)

const recipe = parsedData[id]

const titleContainer = document.getElementById("title")
titleContainer.innerHTML = recipe.title

const cookingDurationContainer = document.getElementById("cookingDuration")
cookingDurationContainer.innerHTML = recipe.cookingDuration + " min"

const bakingDurationContainer = document.getElementById("bakingDuration")
bakingDurationContainer.innerHTML = recipe.bakingDuration + " min"

const portionsContainer = document.getElementById("portions")
portionsContainer.innerHTML = recipe.portions + " personnes"

const ingredientContainer = document.getElementById("ingredients")
ingredientContainer.innerHTML = recipe.ingredients

const stepContainer = document.getElementById("steps")
stepContainer.innerHTML = recipe.steps

let matchImage = recipe.image.match(/v1\/.*~mv2(.jpg|.png|.webp)/)

const imageContainer = document.getElementById("image")
const emptyImageContainer = document.getElementById("image-container")

if (matchImage && matchImage.length > 1) {
    imageName = matchImage[0].replaceAll(/v1\//g, "")

    imageContainer.src = "https://static.wixstatic.com/media/" + imageName + "/v1/fill/w_1225,h_615,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Image-empty-state.jpg"
    emptyImageContainer.remove()
} else {
    imageContainer.remove()
}

window.onload = function() {
    window.print();
}
