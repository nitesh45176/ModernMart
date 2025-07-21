import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { 
        type: String,
         required: true ,
        unique:true
    },
    discountPercentage: { 
        type: Number,
         required: true ,
        min:0,
        max:100
    },
    expirationDates: { 
        type: Date,
         required: true ,
    },
    isActive: { 
        type: Boolean,
         required: true ,
        unique:true
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true})

 const Coupon = mongoose.model("Coupon", couponSchema)

 export default Coupon;