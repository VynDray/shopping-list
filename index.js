let detailInput = document.querySelector('.input1')
let quantityInput=document.querySelector('.input2')
let priceInput = document.querySelector('.input3')
let addButton = document.querySelector('.addBTN')
let arrayDataContainer= document.querySelector('.arrayDATA')
let uiPrice = document.querySelector('.UIprice')
const arry =[];

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
     itterate(arry)
     arrayDataContainer.innerHTML = itterate(arry)
     

    }else{
        return
    }
    resetInput()
}

function pushIntoARRY(data){
       arry.push(data)
    }
    function itterate(array){
        let accumulator = ''
        for(let i=0;i<array.length;i++){
            /* accumulator+=array[i] */
            accumulator+=`<div class='UiSlide'>
             <div>${array[i].details}</div>
             <div>${array[i].quantity}</div>
             <div>${array[i].price}</div>
             <button
             onclick='arry.splice(${i},1);arrayDataContainer.innerHTML = itterate(arry); updateFinalPrice();'
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
})