function find(csv, age, sex, city, year) {
  var age_index = (age < 1) ? "<1" : ((age < 5) ? "1-4" : ((age < 15) ? "5-14" : ((age < 25) ? "15-24" : ((age < 35) ? "25-34" : ((age < 44) ? "35-44" : ((age < 55) ? "45-54" : ((age < 65) ? "55-64" : ((age < 75) ? "65-74" : ((age < 85) ? "75-84" : ((age < 85) ? "85-94" : "95"))))))))))
  var map = new Map()
  for (var i = 0; i < csv.length; i++) {
    if (csv[i].Sexe == sex && csv[i].Ville == city && csv[i].Annee == year) {
      map.set(csv[i].Libelle, csv[i][age_index])
    }
  }
  return map
}

function loadFile(file, action, ...parameters) {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      action(csvJSON(xhttp.responseText), ...parameters)
    }
  }
  xhttp.open("GET", file, true)
  xhttp.send()
}

function category(id) {
  var categories = [
    [0, 1, 3, 4],
    [2],
    [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26],
    [27, 28, 29],
    [30, 31],
    [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
    [44, 45, 46, 47, 48],
    [49, 50, 51, 52, 53],
    [57],
    [58, 59, 60, 63, 64],
    [56, 61, 62]
  ]
  for (var i = 0; i < categories.length; i++) {
    for (var j = 0; j < categories[i].length; j++)
      if (categories[i][j] == id)
        return i
  }
}

function best(map) {
  var bestIndex = 0
  var bestValue = 0
  for (var [key, valeur] of map) {
    if (valeur != "*") {
      if (valeur > bestValue) {
        bestIndex = key
        bestValue = valeur
      }
    }
  }
  return bestIndex
}

function getBiggestCallback(csv, age, sex, city, year) {
  var map = find(csv, age, sex, city, year)
  var id = best(map)

  getCategory(category(id))
}

function getBiggest(age, sex, city) {
  loadFile("data/morts-ville.csv", getBiggestCallback, age, sex, city, 2014 - 1979)
}

//var csv is the CSV file with headers
function csvJSON(csv) {
  var lines = csv.split("\n")
  var result = []
  var headers = lines[0].split(";")

  for (var i = 1; i < lines.length; i++) {
    var obj = {}
    var currentline = lines[i].split(";")

    for (var j = 0; j < headers.length; j++)
      obj[headers[j]] = currentline[j]

    result.push(obj)
  }

  return result //JSON
}

function getCategory(category) {
  let xmlhttp = new XMLHttpRequest()

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      let response = JSON.parse(xmlhttp.responseText)

      document.getElementById("title").innerHTML = response.title
      document.getElementById("content").innerHTML = response.content

      let categoryNames = ["Tuberculose", "Infection à méningocoques", "SIDA et maladies à VIH", "Hépatites virales", "Autres maladies infectieuses et parasitaires", "Tumeur maligne de la lèvre de la cavité buccale et du pharynx", "Tumeur maligne du oesophage", "Tumeur maligne de lestomac", "Tumeur maligne du côlon", "Tumeur maligne du rectum et de l’anus", "Tumeur maligne du foie et des voies biliaires intrahépatiques", "Tumeur maligne du pancréas", "Tumeur maligne du larynx de la trachée des bronches et du poumon", "Mélanome malin de la peau", "Tumeur maligne du sein", "Tumeur maligne du col de l’utérus", "Tumeur maligne d’autres parties de l’utérus", "Tumeur maligne de l’ovaire", "Tumeur maligne de la prostate", "Tumeur maligne du rein", "Tumeur maligne de la vessie", "Tumeur maligne des tissus lymphatiques et hématopoïétiques", "Autres tumeurs malignes", "Autres tumeurs", "Maladies du sang et des organes hématopoïétiques", "Diabète sucré", "Autres maladies endocriniennes nutritionelles et métaboliques", "Abus d’alcool (y compris psychose alcoolique)", "Pharmacodépendance toxicomanie", "Autres troubles mentaux et du comportement", "Méningites (autres que 03)", "Autres maladies du système nerveux et des organes du sens", "Cardiopathies ischémiques", "Autres cardiopathies", "Maladies cérébrovasculaires", "Autres maladie de l’appareil circulatoire", "Grippe", "Pneumonie", "Asthme", "Autres maladies chroniques des voies respiratoires inférieures", "Autres maladies de l’appareil respiratoire", "Ulcère gastro-duodénal", "Maladie chronique du foie", "Autres maladies de l’appareil digestif", "Infections de la peau et du tissu cellulaire sous-cutané", "Arthrite rhumatoïde et ostéoarthrite", "Autres maladies du système ostéo-articulaire des muscles et du tissu conjonctif", "Maladies du rein et de luretère", "Autres maladies de lappareil génito-urinaire", "Complic. de grossesse accouch. et puerpéralité", "Certaines affections dont l’origine se situe dans la période périnatale", "Malformations congénitales du système nerveux", "Malformations congénitales de l’appareil circulatoire", "Autres malformations congén. et anom. chromosomiques", "Syndrome de mort subite du nourrisson", "Causes inconnues ou non précisées", "Autres symptômes et états morbides mal définis", "Accidents de transport", "Chutes accidentelles", "Intoxications accidentelles", "Autres accidents", "Suicides", "Homicides", "Événements dont lintention nest pas déterminée", "Autres causes externes de blessure et d'empoisonnement"]

      let elements = ""
      for (let i = 0; i < response.categories.length && i < 5; i++) {
        elements +=
          `<div class="diagram-double-bars" data-label="` + categoryNames[response.categories[i].id] + `" data-total="` + response.categories[i].total + `">` +
          `<p class="diagram-label"></p>` +
          `<p class="diagram-total"></p>` +
          `<div class="diagram-left-bar" data-value="` + Math.round(response.categories[i].hommes * 100) + `"></div>` +
          `<div class="diagram-right-bar" data-value="` + Math.round(response.categories[i].femmes * 100) + `"></div>` +
          `</div>`
      }

      document.getElementById("diagram").innerHTML = elements
      initDiagramSlider()
    }
  }

  xmlhttp.open("GET", "data/" + category + ".json", true)
  xmlhttp.send()
}

document.getElementById("search-validate").onclick = (event) => {
  // Get sex
  let sex = document.getElementById("woman")

  if (sex.checked)
    sex = sex.value
  else
    sex = document.getElementById("man").value

  let data = getBiggest(sex, document.getElementById("age").value, document.getElementById("city").getAttribute("selected"))
}