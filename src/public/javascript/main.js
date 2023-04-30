"use strict"

//Gettin values from DOM
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirmPassword");

//Show password
const btn_Check = document.getElementById("checkbox");
btn_Check.addEventListener("click", (e)=>{
    try {
        if(e.target.checked){
            password.type = "text";
            confirm_password.type = "text";
        }else{
            password.type = "password"
            confirm_password.type = "password"
        }
    } catch (error) {
        console.log(error);
    }
})