import { connectToDatabase } from "@/lib/mongodb";
import Transaction from '@/models/Transaction';
import { NextApiRequest,NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    await connectToDatabase();
    if(req.method=='GET'){
        const transaction = await Transaction.find().sort({date:-1})
        return res.status(200).json(transaction);
    }
    
    if(req.method == 'POST'){
        const {description,amount,date,category}= req.body;
        const newTransaction = new Transaction({description,amount,date,category});
        await newTransaction.save();
        return res.status(201).json(newTransaction)
    }
    res.setHeader('Allow',['GET','POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}