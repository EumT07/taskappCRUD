"use strict"

// FAQ

const questions = document.querySelectorAll(".article-questions");

questions.forEach((question)=>{
    const btn = question.querySelector(".question-btn");

    btn.addEventListener("click", ()=>{

        questions.forEach(item =>{
            if(item !== question){
                item.classList.remove("show-text");
            }
        });

        question.classList.toggle("show-text");
    });
    
});