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

    // const {errorObj} = res.locals;

    // if(Object.keys(errorObj) > 0){
    //     return res.status(500).json({message: "failure", payload: errorObj})
    // }

    try{
        console.log("try")
        let salt = await bcrypt.genSalt(12);
        console.log("salt")
        let hashedPassword = await bcrypt.hash(password, salt);
        console.log("hash")
        const createdUser = new User({
            firstName, 
            lastName,
            email, 
            username, 
            mobileNumber,
            password: hashedPassword,
        })
        console.log(createdUser)
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
                payload: "Please check your email and password",
            })
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password);
            if (!comparedPassword){
                res.status(400).json({
                    message: "failure",
                    payload: "Please check your email and password"
                })
            }else{
                let jwtToken = jwt.sign(
                    {
                        email: foundUser.email
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
    console.log(username)
    try{
        const foundUser = await User.findOneAndUpdate({username: username}, req.body, {new : true})
        res.json({message: "profile updated", payload: foundUser})
    }catch(e){
        res.json({message: "error", error: e})
    }
}

module.exports = {signup, login, editUser};