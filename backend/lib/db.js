import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    }catch(error){
      console.error("eror connecting to mongodb", error.message)
      process.exit(1)   //1=failure,  2=success
    }
}