"use strict"
import {maxLetter, menuDisplay } from "./export.js";

//Menu
function menuAction() {
    // Menu 
    const downBtn = document.getElementById("downBtn");
    const upBtn = document.getElementById("upBtn");
    const menu = document.querySelector(".menu_container");
    
    menuDisplay(downBtn,upBtn,menu);
}
menuAction();

//Dark mode
const btnDark = document.getElementById("chk");

//Funcion dark mode
btnDark.addEventListener("click", () =>{
    document.body.classList.toggle('dark');
});


//DASHBOARd SECTION
//Creaking character numbers 
function number_of_characters() {
    //Get value from input element
    const titleText = document.getElementById("titleText");
    //Get calues from textarea element
    const descriptionText = document.getElementById("descriptionText");
    //Button
    const buttonChange = document.getElementById("buttonChange");
    
    maxLetter(titleText,descriptionText,buttonChange);
}
number_of_characters();

function creatingTask() {
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
}
creatingTask();

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

        if(levelsNameSelected === "all levels") {
            tasks.style.display = "block";
        } else if(levelsNameSelected === priorityName){
            tasks.style.display = "block";    
        }else{
            tasks.style.display = "none";
        }
    })
})

//Change Css card task
categoriesContainer.forEach( container => {
    if(container.childElementCount >= 5 ){
       for (let i = 0; i < container.childElementCount; i++) {
        if(container.children[i].classList.contains("tasksFilter")){
            container.children[i].firstElementChild.style.height = "80px";
            container.children[i].firstElementChild.style.padding = "10px";
            container.children[i].firstElementChild.firstElementChild.nextElementSibling.style.display = "none";
            let completeTask = container.children[i].firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling;
            if(completeTask){
                container.children[i].firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.style.height = "80px";
            }
            let btnsContainer = container.children[i].firstElementChild.firstElementChild.lastElementChild;
            //Changing width
            btnsContainer.style.width = "90px";
            //Getting first btn reference
            let firstBtn = container.children[i].firstElementChild.firstElementChild.lastElementChild.firstElementChild;

            //Creating a new btn 
            let viewBtn = document.createElement("a");
            let viewIcon = document.createElement("i");
            viewIcon.className = "view fa"
            //Adding i tag to a tag
            viewBtn.appendChild(viewIcon);

            //inser new btn to btns container
            btnsContainer.insertBefore(viewBtn, firstBtn);
            
        }
       }
       return;
    }
    
    return;
})

function showDescriptions() {
    //All taks title
    const tasksTitle = document.querySelectorAll(".titleContainer");
    
    //Tasks loop
    tasksTitle.forEach(tasks => {
        const viewBtn = tasks.querySelectorAll(".view");    
        let task_to_compare = tasks.firstElementChild.textContent;
            
        viewBtn.forEach(btn => {
            //Getting all btns
            btn.addEventListener("click",(e)=>{
            
           
            tasksTitle.forEach(item => {
                
                //Comparing if the tittle of the taks is the same what we are clicking 
                if(item.firstElementChild.textContent !== task_to_compare){
                    let element_i = item.lastElementChild.firstElementChild.firstElementChild;

                    if(element_i.classList.contains("closeView")){
                        let taskCard = element_i.parentElement.parentElement.parentElement.parentElement;
                        let tasksCard_description = element_i.parentElement.parentElement.parentElement.nextElementSibling

                        element_i.classList.remove("closeView");
                        element_i.classList.add("view");
                        taskCard.style.height = "80px";
                        tasksCard_description.style.display = "none";
                        return;
                    }
                    return;
                }

                //Chaning structure of each taks
                btn.classList.remove("view");
                btn.classList.add("closeView");
                btn.parentElement.parentElement.parentElement.parentElement.style.height = "150px";
                btn.parentElement.parentElement.parentElement.nextElementSibling.style.display = "block";
                
            });
            
            const closeViewBtn = document.querySelector(".closeView");

            closeViewBtn.addEventListener("click", (e)=>{
                e.target.classList.remove("closeView");
                e.target.classList.add("view");
                e.target.parentElement.parentElement.parentElement.parentElement.style.height = "80px";
                e.target.parentElement.parentElement.parentElement.nextElementSibling.style.display = "none";
            });
        
            });
        });
    });
};
//*Show description first Option

// function showDescriptions() {
//     //Btns view 
//     const viewBtn = document.querySelectorAll(".view");

//     viewBtn.forEach(btn => {
//         btn.addEventListener("click",(e)=>{
//             e.target.classList.remove("view");
//             e.target.classList.add("closeView");
//             e.target.parentElement.parentElement.parentElement.parentElement.style.height = "150px";
//             e.target.parentElement.parentElement.parentElement.nextElementSibling.style.display = "block";

//             const closeViewBtn = document.querySelector(".closeView");

//             closeViewBtn.addEventListener("click", (e)=>{
//             e.target.classList.remove("closeView");
//             e.target.classList.add("view");
//             e.target.parentElement.parentElement.parentElement.parentElement.style.height = "80px";
//             e.target.parentElement.parentElement.parentElement.nextElementSibling.style.display = "none";
//             showDescriptions()
//                 });
//         });
//     });  
// };

showDescriptions();


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
//date Done or lost
function lostDateLine() {
    //icon
    //Value
    const dateline = document.querySelectorAll("#dateline");

    dateline.forEach(elm => {
        if(elm.value === "lost"){
            elm.previousElementSibling.classList.remove("dateline");
            elm.previousElementSibling.classList.add("dateline-lost");
            return;
        }
    });
}
lostDateLine();
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
