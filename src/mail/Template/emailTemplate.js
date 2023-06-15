"use strict"

export const welcomeEmail = (username) =>{
    const html = `
    <h1> Welcome To TaskApp </h1>
    <p>Hey , ${username} </p>
    <hr>
    <p>We hope you're enjoying <strong>TaskApp</strong> and its powerful features to help you to create and manage your tasks. We'd like to offer you an opportunity to share the love with your friends, colleagues, and network,<strong>Taskapp</strong> offers you a faster way to manage your tasks, controlling their level of priorities, seeking to improve your productivity&nbsp;<br><br>Best regards,<br>The <strong>TaskApp&nbsp;</strong>Team.!!</p>
    <a href="http://localhost:3000/api/auth/signin">Login</a>  
`;
    return html;
}

export const changePasswordEmail = () => {
    const html = "User changed Password";
    return html;
}

export const changePinEmail = () => {
    const html = "User changed Pin";
    return html;
}
export const changeSecretqtsEmail = () => {
    const html = "User changed secret Question";
    return html;
}
export const resetPasswordEmail = () => {
    const html = "User reset password";
    return html;
}
export const resetAccEmail = () => {
    const html = "User reset Acc";
    return html;
}
export const removetAccEmail = () => {
    const html = "User deleted accc";
    return html;
}

export const notificacionHtml = () => {
    const html = "User Update";
    return html;
}

export const linkpinEmail = (username, url)=>{
    const html = `
    <h1>Hello, ${username}</h1>
    <p>We have received a request to change the security pin, to proceed you can click on the following link</p>
    <a href="http://localhost:3000/api/settings/changepincode/${url}"> Click here </a>
    `
    return html;
}

export const emailResetPAssword = (username,url)=>{
    const html = `
    <h1>Hello, ${username}</h1>
    <p>We have received a request to reset your password, to proceed you can click on the following link</p>
    <a href="http://localhost:3000/api/recovery/resetpassword/${url}"> Click here </a>
    `
    return html;
}