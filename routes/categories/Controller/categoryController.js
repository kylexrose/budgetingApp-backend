const User = require('../../users/model/User');
const Category = require('../Model/Category');

async function getAllCategories(req, res){
    try{
        const {decodedJwt} = res.locals;
        let payload = await User.findOne({username: decodedJwt.username})
        .populate({
            path: "categories",
            model: Category,
            select: "-__v"
        })
        .select("-email -password -firstName -lastName -__v -_id -username -transactions");
        res.json(payload)
    }catch(e){
        console.log(e)
    }
}

async function createNewCategory(req,res){
    try{
        const {decodedJwt} = res.locals;
        const targetUser = await User.findOne({username:decodedJwt.username});
        const newCategory = new Category({name: req.body.name});
        const saveNew = await newCategory.save();
        targetUser.categories.push(saveNew._id);
        targetUser.save();
        res.json( saveNew );
    }catch(e){
        console.log(e)
    }
}

async function editCategoryById(req,res, next){
    try{
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name})
        res.json({message: "success", payload: updatedCategory})
    }catch(e){
        console.log(e)
    }
}

async function deleteCategoryById(req, res, next){
    try{
        console.log(req.params.id)
        const deletedCategory = await Category.findByIdAndRemove(req.params.id);
        const foundUser = await User.findOne({username: res.locals.decodedJwt.username})
        const newCategoryArray = await foundUser.categories.filter(item=> item !== req.params.id)
        await User.findByIdAndUpdate(foundUser._id, {categories: newCategoryArray})
        res.json({message: "category deleted", payload: deletedCategory})
    }catch(e){
        console.log(e);
    }
}

module.exports = {
    getAllCategories,
    createNewCategory,
    editCategoryById,
    deleteCategoryById
}