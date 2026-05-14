let detailInput = document.querySelector('.input1')
let quantityInput=document.querySelector('.input2')
let priceInput = document.querySelector('.input3')
let addButton = document.querySelector('.addBTN')
let arrayDataContainer= document.querySelector('.arrayDATA')
let uiPrice = document.querySelector('.UIprice')
const arry =JSON.parse(localStorage.getItem('arry'))||[];

function checkInputs(){
    if(detailInput.value===''||quantityInput.value===''||priceInput.value===''){
        alert('one of the inputs is empty, fill all inputs')
        resetInput()
        return
    }else{
        console.log('working')
    }
}
 function checkPrice(){
    let priceVlue = Number(priceInput.value)
            if(!priceVlue){
                priceVlue=''
                priceInput.value=''
                checkInputs()
                
            }else{
                return priceVlue
            }
            
            return priceVlue
            
} 
function runAlgorithm(){
    checkInputs()
    if(checkPrice()){
        const values = {
        details:detailInput.value,
        quantity:quantityInput.value,
        price:checkPrice() 
    }
     pushIntoARRY(values)
     
     arrayDataContainer.innerHTML = itterate(arry)
     

    }else{
        return
    }
    resetInput()
}

function pushIntoARRY(data){
       arry.push(data)
       localStorage.setItem('arry',JSON.stringify(arry))
    }
    function itterate(array){
        let accumulator = ''
        for(let i=0;i<array.length;i++){
            /* accumulator+=array[i] */
            accumulator+=`<div class='UiSlide'>
             <div>${array[i].details}</div>
             <div>${array[i].quantity} items </div>
             <div> ${array[i].price} UGX</div>
             <button
             onclick='arry.splice(${i},1); localStorage.setItem("arry", JSON.stringify(arry)); arrayDataContainer.innerHTML = itterate(arry); updateFinalPrice();'
             class='deleteBTN'
             >Delete</button>
            </div>`
        }
        return accumulator
    }
    function resetInput(){
        detailInput.value=''
        quantityInput.value=''
        priceInput.value=''
    }
    function updateFinalPrice(){
        let totalPrice=0;
        for(let i =0;i<arry.length;i++){
            totalPrice+=arry[i].price
        }
        uiPrice.innerHTML=totalPrice

    } 

addButton.addEventListener('click',()=>{
    runAlgorithm()
    updateFinalPrice()
    console.log(arry)
})

arrayDataContainer.innerHTML = itterate(arry)

updateFinalPrice()

window.addEventListener('keydown',(e)=>{
    enterKey(e)

})
function enterKey(event){
    if(event.key==='Enter'){
         runAlgorithm()
        updateFinalPrice()

    }
}

/* 
now thats the website, wat i want you to update is when there is nothing in the list, display a message 'Your list is empty',make the searchbar interactive that when someone searches for the detail value lets say he has 'apple' in the list, they can search and only items that contain apple(the whole div) will now display, when the search bar is empty all the list come back, now you notice that when lets say the values are empty, i designed an alert, change this to custom popups explaining why, dont change my core logic, build on top of it, now i know you will want to ADD some html say for the popup, you can do that but like i said build on top of wat is already there, dont change thins also make the serchbar that when i enter a word NkookaVyn(whather capital or small laters), a popup apears asking for a password, when i enter 'Coolhands.co', it will link to track.html, All pops must have a close button


*/