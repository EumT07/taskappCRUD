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
const closeCreateTask = document.getElementById("closeCreateTask");
//Modal
const modalTaskCard = document.querySelector(".modal__container");

createBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    modalTaskCard.style.display = "Block";
});
closeCreateTask.addEventListener("click", (e)=>{
    e.preventDefault();
    modalTaskCard.style.display = "none";
});

//Close esc
document.addEventListener("keydown", (e)=>{
    if(e.code === "Escape" || e.keyCode === 27){
        modalTaskCard.style.display = "none"
    }
});

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
    });
});



//Searching or filtering
//Get Select options
const selectCategory = document.getElementById("selectCategory");
const selectLevels = document.getElementById("selectLevels");

//Get container to show
const categoriesContainer = document.querySelectorAll("#categoriesContainer");
const tasksContainer = document.querySelectorAll("#tasksContainer");
//Div filtered
const tasksFilter = document.querySelectorAll(".tasksFilter");

//Show Categories
selectCategory.addEventListener("change", (e)=>{
    let categoryNameSelected = e.target.value.toLowerCase().trim();  
    categoriesContainer.forEach(category => {
        const name_of_category = category.firstElementChild.firstElementChild.textContent.toLowerCase().trim();

        if(categoryNameSelected === "all category") {
            category.style.display = "block";
        } else if(categoryNameSelected === name_of_category){
            category.style.display = "block";
        }else{
            category.style.display = "none";
        }
        
    });
})

//Show task 
selectLevels.addEventListener("change", (e)=>{
    let levelsNameSelected = e.target.value.toLowerCase().trim(); 

    tasksFilter.forEach(tasks => {
        const priorityName = tasks.firstElementChild.lastElementChild.lastElementChild.textContent.toLowerCase().trim()
        const divCategoryContainer = tasks.parentElement;
        
        
        if(levelsNameSelected === "all levels") {
            tasks.style.display = "block";
        } else if(levelsNameSelected === priorityName){
            tasks.style.display = "block";
        }else{
            tasks.style.display = "none";
        }
    })
})

//Date Task
function getDateTask() {
    //Get Element by Id
    const dateTask = document.querySelectorAll("#date");
    for (let i = 0; i < dateTask.length; i++) {
        const dateTaskText = dateTask[i].textContent;
        //Get index
        //Value 4: render the index of the string we want to display
        //Value 25: represent the end of the string
        let date = dateTaskText.slice(4, 16)
        //Repleace the old string for the new one
        dateTask[i].textContent = date;
    }
}
getDateTask();

//Changing check icon by close
const checkIcon = document.querySelectorAll("#checkIcon");


checkIcon.forEach(element => {
    element.addEventListener("mouseover", ()=>{
        element.setAttribute("src", "/img/delete.png");
    });
    element.addEventListener("mouseleave", ()=>{
        element.setAttribute("src", "/img/check.png");
    })
})


//Refresh page
setTimeout(()=> {
    window.location.reload();
}, 1000 * 1800)
