import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"

export const signup = async (req, res) => {
    try {
        let { firstName, lastName, userName, email, password } = req.body
        // basic checks if it already exists
        let existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "email already exists !" })
        }
        let existUsername = await User.findOne({ userName })
        if (existUsername) {
            return res.status(400).json({ message: "username already exists !" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "password length must be 8 characters" })
        }
        // hashing
        let hashedPassword = await bcrypt.hash(password, 10)
        // create user
        const user = await User.create(
            {
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
            }
        )
        console.log(user);

        // create token
        let token = genToken(user._id)
        // put token into cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"

        })
        // return response
        return res.status(201).json({ user, message: "Signed up Successfully" })
    } catch (error) {
        return res.status(500).json({ error, message: "something went wrong" })
    }
}



export const login = async (req, res) => {
    try {
        let { email, password } = req.body

        // Initialize an object to collect field errors
        const fields = {};

        // Check email
        if (!email?.trim()) {
            fields.email = "Email is required";
        }

        // Check password
        if (!password) {
            fields.password = "Password is required";
        }

        // If there are any field errors, return 400
        if (Object.keys(fields).length > 0) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                fields
            });
        }


        // basic checks if credentials are valid
        let user = await User.findOne({ email });
        if (!user) {
            // generic auth error — do NOT reveal if user exists
            return res.status(401).json({
                error: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }


        // console.log(user);
        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }
        // console.log(isMatch);


        // create token
        let token = genToken(user._id)
        // put token into cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"

        })
        // return response
        return res.status(200).json({ user, message: "log in successful" })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "login error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "logged out successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "logout error" })
    }
}

