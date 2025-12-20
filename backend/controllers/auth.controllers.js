import User from "../models/user.models.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import axios from "axios";

export const signup = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body
        const fields = {};
        // check email
        if (!firstName?.trim()) {
            fields.firstName = "First Name is required";
        }
        if (!lastName?.trim()) {
            fields.lastName = "Last Name is required";
        }
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
        // basic checks if it already exists
        let existEmail = await User.findOne({ email })
        if (existEmail) {
            fields.email = "Email already exists";
            return res.status(400).json({
                error: "EMAIL_ALREADY_EXISTS",
                fields,
                message: "email already exists !"
            })
        }

        if (password.length < 8) {
            fields.password = "password must have at least 8 characrers"
            return res.status(400).json({
                message: "password length must be 8 characters",
                error: "SHORT_PASSWORD",
                fields
            })
        }
        // hashing
        let hashedPassword = await bcrypt.hash(password, 10)
        // create user
        const user = await User.create(
            {
                firstName,
                lastName,
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

export const loginWithGoogle = async (req, res) => {
    try {
        const { googleToken } = req.body
        if (!googleToken) {
            return res.status(400).json({
                error: "TOKEN_MISSING",
                req, body: req.body,
                message: "google token is required"
            })
        }
        // 1. Verify token with Google
        const googleResAuth = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${googleToken}`,
        );

        const {
            email,
            email_verified,
            sub: googleId,
            aud,
        } = googleResAuth.data;

        // console.log(googleResAuth.data)
        // 2. Validate token audience
        if (aud !== process.env.GOOGLE_CLIENT_ID) {
            return res.status(401).json({
                error: "INVALID_TOKEN",
                message: "Token was not issued for this app",
            });
        }

        if (!email_verified) {
            return res.status(401).json({
                error: "EMAIL_NOT_VERIFIED",
                message: "Google email not verified",
            });
        }

        const googleResInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
            }
        );

        // console.log(googleResInfo.data)
        const {
            given_name,
            family_name,
            picture,
        } = googleResInfo.data;

        let user = await User.findOne({ email });
        if (!user) {
            try {
                user = await User.create({
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    googleId,
                    profileImage: picture,
                    authProvider: "google",
                });
            } catch (error) {
                console.log(error, "unable to create new user")
                return res.status(500).json({ error, messgae: "unable to create new user" })
            }
        }

        // handling users that earlier signed up with emaip password and now wish to merge their googe accounts
        if (!user.googleId) user.googleId = googleId;
        if (user.authProvider == "local") user.authProvider = "google";
        await user.save();
        // console.log(user)

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
        return res.status(200).json({ user, message: "Google log in successful" })
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Failed to authenticate with Google",
        });
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



