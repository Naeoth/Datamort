document.getElementById("search-validate").onclick = (event) => {
  // Get sex
  let sex = document.getElementsByClassName("woman")[0]

  if (sex.checked)
    sex = sex.value
  else
    sex = document.getElementsByClassName("man")[0].value

  let data = getBiggest(sex, document.getElementById("age").value, document.getElementById("city").getAttribute("selected"))
}

function find(age, sex, city) {
  let age_index = (age < 1) ? 5 : ((age < 5) ? 6 : ((age < 15) ? 7 : ((age < 25) ? 8 : ((age < 35) ? 9 : ((age < 44) ? 10 : ((age < 55) ? 11 : ((age < 65) ? 12 : ((age < 75) ? 13 : ((age < 85) ? 14 : 15)))))))))

  let map = new Map()
  for (let i = 0; i < morts_ville_file.length; i++)
    if (morts_ville_file[i].sexe == sex && morts_ville_file[i].ville == city)
      map.set(morts_ville_file[i].libelle, morts_ville_file[i][age_index])

  return map
}

function category(id) {
  let categories = [
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

  for (let i = 0; i < categories.length; i++)
    for (let j = 0; j < categories[i].length; j++)
      if (categories[i][j] == id)
        return i
}

function best(map) {
  let bestIndex = 0
  let bestValue = 0

  for (let [key, valeur] of map)
    if (valeur > bestValue) {
      bestIndex = key
      bestValue = valeur
    }

  return bestIndex
}

function getBiggest(age, sex, city) {
  let map = find(age, sex, city)
  let id = best(map)

  return category(id)
}

function getCategory(category) {
  let xmlhttp = new XMLHttpRequest()

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      let response = JSON.parse(xmlhttp.responseText)

      document.getElementById("title").innerHTML(response.title)
      document.getElementById("content").innerHTML(response.content)
    }
  }

  xmlhttp.open("GET", "data/" + category + ".json", true)
  xmlhttp.send()
}