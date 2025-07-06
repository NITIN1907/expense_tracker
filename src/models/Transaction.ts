import mongoose,{Schema} from 'mongoose';


const TransactionSchema = new Schema(
    {
        description :{type:String,required:true},
        amount:{type:Number,required:true},
        date:{type:Date,required:true},
        category:{type:String,required:true}
    },
    {timestamps:true}
);
export default mongoose.models.Transaction || mongoose.model('Transaction',TransactionSchema)