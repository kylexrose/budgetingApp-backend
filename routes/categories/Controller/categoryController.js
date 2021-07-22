const User = require('../../users/model/User');
const Category = require('../Model/Category');

async function getAllCategories(req, res){
    try{
        const {decodedJwt} = res.locals;
        console.log(decodedJwt);
        let payload = await User.findOne({username: decodedJwt.username})
        .populate({
            path: "categories",
            model: Category,
            select: "-__v"
        })
        .select("-mobileNumber -email -password -firstName -lastName -__v -_id -username -transactions");
        res.json(payload)
    }catch(e){
        console.log(e)
    }
}

async function createNewCategory(req,res){
    try{
        const {decodedJwt} = res.locals;
        const targetUser = await User.findOne({username:decodedJwt.username});
        const foundCategory = await Category.findOne({name: req.body.name});
        if(foundCategory){
            targetUser.categories.push(foundCategory._id);
            targetUser.save();
            res.json(foundCategory);
        }else{
            const newCategory = new Category({name: req.body.name});
            const saveNew = await newCategory.save();
            targetUser.categories.push(saveNew._id);
            targetUser.save();
            res.json( saveNew );
        }
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    getAllCategories,
    createNewCategory,
}