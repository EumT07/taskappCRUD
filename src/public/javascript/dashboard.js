"use strict"
import {maxLetter, menuDisplay } from "./export.js";
// import { profileContainer } from "./profile.js";

//todo: All variables

//* Searching or filtering
//Get Select options
const selectCategory = document.getElementById("selectCategory");
const selectLevels = document.getElementById("selectLevels");

//*Dashboard creating new task: New category

//* Category Container variables
// Creating a new task
const categoryContainer = document.getElementById("categoryContainer");
const selectElement = document.getElementById("select");
const addNewCategoryBtn = document.getElementById("addnewCategoryBtn");

//Get container to show
const categoriesContainer = document.querySelectorAll("#categoriesContainer");
//Task container
const tasksContainer = document.querySelectorAll("#tasksContainer");
//Div filtered
const tasksFilter = document.querySelectorAll(".tasksFilter");

//Menu
let nav = document.getElementById("navigator");
let menu = document.querySelector(".menu");
let menuList = document.querySelectorAll(".menu_li");
let menuBtn = document.getElementById("menuBtn");
let closeMenu = document.getElementById("closeMenu");
let inputCheck = document.getElementById("chk");
let ball = document.querySelector(".ball");
let iconUser = document.querySelectorAll(".img_UserIcon");

//Settings
let profileContainer = document.querySelector(".data__container");
//Btns
const profileBtn = document.getElementById("profileBtn");
const taskBtn = document.getElementById("taskBtn");
const changepinBtn = document.getElementById("changepinBtn");
const changepassBtn = document.getElementById("changepassBtn");
const changesecretqtsBtn = document.getElementById("changesecretqtsBtn");
const accountBtn = document.getElementById("accountBtn");
//Profile form
const profileForm = document.getElementById("profile");
const profileLinks = document.querySelector(".links");
//Tasks
const taskstitle = document.querySelector(".taskvalue_name");
//Values
const highValue = document.getElementById("highValue");
const middleValue = document.getElementById("middleValue");
const lowValue = document.getElementById("lowValue");
//Pincode - change pass / change security questions title
const pincodeTitle = document.querySelector(".changePincode_req");
const passchangeTitle = document.querySelector("#changepass");
const secretechangeTitle = document.querySelector("#changescretqts");
//about
const aboutPage = document.querySelector(".about");

// Loading Page
window.addEventListener("load", loadingPage());

//Menu
function menuAction(menuBtn,closeMenu){
    // Menu 
    const menu = document.querySelector(".menu_container");
    
    menuDisplay(menuBtn,closeMenu,menu);
}
menuAction(menuBtn,closeMenu);

//Dark mode
const btnDark = document.getElementById("chk");

