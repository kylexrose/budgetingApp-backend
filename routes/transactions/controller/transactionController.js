const Transaction = require("../model/Transaction");
const User = require("../../users/model/User");



async function getAllTransactions(req, res){
    const {sorted} = req.body;
    try{
        const {decodedJwt} = res.locals;
        let payload = await Transaction.find({
            user: decodedJwt.username, 
            "date.year" : {$eq: +req.params.year}, 
            "date.month" : {$eq: +req.params.month}, 
            // type: {$in: sorted }
        })
        // .populate({
        //     path: "transactions",
        //     model: Transaction,
        //     match: {"date.year" : {$eq: +req.params.year}, "date.month" : {$eq: +req.params.month}, type: {$in: sorted}},
        //     select: "-__v"
        // })
        // .select(" -email -password -firstName -lastName -__v -_id -username -categories");
        let sumObj = {
            Income: 0,
            Expense: 0,
            Savings: 0,
            category : {},
        };
        payload.map(transaction =>{
            if(transaction.type === "Income"){
                sumObj.Income = sumObj.Income + +transaction.amount;
            }else{
                if(transaction.category === "Savings"){
                    sumObj.Savings += +transaction.amount;
                }else if(sumObj.category[transaction.category]){
                    sumObj.category[transaction.category] += +transaction.amount;
                    sumObj.Expense += +transaction.amount;
                }else{
                    sumObj.category[transaction.category] = +transaction.amount;
                    sumObj.Expense += +transaction.amount;
                }
            }
        })
        res.json({sumObj: sumObj, payload: payload});
    }catch(e){
        res.json({error: e})
    }
}

async function createNewTransaction(req, res){
    try{
        const {decodedJwt} = res.locals;
        const {description, category, type, date} = req.body;
        const user = await User.findOne({username: decodedJwt.username})
        if(!user){
            res.json({message: 'nope'})
        }else{
            let {amount} = req.body;
            amount = +amount;
            amount = amount.toFixed(2);
            const newTransaction = new Transaction({
                type,
                description,
                category, 
                amount,
                date,
                user: user.username
            })
            const savedNewTransaction = await newTransaction.save();
            
            // const targetUser = await User.findOne({username: decodedJwt.username});
            // targetUser.transactions.push(savedNewTransaction._id);
            
            // await targetUser.save();
            res.json({savedNewTransaction})
        }
        }catch(e){
        res.status(500);
    }
}

async function editTransactionById(req, res){
    try{
        const id = req.params.id;
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, {new: true});
        res.json({message: "success", payload: updatedTransaction})
    }catch(e){
        res.status(500);
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
    }
}

module.exports = {
    getAllTransactions,
    createNewTransaction,
    editTransactionById,
    deleteTransactionById,
}