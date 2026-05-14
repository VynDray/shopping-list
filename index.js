let detailInput = document.querySelector('.input1')
let quantityInput = document.querySelector('.input2')
let priceInput = document.querySelector('.input3')
let addButton = document.querySelector('.addBTN')
let arrayDataContainer = document.querySelector('.arrayDATA')
let uiPrice = document.querySelector('.UIprice')
let searchInput = document.querySelector('.search-bar-div input[type="search"]')
const arry = JSON.parse(localStorage.getItem('arry')) || [];

// ── POPUP SYSTEM ──
function showPopup(message, type = 'error') {
  // remove any existing popup
  const old = document.getElementById('custom-popup')
  if (old) old.remove()

  const icons = { error: '⚠', info: 'ℹ', success: '✓' }
  const colors = { error: '#f45a5a', info: '#5ab4f4', success: '#5af4a0' }

  const popup = document.createElement('div')
  popup.id = 'custom-popup'
  popup.innerHTML = `
    <div class="popup-inner">
      <span class="popup-icon" style="color:${colors[type]}">${icons[type]}</span>
      <p class="popup-msg">${message}</p>
      <button class="popup-close" onclick="document.getElementById('custom-popup').remove()">✕</button>
    </div>
  `
  document.body.appendChild(popup)

  // auto close after 3.5s
  setTimeout(() => { if (document.getElementById('custom-popup')) document.getElementById('custom-popup').remove() }, 3500)
}

// ── PASSWORD POPUP (secret word) ──
function showPasswordPopup() {
  const old = document.getElementById('custom-popup')
  if (old) old.remove()

  const popup = document.createElement('div')
  popup.id = 'custom-popup'
  popup.innerHTML = `
    <div class="popup-inner popup-password">
      <button class="popup-close" onclick="document.getElementById('custom-popup').remove()">✕</button>
      <span class="popup-icon" style="color:#FBC107">🔐</span>
      <p class="popup-msg">Admin access required</p>
      <input type="password" id="popup-pw-input" placeholder="Enter password..." class="popup-pw-input" />
      <button class="popup-pw-btn" id="popup-pw-btn">Unlock</button>
      <p class="popup-pw-error" id="popup-pw-error"></p>
    </div>
  `
  document.body.appendChild(popup)

  const input = document.getElementById('popup-pw-input')
  const btn = document.getElementById('popup-pw-btn')
  const err = document.getElementById('popup-pw-error')

  input.focus()

  function attempt() {
    if (input.value === 'Coolhands.co') {
      window.location.href = 'track.html'
    } else {
      err.textContent = 'Wrong password. Try again.'
      input.value = ''
      input.focus()
    }
  }

  btn.addEventListener('click', attempt)
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attempt() })
}

