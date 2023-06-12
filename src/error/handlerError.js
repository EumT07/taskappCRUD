"user strict"
/**
 * Middleware: verifySign
 */

export const taskAppError = (res, message, code = 400) => {
    return `
        Status Code: ${code}
        Message: ${message}
     `;
}


