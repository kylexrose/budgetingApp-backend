const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require("../model/User");

async function signup(req, res, next){
    const {
        firstName,
        lastName,
        mobileNumber,
        email,
        username,
        password,
    } = req.body;

    const {errorObj} = res.locals;
    if(Object.keys(errorObj).length > 0){
        return res.status(500).json({message: "failure", payload: errorObj})
    }

    try{
        let salt = await bcrypt.genSalt(12);
        let hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = new User({
            firstName, 
            lastName,
            email, 
            username, 
            mobileNumber,
            password: hashedPassword,
            categories: [
                "60f9c869eb5a75dd1f58a00e",
                "60f9c7940e8ededcd266bc40",
                "60f9c7bba60eb3dd07cb3c09",
                "60f9c7d7a60eb3dd07cb3c0e",
                "60f9c7eda60eb3dd07cb3c13",
                "60f9c9002d9f57dd30903808"
            ]
        })
        await createdUser.save();
        res.json({message: "success - user created"});
    }catch(e){
        next(e);
    }
}

async function login(req, res){
    const {username, password} = req.body;

    const {errorObj} = res.locals;

    if(Object.keys(errorObj) > 0){
        return res.status(500).json({message: "failure", payload: errorObj})
    }

    try{
        let foundUser = await User.findOne({username: username});
        if(!foundUser){
            res.status(400).json({
                message:"failure",
                payload: "Please check your username and password",
            })
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password);
            if (!comparedPassword){
                res.status(400).json({
                    message: "failure",
                    payload: "Please check your username and password"
                })
            }else{
                let jwtToken = jwt.sign(
                    {
                        username: foundUser.username
                    },
                    process.env.PRIVATE_JWT_KEY,
                    {
                        expiresIn: "1d",
                    }
                );
                res.json({message: "success", payload: jwtToken});
            }
        }
    }catch(e){
        res.json({message: "error", error: e});
    }
}

async function editUser(req, res, next){
    const {username} = req.params;
    try{
        const foundUser = await User.findOneAndUpdate({username: username}, req.body, {new : true})
        res.json({message: "profile updated", payload: foundUser})
    }catch(e){
        res.json({message: "error", error: e})
    }
}

module.exports = {signup, login, editUser};