import Post from "../models/post.models.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const createPost = async (req, res) => {
    try {
        let { description } = req.body
        let newPost
        if (req.file) {
            let image = await uploadOnCloudinary(req.file.path)
            newPost = await Post.create({
                author: req.userId,
                description,
                image
            })
        }
        else {
            newPost = await Post.create({
                author: req.userId,
                description
            })
        }
        return res.status(201).json({message:"post created successfully",newPost})
    } catch (error) {
        return res.status(500).json({message:`create post erroe ${error}`})
    }
}

export const getPost = async (req,res) => {
    try {
        const post = await Post.find().populate("author","firstName lastName profileImage headline")
        return res.status(200).json({message:"post fetched Successfully",post})
    } catch (error) {
        return res.status(500).json({message:"getPost error"})
    }
}