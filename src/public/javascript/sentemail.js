
//Sent Email reset Password
//Variables background-color: #25232360;

const sectionContainer = document.querySelector(".options_container");
const sendEmail = document.getElementById("sendEmail");

//Event
sendEmail.addEventListener("click", (e)=>{
    setTimeout(()=> {
        sectionContainer.style.backgroundColor = "#25232360";
        //Create div
        const newDiv = document.createElement("div");
        //Add new attribute
        newDiv.className = "modalContent";
        sectionContainer.appendChild(newDiv);
        //Img container
        const imgContainer = document.createElement("div");
        imgContainer.className ="gifContainer";
        newDiv.appendChild(imgContainer);
        //img
        const img = document.createElement("img");
        img.src = "/img/plane.gif";
        img.alt = "sent_email";
        //Add img to imgContainer
        imgContainer.appendChild(img);
        //add h1 to container
        const h1Container = document.createElement("h1");
        h1Container.textContent = "We have sent an email to you, please check it out";
        newDiv.appendChild(h1Container);
            setTimeout(()=>{
                window.location = "http://localhost:3000/"
            },5000)
    },1500)
})