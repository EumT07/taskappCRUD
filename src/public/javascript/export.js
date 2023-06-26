export const runArrays = (array) => {
    //moving to next field
for (let i = 0; i < array.length; i++) {
    array[i].addEventListener("keypress", (e)=>{
        const keyValue = parseInt(String.fromCharCode(e.keyCode));
        const regExp = /^\d*$/.test(keyValue);
        if( !regExp || keyValue === "" || keyValue === NaN || keyValue === e  ){
            return;
        }
        e.target.addEventListener("input", (e)=>{
            let regExp = /^\d*$/.test(array[i].value);
            if(!regExp) {return};
            if(array[i].value.length > 0){
                array[i].value = array[i].value.slice(0, 1);
                if( i >= array.length - 1){
                    array[array.length - 1].focus();
                    return;
                }else{
                    array[i].setAttribute("readonly","readonly");
                    array[i + 1].focus();
                }
            }
        }) 
    });
    array[i].addEventListener("keyup", (e)=>{
        //Delete keyboard = 8
        if(e.keyCode === 8) {
            if( (i - 1) < 0 ){
                array[0].focus();
                return;
            }
            array[i - 1].removeAttribute("readonly");
            array[i - 1].focus();
        }
    })
}
return;
}