//Funcion dark mode
btnDark.addEventListener("click", () =>{
    let value = document.body.classList.toggle('dark');
    //localstorage Variable
    let localStorage_valueDarkMode = JSON.stringify(value);
    //*Local Storage
    localStorage.setItem("darkMode",localStorage_valueDarkMode);
    
    if(inputCheck.checked == true){
        ball.style.transform = "translate(24px)";
    }else{
        ball.style.transform = "translate(0px)";
    }

    //*Darkmode Function
    localStorage_darkMode(value);
});
function localStorage_darkMode(value) {
    
    if(value === true){
        document.body.classList.add('dark');
        document.body.style.background = "#313131"
        //Darnode ball
        inputCheck.checked= true;
        ball.style.transform = "translate(24px)";
        categoriesContainer.forEach(target => {
            //Category Tittle
            target.firstElementChild.firstElementChild.style.color = "#fff";
        });
        tasksContainer.forEach(target => {
            //Task Container
            target.style.background = "#525252";
            //Task Container box-shadow
            target.style.boxShadow = "none";
            //Task Title
            target.firstElementChild.firstElementChild.style.color = "#fff";
            //Task Description
            target.firstElementChild.nextElementSibling.style.color = "#fff";
            //Task Date_container > Icon
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.style.color = "#fff";
            //Task Date_container > date
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.style.color = "#fff";
            // Task dateline
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.style.color = "#fff";
            //Task colorleves
            target.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.style.color = "#fff";
        });
        //*Menu
        nav.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.style.color = "#fff";
        menuBtn.style.color = "#fff"
        closeMenu.style.color = "#fff"
        menu.style.background = "#525252";
        menu.style.boxShadow = "none";
        iconUser.forEach(icon => {
            icon.style.color = "#fff";
        });
        menuList.forEach(li=>{
            li.firstElementChild.style.color = "#fff";
            li.firstElementChild.nextElementSibling.style.color = "#fff";
        });
        //*Settings
        if(profileContainer){
            profileContainer.style.background = "#525252";
            profileContainer.firstElementChild.style.color = "#fff";
            profileBtn.style.color = "#fff";
            taskBtn.style.color = "#fff";
            changepinBtn.style.color = "#fff";
            changepassBtn.style.color = "#fff";
            changesecretqtsBtn.style.color = "#fff";
            accountBtn.style.color = "#fff";
            profileForm.style.color = "#FFD93D";
            profileLinks.style.color = "#FFD93D";
            //tasks
            taskstitle.firstElementChild.style.color = "#FFD93D";
            highValue.style.color = "#fff"; 
            middleValue.style.color = "#fff"; 
            lowValue.style.color = "#fff";  
            //pass - pin - secret
            pincodeTitle.firstElementChild.style.color = "#FFD93D";
            passchangeTitle.firstElementChild.style.color = "#FFD93D";
            secretechangeTitle.firstElementChild.style.color = "#FFD93D";
            
        }
        //*About page
        if(aboutPage){
            aboutPage.style.color ="#fff";
        }
    }else{
        document.body.classList.remove('dark');
        document.body.style.background = "#fff"
        //darkmode ball
        inputCheck.checked = false;
        ball.style.transform = "translate(0px)";
        categoriesContainer.forEach(target => {
            //Category Tittle
            target.firstElementChild.firstElementChild.style.color = "#000";
        });
        tasksContainer.forEach(target => {
            //Task Container
            target.style.background = "#ffffffc9";
            //Task Container box-shadow
            target.style.boxShadow = "1px 2px 10px rgb(190, 184, 184)";
            //Task Title
            target.firstElementChild.firstElementChild.style.color = "#000";
            //Task Description
            target.firstElementChild.nextElementSibling.style.color = "#000";
            //Task Date_container > Icon
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.style.color = "#ada1a1";
            //Task Date_container > date
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.style.color = "#000";
            // Task dateline
            target.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.style.color = "#000";
            //Task colorleves
            target.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.style.color = "#fff";
        });
        //*Menu
        menu.style.background = "#ffffffc9";
        menu.style.boxShadow = "1px 2px 10px rgb(190, 184, 184)";
        menuBtn.style.color = "#000"
        closeMenu.style.color = "#000"
        nav.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.style.color = "#000";
        iconUser.forEach(icon => {
            icon.style.color = "#000";
        });
        menuList.forEach(li=>{
            li.firstElementChild.style.color = "#000";
            li.firstElementChild.nextElementSibling.style.color = "#000";
        });
        //*Settings
        if(profileContainer){
            profileContainer.style.background = "rgba(237, 240, 240, 0.76)";
            profileContainer.firstElementChild.style.color = "#000";
            profileBtn.style.color = "#000";
            taskBtn.style.color = "#000";
            changepinBtn.style.color = "#000";
            changepassBtn.style.color = "#000";
            changesecretqtsBtn.style.color = "#000";
            accountBtn.style.color = "#000";
            profileForm.style.color = "#000";
            profileLinks.style.color = "#d81515";
            //tasks
            taskstitle.firstElementChild.style.color = "#000";
            highValue.style.color = "#000"; 
            middleValue.style.color = "#000"; 
            lowValue.style.color = "#000";  
            //pass - pin - secret
            pincodeTitle.firstElementChild.style.color = "#d81515";
            passchangeTitle.firstElementChild.style.color = "#d81515";
            secretechangeTitle.firstElementChild.style.color = "#d81515";
            
        }
        //About
        if(aboutPage){
           aboutPage.style.color = "#000";
        }
    }
}

//DASHBOARd SECTION

//Creaking numbers of caracter
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
    //Adding new categoy Btn ACtions
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
    //Close esc
    document.addEventListener("keydown", (e)=>{
        if(e.code === "Escape" || e.keyCode === 27){
            modalTaskCard.style.display = "none"
        }
    });

}
creatingTask();

//* Show categories 

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

//Change Css tasks' card
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
                showDescriptions();
                });
                
                });
            });
    });
    
};

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

//Loading Page 
function loadingPage() {
    const darkMode = JSON.parse(localStorage.getItem("darkMode"));
    if(darkMode){
        return localStorage_darkMode(darkMode);
    }
    return;
}

//Refresh page
setTimeout(()=> {
    window.location.reload();
}, 1000 * 1800)
