var selects = document.getElementsByClassName('select-container')

Array.from(selects).forEach((select) => {

  var btn = select.getElementsByClassName('select-input')
  btn[0].onclick = (event) => {
    if (select.classList == "input-container select-container")
      select.classList = "input-container select-container hide"
    else select.classList = "input-container select-container"
  }

  var options = select.getElementsByClassName('select-option')
  Array.from(options).forEach((option) => {
    option.onclick = (event) => {
      if (select.classList == "input-container select-container")
        select.classList = "input-container select-container hide"
      else select.classList = "input-container select-container"
    }
  })
})