"use strict"
//Show password

//Gettin values from DOM
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirmPassword");

//Show password
function showPass() {
    const btn_Check = document.getElementById("checkbox");
    btn_Check.addEventListener("click", (e)=>{
            password.type = "text";
            confirm_password.type = "text";
            btn_Check.classList.remove("checkIcon")
            btn_Check.classList.add("closeEye")
        
            let closeBtn = document.querySelector(".closeEye");
            closeBtn.addEventListener("click", (e)=>{
                password.type = "password"
                confirm_password.type = "password"
                btn_Check.classList.remove("closeEye")
                btn_Check.classList.add("checkIcon")
                showPass();
            });
            
    });
}
showPass();

//Gettings params: email
const dataParams = window.location.search;
const dataURL = new URLSearchParams(dataParams);
const dataValue = dataURL.get("data");

//email from form sections
const emailForm = document.getElementById("email");
const usernameForm = document.getElementById("username");


//Google Bard
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
