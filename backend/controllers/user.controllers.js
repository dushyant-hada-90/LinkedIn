import User from "../models/user.model.js"

export const getCurrentUser = async (req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user){
            return res.status(400).json({message:"user not found",userId: req.userId})
        }
        return res.status(200).json({user,message:'user fetched successfully'})

    } catch (error) {
        return res.status(400).json({message:"get current user error"})
    }
}