const User = require('../../users/model/User');
const TempId = require('../Model/TempId');
const bcrypt = require('bcryptjs')

async function changePassword(req, res, next){
    try{
        const {_id, password} = req.body;
        let salt = await bcrypt.genSalt(12);
        let hashedPassword = await bcrypt.hash(password, salt);
        userRef = await TempId.findById(_id);
        updateUser = await User.findByIdAndUpdate(userRef.userId, {password: hashedPassword}, {new:true})
        await TempId.findByIdAndRemove(res.locals.tempId)
        res.json({message: "success", payload: updateUser})
    }catch(e){
        console.log(e)
    }
}

async function createTempId(req, res, next){
    try{    
        const foundUser = await User.findOne({email : req.body.email});
        const tempId = new TempId({userId: foundUser._id})
        const createdTempId = await tempId.save();
        res.locals.tempId = createdTempId._id;
        next()
    }catch(e){
        console.log(e)
    }
}

async function deleteTempId(req, res, next){
    try{
        const deletedId = await TempId.findByIdAndRemove(res.locals.tempId)
        res.json({message: "ID deleted", payload: deletedId})
    }catch(e){
        console.log(e)
    }
}

module.exports = {createTempId, changePassword};