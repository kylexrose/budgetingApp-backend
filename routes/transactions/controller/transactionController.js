const Transaction = require("../model/Transaction");
const User = require("../../users/model/User");

async function getAllTransactions(req, res){
    try{
        const {decodedJwt} = res.locals;
        let payload = await User.findOne({username: decodedJwt.username})
        .populate({
            path: "transactions",
            model: Transaction,
            select: "-__v"
        })
        .select("-email -password -firstName -lastName -__v -_id -username -transactions");
        res.json(payload);
    }catch(e){
        console.log(e);
    }
}

async function createNewTransaction(req, res){
    try{
        const {description, category, amount, type} = req.body;
        const newTransaction = new Transaction({
            type,
            description,
            category, 
            amount,
        })
        const savedNewTransaction = await newTransaction.save();
        const {decodedJwt} = res.locals;
        const targetUser = await User.findOne({username: decodedJwt.username});
        targetUser.transactions.push(savedNewTransaction._id);

        await targetUser.save();
        res.json({savedNewTransaction})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function editTransactionById(req, res){
    try{
        const id = req.params.id;
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, {new: true});
        res.json({message: "success", payload: updatedTransaction})
    }catch(e){
        res.status(500);
        console.log(e);
    }
}

async function deleteTransactionById(req, res){
    try{
        const id = req.params.id;
        const deletedTransaction = await Transaction.findByIdAndRemove(id);
        const {decodedJwt} = res.locals;

        const targetUser = await User.findOne({username: decodedJwt.username})
        let newTransactionArray = targetUser.transactions.filter(id => id !== deletedTransaction._id);
        await User.findOneAndUpdate({username : decodedJwt.username}, {transactions:newTransactionArray});
        res.json({message: "success - Transaction removed"});
    }catch(e){
        res.status(500);
        console.log(e)
    }
}

module.exports = {
    getAllTransactions,
    createNewTransaction,
    editTransactionById,
    deleteTransactionById,
}