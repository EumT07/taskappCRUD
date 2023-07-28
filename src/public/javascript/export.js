"use strict"
//Menu
export const menuDisplay = (menuBtn,closeMenu,menu) =>{
    menuBtn.addEventListener("click", (e) => {
        closeMenu.style.display = "block";
        menuBtn.style.display = "none";
        menu.style.display = "block";
    });
    
    closeMenu.addEventListener("click", (e) => {
        closeMenu.style.display = "none";
        menuBtn.style.display = "block";
        menu.style.display = "none";
    });
};

//Pin code
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
};

//Max letter -> Creating and updating tasks
export const maxLetter = (title,description,button)=>{
    //Title text
    title.addEventListener("keyup", (e)=>{
        const words = e.target.value;

        if(words.length >= 16){
            titleText.style.border = "2px solid #E52020";
            button.style.zIndex = "-4000";
        }else{
            titleText.style.border = "1px solid #000";
            button.style.zIndex = "0";
        }
        
    });
    //Description Text
    description.addEventListener("keyup", (e)=>{
        const words = e.target.value;
        console.log(words.length);
        if(words.length >= 110){
            descriptionText.style.border = "2px solid #E52020";
            button.style.zIndex = "-4000";
        }else{
            descriptionText.style.border = "1px solid #000";
            button.style.zIndex = "0";
        }
        
    }); 
};

