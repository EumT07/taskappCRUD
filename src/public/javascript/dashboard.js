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