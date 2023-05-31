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

//Dashboard creating new task: New category
//Container
const categoryContainer = document.getElementById("categoryContainer");
const selectElement = document.getElementById("select");
const addNewCategoryBtn = document.getElementById("addnewCategoryBtn");

//Btn ACtions
addNewCategoryBtn.addEventListener("click", (e)=>{
    selectElement.style.display = "none";
    addNewCategoryBtn.style.display = "none";
    //Creating a new Element
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("name", "category");
    newInput.setAttribute("placeholder","Insert new Category");
    //Creat Close btn
    const closeInputCategory = document.createElement("i");
    closeInputCategory.className = "closeInputCategory";
    closeInputCategory.className += " fa";
    //Add new children into category div
    categoryContainer.append(newInput,closeInputCategory);

    closeInputCategory.addEventListener("click", (e)=>{
        //Append
        selectElement.style.display = "block";
        addNewCategoryBtn.style.display = "block";
        //Close
        newInput.style.display = "none";
        closeInputCategory.style.display = "none";
    })
})

//BTN to Updating new task
