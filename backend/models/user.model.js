import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:[true, "Name is required"]
    },
    email:{
        type:String,
        required :[true, "email is requied"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minLength:[6, "password must be atleast 6 characters"]
    },
    cart:[
        {
            quantity:{
                type:Number,
                default:1
            } ,
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            }
        }
    ],
  role: {
  type: String,
  enum: ["customer", "admin"],
  default: "customer",
  set: v => v.trim(),   // ✅ ensures whitespace is removed
}

},{timestamps:true})



//user ka password databse me save krne se pehle hum "Hashing" krenge (actual password ko database me save nhi krenge , dummy password save krenge taki koi agr humare databse me aya to password na dikhe)
 userSchema.pre("save", async function(next){   
    if(!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
         next(error)
    }
 })
 //if actual data is= john password:123456
 //and if user write= john password:12345678
 //then this function will run and give error
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


 const User = mongoose.model("User", userSchema)
export default User;