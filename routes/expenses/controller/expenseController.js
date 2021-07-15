const Expense = require("../model/Expense");
const User = require("../../users/model/User");

async function getAllExpenses(req, res){
    try{
        const {decodedJwt} = res.locals;
        let payload = await User.findOne({username: decodedJwt.username})
        .populate({
            path: "expenses",
            model: Expense,
            select: "-__v"
        })
        .select("-email -password -firstName -lastName -__v -_id -username -expenses");
        res.json(payload);
    }catch(e){
        console.log(e);
    }
}

async function createNewExpense(req, res){
    try{
        const {description, category, amount} = req.body;
        const newExpense = new Expense({
            description,
            category, 
            amount,
        })
        const savedNewExpense = await newExpense.save();
        const {decodedJwt} = res.locals;
        const targetUser = await User.findOne({username: decodedJwt.username});
        targetUser.expenses.push(savedNewExpense._id);

        await targetUser.save();
        res.json({savedNewExpense})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function editExpenseById(req, res){
    try{
        const id = req.params.id;
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {new: true});
        res.json({message: "success", payload: updatedExpense})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function deleteExpenseById(req, res){
    try{
        const id = req.params.id;
        const deletedExpense = await Expense.findByIdAndRemove(id);
        const {decodedJwt} = res.locals;

        const targetUser = await User.findOne({username: decodedJwt.username})
        let newExpenseArray = targetUser.expenses.filter(id => id !== deletedExpense._id);
        await User.findOneAndUpdate({username : decodedJwt.username}, {expenses:newExpenseArray});
        res.json({message: "success - Expense removed"});
    }catch(e){
        res.status(500);
        console.log(e)
    }
}

module.exports = {
    getAllExpenses,
    createNewExpense,
    editExpenseById,
    deleteExpenseById,
}