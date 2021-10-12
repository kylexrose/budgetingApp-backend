const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../model/User");

async function signup(req, res, next){
    const {
        firstName,
        lastName,
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
            password: hashedPassword,
            categories: [
                "6165baa85a2a121004d5146f",
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

async function getUserData(req, res, next){
    const {decodedJwt} = res.locals;
    try{
        const foundUser = await User.findOne({username: decodedJwt.username});
        res.json({payload: foundUser});
    }catch(e){
        error(e);
    }
}

async function getUserDataByEmail(req, res, next){
    const {email} = req.body;
    try{
        const foundUser = await User.findOne({email: email});
        res.json({firstName: foundUser.firstName, lastName: foundUser.lastName})
    }catch(e){
        res.json({error: e})
    }
}

async function editUser(req, res, next){
    const {decodedJwt} = res.locals;
    try{
        const foundUser = await User.findOne({username: decodedJwt.username})
        let comparedPassword = await bcrypt.compare(req.body.password, foundUser.password);
        if(!comparedPassword){
            res.status(400).json({
                message: "failure",
                payload: "Incorrect Password"
            })
        }else{
            const updatedUser = await User.findOneAndUpdate({username: decodedJwt.username}, {email:req.body.email}, {new:true});
            res.json({message: "success", payload: updatedUser})
        }
    }catch(e){
        res.json({message: "error", error: e})
    }
}

module.exports = {signup, login, editUser, getUserData, getUserDataByEmail};