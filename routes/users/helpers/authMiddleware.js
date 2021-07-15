const {checkIsEmail,
checkIsAlpha, 
checkIsAlphanumeric
} = require ("../../utils/authMethods");

function checkIsEmailFunc(req, res, next){
    const {errorObj} = res.locals;
    if(~checkIsEmail(req.body.email)){
        errorObj.wrongEmailFormat = "Must put a valid email for sign-up"
    }
    next();
}

function checkIsAlphaFunc(req, res, next){
    const {errorObj} = res.locals;
    const incomingData = req.body;
    for(key in incomingData){
        if (key === "firstName" || key === "lastName"){
            if(!checkIsAlpha(incomingData[key])){
                errorObj[key] = `${key} cannot have numbers in your entry`
            }
        }
    }
    next();
}

function checkIsAlphanumericFunc (req, res, next){
    const {errorObj} = res.locals;
    if (!checkIsAlphanumeric(req.body.username)){
        errorObj.usernameError = "Username cannot have special characters";
    }
    next();
}

module.exports = {
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
    checkIsEmailFunc,
}