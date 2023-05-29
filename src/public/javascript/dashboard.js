// Menu 
const downBtn = document.getElementById("downBtn");
const upBtn = document.getElementById("upBtn");
const menu = document.querySelector(".menu_container");

downBtn.addEventListener("click", (e)=> {
    upBtn.style.display = "block";
    downBtn.style.display = "none";
    menu.style.display = "block";
});

upBtn.addEventListener("click", (e)=> {
    upBtn.style.display = "none";
    downBtn.style.display = "block";
    menu.style.display = "none";
});

//DASHBOARd SECTION

//BTN to create new task
const createBtn = document.getElementById("createBtn");
//Modal
const modalTaskCard = document.querySelector(".modal__container");

createBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    modalTaskCard.style.display = "Block";
});

//Close esc
document.addEventListener("keydown", (e)=>{
    if(e.code === "Escape" || e.keyCode === 27){
        modalTaskCard.style.display = "none"
    }
})