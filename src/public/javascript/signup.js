"use strict"
//Show password

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
});

//Gettings params
const emailparams = window.location.search;
const emailURL = new URLSearchParams(emailparams);
const email = emailURL.get("email");
const emailForm = document.getElementById("email");

function getParams() {
    if(email){
        return emailForm.value = email
    }
}
getParams();