// ── EMPTY STATE ──
function checkEmptyState() {
  const filtered = currentSearchTerm
    ? arry.filter(item => item.details.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    : arry

  if (arry.length === 0) {
    arrayDataContainer.innerHTML = `
      <div class="empty-state">
        <div class="icon">🛒</div>
        <div>Your list is empty</div>
        <div style="opacity:0.5; font-size:0.65rem; margin-top:0.3rem">Add items using the inputs below</div>
      </div>`
  } else if (filtered.length === 0 && currentSearchTerm) {
    arrayDataContainer.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <div>No items match "<strong style="color:#FBC107">${currentSearchTerm}</strong>"</div>
      </div>`
  }
}

// ── VALIDATION ──
function checkInputs() {
  if (detailInput.value === '') {
    showPopup('Item name is empty — please enter what you want to buy.', 'error')
    return false
  }
  if (quantityInput.value === '' || Number(quantityInput.value) < 1) {
    showPopup('Quantity is missing or invalid — enter at least 1.', 'error')
    return false
  }
  if (priceInput.value === '') {
    showPopup('Unit cost is empty — enter the price per item.', 'error')
    return false
  }
  return true
}

function checkPrice() {
  let priceValue = Number(priceInput.value)
  if (!priceValue) {
    showPopup('Price must be a valid number — no letters or symbols.', 'error')
    priceInput.value = ''
    return null
  }
  return priceValue
}

// ── CORE LOGIC (unchanged) ──
function runAlgorithm() {
  if (!checkInputs()) return
  const price = checkPrice()
  if (!price) return

  const values = {
    details: detailInput.value,
    quantity: quantityInput.value,
    price: price
  }
  pushIntoARRY(values)
  arrayDataContainer.innerHTML = itterate(arry)
  checkEmptyState()
  resetInput()
}

function pushIntoARRY(data) {
  arry.push(data)
  localStorage.setItem('arry', JSON.stringify(arry))
}

function itterate(array) {
  if (array.length === 0) return ''
  let accumulator = ''
  for (let i = 0; i < array.length; i++) {
    accumulator += `<div class='UiSlide'>
      <div class="item-name">${array[i].details}</div>
      <div class="item-qty">${array[i].quantity}x</div>
      <div class="item-price">${Number(array[i].price).toLocaleString()} UGX</div>
      <button
        onclick='deleteItem(${i})'
        class='deleteBTN'
      >✕</button>
    </div>`
  }
  return accumulator
}

function deleteItem(i) {
  arry.splice(i, 1)
  localStorage.setItem('arry', JSON.stringify(arry))
  arrayDataContainer.innerHTML = itterate(arry)
  checkEmptyState()
  updateFinalPrice()
}

function resetInput() {
  detailInput.value = ''
  quantityInput.value = ''
  priceInput.value = ''
}

function updateFinalPrice() {
  let totalPrice = 0
  for (let i = 0; i < arry.length; i++) {
    totalPrice += arry[i].price
  }
  uiPrice.innerHTML = totalPrice.toLocaleString()
}

// ── SEARCH ──
let currentSearchTerm = ''

searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim()

  // secret word check (case insensitive)
  if (term.toLowerCase() === 'nkookavyn') {
    searchInput.value = ''
    currentSearchTerm = ''
    showPasswordPopup()
    return
  }

  currentSearchTerm = term

  if (term === '') {
    arrayDataContainer.innerHTML = itterate(arry)
    checkEmptyState()
    updateFinalPrice()
    return
  }

  const filtered = arry.filter(item =>
    item.details.toLowerCase().includes(term.toLowerCase())
  )

  if (filtered.length === 0) {
    checkEmptyState()
  } else {
    // render filtered but keep original indices for delete to work
    let accumulator = ''
    for (let i = 0; i < arry.length; i++) {
      if (arry[i].details.toLowerCase().includes(term.toLowerCase())) {
        accumulator += `<div class='UiSlide'>
          <div class="item-name">${arry[i].details}</div>
          <div class="item-qty">${arry[i].quantity}x</div>
          <div class="item-price">${Number(arry[i].price).toLocaleString()} UGX</div>
          <button onclick='deleteItem(${i})' class='deleteBTN'>✕</button>
        </div>`
      }
    }
    arrayDataContainer.innerHTML = accumulator
  }
})

// ── EVENT LISTENERS ──
addButton.addEventListener('click', () => {
  runAlgorithm()
  updateFinalPrice()
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement !== searchInput) {
    runAlgorithm()
    updateFinalPrice()
  }
})

// ── INIT ──
arrayDataContainer.innerHTML = itterate(arry)
checkEmptyState()
updateFinalPrice()

/* 
now thats the website, wat i want you to update is when there is nothing in the list, display a message 'Your list is empty',make the searchbar interactive that when someone searches for the detail value lets say he has 'apple' in the list, they can search and only items that contain apple(the whole div) will now display, when the search bar is empty all the list come back, now you notice that when lets say the values are empty, i designed an alert, change this to custom popups explaining why, dont change my core logic, build on top of it, now i know you will want to ADD some html say for the popup, you can do that but like i said build on top of wat is already there, dont change thins also make the serchbar that when i enter a word NkookaVyn(whather capital or small laters), a popup apears asking for a password, when i enter 'Coolhands.co', it will link to track.html, All pops must have a close button


*/