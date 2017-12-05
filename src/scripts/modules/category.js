document.getElementById("search-validate").onclick = (event) => {
  // Get sex
  let sex = document.getElementsByClassName("woman")

  console.log(sex)
  if (sex[0].checked)
    sex = sex.value
  else
    sex = document.getElementsByClassName("man")[0].value


  /*console.log(sex)
  console.log(document.getElementById("age").value)
  console.log(document.getElementById("city").selected)*/

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