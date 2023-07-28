"use strict"

// Html Template
const htmlTemplate = (section) =>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    *{
        margin: 0;
        box-sizing: border-box;
    }
    body{
        overflow: hidden;
        position: relative;
        width: 100vw;
        height: 100vh;
    }
    .container{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 500px;
        height: 580px;
        box-shadow: 2px 2px 8px 1px #6b3535;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        padding: 4px;
    }
    .img_container{
        width: 80%;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: center;
    }
    .img_container a > img{
        width: 100%;
        height: 100%;
    }
    .inf_container{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        padding-left: 25px;
        padding-right: 25px;
        text-align: justify;
        height: 50%;
    }
    .inf_container h1{
        color: #d32324;
        font-weight: bold;
        align-self: center;
    }
    .inf_container p {
        color: rgb(2, 22, 26);
        font-weight: bold;
    }
    .inf_container p > span{
        color: rgb(13, 90, 233);
        font-weight: bold;
        font-size: 1.2rem;
    }
    .inf_container > a {
        text-decoration: none;
        padding: 8px 16px;
        background-color: #d32324;
        color: #fff;
        border-radius: 4px;
        align-self: center;
        margin-bottom: 15px;
    }
    
    @media screen and (max-width:560px) {
        .container{
            width: 80%;
            height: 65%;
        }
        .img_container{
            width: 80%;
            height: 50%;
        }
        .inf_container{
            height: 50%;
        }
        .inf_container > a{
            margin-bottom: 5px;
        }
    }
    @media screen and (min-width:360px) and (max-width:380px) {
        .container{
            width: 80%;
            height: 75%;
        }
        .img_container{
            width: 80%;
            height: 50%;
        }
        .inf_container{
            height: 50%;
        }
        .inf_container > a{
            margin-top: 8px;
        }
    }
    /*movil*/
    @media screen and (min-width:200px) and (max-width:360px) {
        .container{
            width: 80%;
            height: 75%;
        }
        .img_container{
            width: 80%;
            height: 50%;
        }
        .inf_container{
            height: 50%;
        }
        .inf_container > a{
            margin-top: 8px;
        }
    }
    
    </style>
    </head>
    <body>
    ${section}
    </body>
    </html>  
    `
};

//User Email
export const welcomeEmail = (username) =>{
    const section = `
    <section class="container">
      <div class="img_container">
        <img src="welcome.png" alt="welcome">
      </div>
      <div class="inf_container">
        <h1> Welcome To TaskApp </h1>
        <p>Hello, ${username} </p>
        <hr>
        <p>We hope you're enjoying <span>TaskApp</span> and its powerful features to help you to create and manage your tasks. <span>TaskApp</span> offers you a faster way to manage your tasks, controlling their level of priorities, seeking to improve your productivity<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
        <a href="http://localhost:3000/dashboard">Start</a> 
      </div>
    </section>
  `  
    return  htmlTemplate(section);
}

export const changePasswordEmail = (username) => {
    const section = `
    <section class="container">
      <div class="img_container">
        <a href="https://es.vecteezy.com/"><img src="changedPassword.jpg" alt="welcome"></a> 
      </div>
      <div class="inf_container">
        <h1>Your Password Has been Changed</h1>
        <p>Hello, ${username} </p>
        <hr>
        <p>We noticed the password for your account was recently changed. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
        <a href="mailto:taskapp@gmailco.com">Support</a> 
      </div>
    </section>
    `;
    return htmlTemplate(section);
}

export const changePinEmail = (username) => {
    const section = `
    <section class="container">
    <div class="img_container">
      <a href="https://es.vecteezy.com/"><img src="security.jpg" alt="welcome"></a> 
    </div>
    <div class="inf_container">
      <h1> Your Pin Code Has been Changed</h1>
      <p>Hello, ${username} </p>
      <hr>
      <p>We noticed the Pin-code for your account was recently changed. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
      <a href="mailto:taskapp@gmailco.com">Support</a> 
    </div>
</section>
    `;
    return htmlTemplate(section);
}
export const changeSecretqtsEmail = (username) => {
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="security.jpg" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Your Secret Questions Have been Changed</h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We noticed the secret questions for your account were recently changed. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="mailto:taskapp@gmailco.com">Support</a> 
  </div>
</section>
    `;
    return htmlTemplate(section);
}
export const resetPasswordEmail = (username) => {
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="changedPassword.jpg" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Your Password Has been reseted</h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We noticed the password for your account was recently reseted. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="mailto:taskapp@gmailco.com">Support</a> 
  </div>
</section>
    `;
    return htmlTemplate(section);
}
export const resetAccEmail = (username) => {
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="security.jpg" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Your progress Has been reseted</h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We noticed your Progress were recently reseted. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="mailto:taskapp@gmailco.com">Support</a> 
  </div>
</section>
    `;
    return htmlTemplate(section);
}
export const removetAccEmail = (username) => {
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="alert.png" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Your Account Has been Deleted..!!</h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We noticed your Account were recently Deleted. If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="mailto:taskapp@gmailco.com">Support</a> 
  </div>
</section>
    `;
    return htmlTemplate(section);
}

export const linkpinEmail = (username, url)=>{
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="alert.png" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Changed your PIN-Code </h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We have received a request to change your PIN-code, to proceed you can click on the following link, If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="http://localhost:3000/api/settings/changepincode/${url}"> Click here </a>
  </div>
</section>
    `;
    return htmlTemplate(section);
}

export const emailResetPassword = (username, url)=>{
    const section = `
    <section class="container">
  <div class="img_container">
    <a href="https://es.vecteezy.com/"><img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.columbus.gov%2FuploadedImages%2FAlert.jpg%3Fn%3D2688&f=1&nofb=1&ipt=cbd15667dad77ddbe49d3035307df81a94f3d9e1fc461ab2d757295931fa7187&ipo=images" alt="welcome"></a> 
  </div>
  <div class="inf_container">
    <h1> Forgot Passwod ?</h1>
    <p>Hello, ${username} </p>
    <hr>
    <p>We have received a request to reset your password, to proceed you can click on the following link, If this was you, can safely disregard this email, otherwise please take time to contact us.<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="http://localhost:3000/api/recovery/resetpassword/${url}"> Click here </a>
  </div>
</section>
    `;
    return htmlTemplate(section);
}
//Notifications
//*Is not ready
export const notificacionHtml = () => {
    const section = `
    
    `;
    return htmlTemplate(section);
}