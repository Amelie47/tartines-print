recipes = []

class RecipeUpload {
    constructor() {
        this.recipes = []
    }

    parseCsvData(data) {

        let parsedata = [];
    
        // Tags list
        data = data.replace(/(?<=\[)(.*?)(?=\])/g, function(match) {
            return match.replaceAll("\"", "")
        })
    
        // Nombres
        data = data.replace(/,[0-9]+,/g, function(match) {
            return ",\"" + match.replaceAll(",", "") + "\","
        })
        data = data.replace(/,[0-9]+,/g, function(match) {
            return ",\"" + match.replaceAll(",", "") + "\","
        })
    
        // Dates
        data = data.replace(/[0-9]{4}-.[^,]*Z,/g, function(match) {
            return "\"" + match.replaceAll(",", "") + "\","
        })
    
        // ID avec new line
        data = data.replace(/\n"[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+",\n/g, function(match) {
            return match.replaceAll(/\n/g, "")
        })

        // Autocompléter les colonnes vides
        data = data.replace(/,{2,}/g, function(match) {
            return ",\"null\","
        })
    
        let newLinebrk = data.split(/\n[^\s{2}<]/);
        for(let i = 0; i < newLinebrk.length; i++) {
            parsedata.push(newLinebrk[i].split("\",\""))
        }
    
        this.convertToJson(parsedata)
    }
    
    loadFile(file) {
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
            let csvdata = e.target.result
            this.parseCsvData(csvdata) // calling function for parse csv data 
        })
            
        reader.readAsText(file)
    }
    
    convertToJson(recipes) {
        const headers = recipes[0]
        recipes.shift()

        const list = headers.toString()
        const matches = list.match(/Recettes/)
        if (matches) {
    
        let jsonTab = []
    
        recipes.forEach(element => {

            var recipe = {
                "title": element[headers.findIndex((el) => el === "\"Title")],
                "image": element[headers.findIndex((el) => el === "Image principale")],
                "presentation": element[headers.findIndex((el) => el === "Présentation")],
                "cookingDuration": element[headers.findIndex((el) => el === "Durée de préparation")],
                "bakingDuration": element[headers.findIndex((el) => el === "Durée de cuisson")],
                "portions": element[headers.findIndex((el) => el === "Portions")],
                "ingredients": element[headers.findIndex((el) => el === "Ingrédients")],
                "steps": element[headers.findIndex((el) => el === "Etapes")],
            }
    
            jsonTab.push(recipe)
        })
    
        this.recipes = jsonTab
    
        localStorage.setItem("recipes", JSON.stringify(jsonTab))

        this.addTable()
            
        } else {
            const errorContainer = document.getElementById("error")
            errorContainer.innerHTML = "Le fichier ne correspond pas"
        }
    }

    addTable() {
        const container = document.getElementById("table-container")
        container.style.display = "block"

        const table = document.getElementsByTagName("tbody")[0]
    
        for (let index = 0; index < this.recipes.length; index++) {
            const element = this.recipes[index];
    
            const line = document.createElement("tr")
    
            const nameCell = document.createElement("td")
            nameCell.innerHTML = element.title
            line.appendChild(nameCell)
    
            const imageCell = document.createElement("td")
            let matchImage = element.image.match(/v1\/.*~mv2(.jpg|.png|.webp)/)
            if (matchImage && matchImage.length > 1) {
                const image = document.createElement("img")
                const imageName = matchImage[0].replaceAll(/v1\//g, "")
                image.src = "https://static.wixstatic.com/media/" + imageName + "/v1/fill/w_1225,h_615,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Image-empty-state.jpg"
    
                imageCell.appendChild(image)
                line.appendChild(imageCell)
            } else {
                const imageCell = document.createElement("td")
    
                let matchImage = element.image.match(/.svg/)
                if (matchImage) {
                    imageCell.innerHTML = "svg non pris en compte"
                } else {
                    imageCell.innerHTML = "-"
                }
                
                line.appendChild(imageCell)
            }
    
            const cookingCell = document.createElement("td")
            cookingCell.innerHTML = element.cookingDuration + " min"
            line.appendChild(cookingCell)
    
            const bakingCell = document.createElement("td")
            bakingCell.innerHTML = element.bakingDuration + " min"
            line.appendChild(bakingCell)
    
            const portionsCell = document.createElement("td")
            portionsCell.innerHTML = element.portions + " personnes"
            line.appendChild(portionsCell)
    
            const printCell = document.createElement("td")
            const link = document.createElement("a")
            link.innerHTML = "Imprimer"
            link.href = "/recipe.html?id=" + index
            link.target = "_blank"
            printCell.appendChild(link)
            line.appendChild(printCell)
    
            table.appendChild(line)
        }
    }
}

const recipeUpload = new RecipeUpload()

const submitForm = (e) => {
    const file = e.target.elements.file.files[0]
    recipeUpload.loadFile(file)

    e.preventDefault()
}
