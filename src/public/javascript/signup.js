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

//Gettings params: email
const dataParams = window.location.search;
const dataURL = new URLSearchParams(dataParams);
const dataValue = dataURL.get("data");

//email from form sections
const emailForm = document.getElementById("email");
const usernameForm = document.getElementById("username");


function compareValues(param) {
    //Finding out if a email or username
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isAnEmail = regex.test(param);

    if(isAnEmail){
        //Adding new value to email
        return emailForm.value = param;
    }
    //Adding new value to username
    return usernameForm.value = param;

}
compareValues(dataValue);
