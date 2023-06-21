"user strict"


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
    taskDiv.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none"; 
}else if(value === "taskdiv"){
    taskDiv.style.display = "block";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "changepinreq"){
    changePincode_Req.style.display = "block";
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
}else if(value === "changepass"){
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "block";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "changesecretqts"){
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "block";
    accountDiv.style.display = "none";
    changePincode_Req.style.display = "none";
}else if(value === "accountdiv"){
    taskDiv.style.display = "none";
    profileForm.style.display = "none";
    changepassForm.style.display = "none";
    scrtqtForm.style.display = "none";
    accountDiv.style.display = "block";
    changePincode_Req.style.display = "none";
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



//Refresh page
const oneHour = 1000 * 3600;
setTimeout(()=> {
    window.location.reload();
}, oneHour)