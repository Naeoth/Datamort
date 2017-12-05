function initDiagramSlider() {
  var diagrams = document.getElementsByClassName('diagram-double-bars')

  Array.from(diagrams).forEach(diagram => {
    var leftBar = diagram.getElementsByClassName('diagram-left-bar')[0]
    var rightBar = diagram.getElementsByClassName('diagram-right-bar')[0]
    var label = diagram.getElementsByClassName('diagram-label')[0]
    var total = diagram.getElementsByClassName('diagram-total')[0]

    label.innerHTML = diagram.getAttribute('data-label')
    total.innerHTML = diagram.getAttribute('data-total')

    leftBar.style.width = leftBar.getAttribute('data-value') + "%"
    rightBar.style.width = rightBar.getAttribute('data-value') + "%"
  })






  var moveSlider = false
  var moveSliderMin = false
  var moveSliderMax = false

  document.onmouseup = event => {
    moveSlider = false
    moveSliderMin = false
    moveSliderMax = false
  }

  var slidersSimple = document.getElementsByClassName('slider-simple')

  Array.from(slidersSimple).forEach(slider => {
    var initMousePosition = null
    var initDataValue = null
    var initPercent = null
    var tmpPercent = null

    var leftPart = slider.getElementsByClassName('slider-left-part')[0]
    var rightPart = slider.getElementsByClassName('slider-right-part')[0]
    var btn = slider.getElementsByClassName('slider-button')[0]
    var label = btn.getElementsByClassName('slider-button-label')[0]

    initDataValue = btn.getAttribute('data-value')
    initPercent = (initDataValue - slider.getAttribute('data-start')) / (slider.getAttribute('data-end') - slider.getAttribute('data-start')) * 100
    tmpPercent = initPercent
    leftPart.style.right = (100 - initPercent) + "%"
    rightPart.style.left = initPercent + "%"
    btn.style.left = initPercent + "%"
    label.innerHTML = initDataValue


    btn.onmousedown = event => {
      moveSlider = true
      initMousePosition = event.screenX - slider.offsetLeft
      initPercent = tmpPercent
    }

    document.addEventListener('mousemove', event => {
      if (moveSlider) {
        var newPos = (initPercent * (event.screenX - slider.offsetLeft)) / initMousePosition
        if (newPos > 100) newPos = 100
        else if (newPos <= 0 || initMousePosition == 0) newPos = 0
        var newLabel = parseInt((newPos * (slider.getAttribute('data-end') - slider.getAttribute('data-start')) / 100) + parseInt(slider.getAttribute('data-start')))

        tmpPercent = newPos

        btn.setAttribute('data-value', newLabel)
        leftPart.style.right = (100 - newPos) + "%"
        rightPart.style.left = newPos + "%"
        btn.style.left = newPos + "%"
        label.innerHTML = newLabel
      }
    })
  })




  var slidersDouble = document.getElementsByClassName('slider-double')

  Array.from(slidersDouble).forEach(slider => {
    var initMousePosition = null
    var initDataValueMin = null
    var initPercentMin = null
    var initDataValueMax = null
    var initPercentMax = null
    var tmpPercentMin = null
    var tmpPercentMax = null

    var leftPart = slider.getElementsByClassName('slider-left-part')[0]
    var middlePart = slider.getElementsByClassName('slider-middle-part')[0]
    var rightPart = slider.getElementsByClassName('slider-right-part')[0]
    var btnMin = slider.getElementsByClassName('slider-button min')[0]
    var btnMax = slider.getElementsByClassName('slider-button max')[0]
    var labelMin = btnMin.getElementsByClassName('slider-button-label')[0]
    var labelMax = btnMax.getElementsByClassName('slider-button-label')[0]

    initDataValueMin = btnMin.getAttribute('data-value')
    initDataValueMax = btnMax.getAttribute('data-value')
    initPercentMin = (initDataValueMin - slider.getAttribute('data-start')) / (slider.getAttribute('data-end') - slider.getAttribute('data-start')) * 100
    initPercentMax = (initDataValueMax - slider.getAttribute('data-start')) / (slider.getAttribute('data-end') - slider.getAttribute('data-start')) * 100
    tmpPercentMin = initPercentMin
    tmpPercentMax = initPercentMax
    leftPart.style.right = (100 - initPercentMin) + "%"
    rightPart.style.left = initPercentMax + "%"
    middlePart.style.left = initPercentMin + "%"
    middlePart.style.right = initPercentMin + "%"
    btnMin.style.left = initPercentMin + "%"
    btnMax.style.left = initPercentMax + "%"
    labelMin.innerHTML = initDataValueMin
    labelMax.innerHTML = initDataValueMax

    btnMin.onmousedown = event => {
      moveSliderMin = true
      initMousePosition = event.screenX - slider.offsetLeft
      initPercentMin = tmpPercentMin
    }
    btnMax.onmousedown = event => {
      moveSliderMax = true
      initMousePosition = event.screenX - slider.offsetLeft
      initPercentMax = tmpPercentMax
    }

    document.addEventListener('mousemove', event => {
      if (moveSliderMin) {
        console.log("coucou")
        var newPos = (initPercentMin * (event.screenX - slider.offsetLeft)) / initMousePosition
        if (newPos > 100) newPos = 100
        else if (newPos <= 0 || initMousePosition == 0) newPos = 0
        var newLabel = parseInt((newPos * (slider.getAttribute('data-end') - slider.getAttribute('data-start')) / 100) + parseInt(slider.getAttribute('data-start')))

        tmpPercentMin = newPos

        if (newLabel < btnMax.getAttribute('data-value')) {
          btnMin.setAttribute('data-value', newLabel)
          leftPart.style.right = (100 - newPos) + "%"
          middlePart.style.left = newPos + "%"
          btnMin.style.left = newPos + "%"
          labelMin.innerHTML = newLabel
        }
      }
      if (moveSliderMax) {
        var newPos = (initPercentMax * (event.screenX - slider.offsetLeft)) / initMousePosition
        if (newPos > 100) newPos = 100
        else if (newPos <= 0 || initMousePosition == 0) newPos = 0
        var newLabel = parseInt((newPos * (slider.getAttribute('data-end') - slider.getAttribute('data-start')) / 100) + parseInt(slider.getAttribute('data-start')))

        tmpPercentMax = newPos

        if (newLabel > btnMin.getAttribute('data-value')) {
          btnMax.setAttribute('data-value', newLabel)
          rightPart.style.left = newPos + "%"
          middlePart.style.right = (100 - newPos) + "%"
          btnMax.style.left = newPos + "%"
          labelMax.innerHTML = newLabel
        }
      }
    })
  })
}

initDiagramSlider()