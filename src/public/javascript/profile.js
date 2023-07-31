"user strict"
import {runArrays} from "./export.js";

//Btns
const profileBtn = document.getElementById("profileBtn");
const taskBtn = document.getElementById("taskBtn");
const changepinBtn = document.getElementById("changepinBtn");
const changepassBtn = document.getElementById("changepassBtn");
const changesecretqtsBtn = document.getElementById("changesecretqtsBtn");
const accountBtn = document.getElementById("accountBtn");

//Gettings form info
const profileForm = document.querySelector(".profile_form");
const taskDiv = document.querySelector(".taskContainer_form");
const changePincode_Req = document.querySelector(".changePincode_container");
const changepassForm = document.querySelector(".changepass_form");
const scrtqtForm = document.querySelector(".changesquestions_form");
const accountDiv = document.querySelector(".accountContainer_form");

//Get links 
const params = window.location.search;
const gettingParams = new URLSearchParams(params);
const value = gettingParams.get("data");

if(value === "profile"){
    profileForm.style.display = "block";
    profileBtn.style.borderBottom = "2px solid #a93132";
    taskDiv.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none"; 
}else if(value === "taskdiv"){
    taskDiv.style.display = "block";
    taskBtn.style.borderBottom = "2px solid #a93132";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "changepinreq"){
    changePincode_Req.style.display = "block";
    changepinBtn.style.borderBottom = "2px solid #a93132";
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
}else if(value === "changepass"){
    changepassForm.style.display = "block";
    changepassBtn.style.borderBottom = "2px solid #a93132";
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "changesecretqts"){
    scrtqtForm.style.display = "block";
    changesecretqtsBtn.style.borderBottom = "2px solid #a93132";
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "accountdiv"){
    accountDiv.style.display = "block";
    accountBtn.style.borderBottom = "2px solid #a93132";
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    changePincode_Req.style.display = "none";
}else{
    profileBtn.style.borderBottom = "2px solid #a93132";
}

// Modal
const modal = document.querySelector(".modal");
const resetAcc = document.querySelector(".resetAcc");
const deleteAcc = document.querySelector(".deleteAcc");

const resetBtn = document.getElementById("resetBtn");
const deleteBtn = document.getElementById("deleteBtn");
const cancelBtn = document.querySelectorAll(".cancelBtn");
const buttons = [resetBtn,deleteBtn];

buttons.forEach(element => {
    element.addEventListener("click", (e)=>{
       if (element.textContent.trim().toLowerCase() === "reset"){
            modal.style.display = "block";
            resetAcc.style.display = "block";
            return;
       }else if(element.textContent.trim().toLowerCase() === "delete"){
            modal.style.display = "block";
            deleteAcc.style.display = "block";
            return;
       }
    })
})

cancelBtn.forEach( element => {
    element.addEventListener("click",(e)=>{
        e.preventDefault();
        modal.style.display = "none";
        resetAcc.style.display = "none";
        deleteAcc.style.display = "none";
    
    });
})

//Close esc
document.addEventListener("keydown", (e)=>{
    if(e.code === "Escape" || e.keyCode === 27){
        modal.style.display = "none";
        resetAcc.style.display = "none";
        deleteAcc.style.display = "none";
    }
});

//Change pin code

//* Pin code Profile
const changepass_PIN = document.querySelectorAll("#pinPass");
changepass_PIN[0].focus();
runArrays(changepass_PIN);

//*PIN- Change Password
const changesecretQts_PIN = document.querySelectorAll("#pinSecreteQts");
changesecretQts_PIN[0].focus();
runArrays(changesecretQts_PIN);


//Refresh page
const oneHour = 1000 * 3600;

setTimeout(()=> {
    window.location.reload();
}, oneHour)

