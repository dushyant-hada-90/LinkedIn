import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import User from "../models/user.models.js"; 
import Post from "../models/post.models.js"; // 1. Import your Post model

dotenv.config();

const connectDb = async (mongoUrl) => {
    if (!mongoUrl) throw new Error("MONGODB_URL is not defined");
    try {
        await mongoose.connect(mongoUrl);
        console.log("DB connected");
    } catch (err) {
        console.error("DB connection error:", err);
        throw err;
    }
};

export async function deleteAllUsers(mongoUrl = process.env.MONGODB_URL) {
    if (!mongoUrl) throw new Error("MONGODB_URL is not defined");
    
    try {
        await connectDb(mongoUrl);

        // 2. Find the IDs of the users that are NOT the allowed one
        const usersToDelete = await User.find({
            userName: { $ne: "dushyantxxxhada90@gmail.com" }
        }).select('_id');

        const userIds = usersToDelete.map(user => user._id);

        if (userIds.length > 0) {
            // 3. Cascading Delete: Remove all posts authored by these users
            const postResult = await Post.deleteMany({
                author: { $in: userIds }
            });
            console.log(`Cascaded: Deleted ${postResult.deletedCount} posts`);

            // 4. Delete the users
            const userResult = await User.deleteMany({
                _id: { $in: userIds }
            });
            console.log(`Deleted ${userResult.deletedCount} users`);
            
            return { users: userResult, posts: postResult };
        } else {
            console.log("No users found to delete.");
            return { deletedCount: 0 };
        }

    } catch (error) {
        console.error("Error during reset operation:", error);
        throw error;
    } finally {
        try {
            await mongoose.connection.close();
        } catch (e) {}
    }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
    (async () => {
        try {
            await deleteAllUsers();
            process.exit(0);
        } catch (err) {
            process.exit(1);
        }
    })();
}