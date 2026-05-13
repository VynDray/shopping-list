let detailInput = document.querySelector('.input1')
let quantityInput=document.querySelector('.input2')
let priceInput = document.querySelector('.input3')
let addButton = document.querySelector('.addBTN')
let arrayDataContainer= document.querySelector('.arrayDATA')
const arry =[];

function checkInputs(){
    if(detailInput.value===''||quantityInput.value===''||priceInput.value===''){
        alert('one of the inputs is empty, fill all inputs')
        return
    }else{
        console.log('working')
    }
}
 function checkPrice(){
    let priceVlue = Number(priceInput.value)
            console.log(priceVlue)
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
     console.log(arrayDataContainer)

    }else{
        return
    }
}

function pushIntoARRY(data){
       arry.push(data)
       console.log(arry)
    }
    function itterate(array){
        let accumulator = ''
        for(let i=0;i<array.length;i++){
            /* accumulator+=array[i] */
            accumulator+=`<div>
             <div>${array[i].details}</div>
             <div>${array[i].quantity}</div>
             <div>${array[i].price}</div>
             <button
             onclick='arry.splice(${i},1);arrayDataContainer.innerHTML = itterate(arry);'
             >Delete</button>
            </div>`
        }
        console.log(accumulator)

        console.log('itteration successfull')
        return accumulator
    }

addButton.addEventListener('click',()=>{
    runAlgorithm()
})