const Income = require("../model/Income");
const User = require("../../users/model/User");

async function getAllIncomes(req, res){
    try{
        const {decodedJwt} = res.locals;
        let payload = await User.findOne({username: decodedJwt.username})
        .populate({
            path: "incomes",
            model: Income,
            select: "-__v"
        })
        .select("-email -password -firstName -lastName -__v -_id -username -expenses");
        res.json(payload);
    }catch(e){
        console.log(e);
    }
}

async function createNewIncome(req, res){
    try{
        const {description, category, amount} = req.body;
        const newIncome = new Income({
            description,
            category, 
            amount,
        })
        const savedNewIncome = await newIncome.save();
        const {decodedJwt} = res.locals;
        const targetUser = await User.findOne({username: decodedJwt.username});
        targetUser.incomes.push(savedNewIncome._id);

        await targetUser.save();
        res.json({savedNewIncome})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function editIncomeById(req, res){
    try{
        const id = req.params.id;
        const updatedIncome = await Income.findByIdAndUpdate(id, req.body, {new: true});
        res.json({message: "success", payload: updatedIncome})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function deleteIncomeById(req, res){
    try{
        const id = req.params.id;
        const deletedIncome = await Income.findByIdAndRemove(id);
        const {decodedJwt} = res.locals;

        const targetUser = await User.findOne({username: decodedJwt.username})
        let newIncomeArray = targetUser.incomes.filter(id => id !== deletedIncome._id);
        await User.findOneAndUpdate({username : decodedJwt.username}, {incomes:newIncomeArray});
        res.json({message: "success - income removed"});
    }catch(e){
        res.status(500);
        console.log(e)
    }
}

module.exports = {
    getAllIncomes,
    createNewIncome,
    editIncomeById,
    deleteIncomeById,
}