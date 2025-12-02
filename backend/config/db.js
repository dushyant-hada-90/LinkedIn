import mongoose from "mongoose"

const connectDb = async()=>{
    try {
    await mongoose.connect(process.env.MONGODB_URL)
} catch (error) {
    console.log(error,"mongodb connection error");
}
}

export default connectDb