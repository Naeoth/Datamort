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
