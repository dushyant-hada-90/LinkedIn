import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";   // adjust path if needed

dotenv.config();

// Connect helper
const connectDb = async (mongoUrl) => {
	if (!mongoUrl) throw new Error("MONGODB_URL is not defined");
	try {
		// removed deprecated options that newer mongodb drivers reject
		await mongoose.connect(mongoUrl);
		console.log("DB connected");
	} catch (err) {
		console.error("DB connection error:", err);
		throw err;
	}
};

// Exported function to delete all User entries (safe for programmatic use)
export async function deleteAllUsers(mongoUrl = process.env.MONGODB_URL) {
	if (!mongoUrl) throw new Error("MONGODB_URL is not defined");
	let result;
	try {
		await connectDb(mongoUrl);
		result = await User.deleteMany({});
		console.log(`Deleted ${result.deletedCount} users`);
		return result;
	} catch (error) {
		console.error("Error deleting users:", error);
		throw error;
	} finally {
		try {
			await mongoose.connection.close();
		} catch (e) {
			// ignore close errors
		}
	}
}

// CLI invocation: run when this file is executed directly
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
