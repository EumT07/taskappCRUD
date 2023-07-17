import {maxLetter} from "./export.js";

//Creaking character numbers 
function number_of_characters() {
    //Get value from input element
    const titleText = document.getElementById("titleText");
    //Get calues from textarea element
    const descriptionText = document.getElementById("descriptionText");
    //Button
    const buttonChange = document.getElementById("buttonChange");
    
    maxLetter(titleText,descriptionText,buttonChange);
}
number_of_characters();