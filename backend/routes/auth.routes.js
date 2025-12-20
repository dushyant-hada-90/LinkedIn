import express from "express"
import { login, loginWithGoogle, logout, signup } from "../controllers/auth.controllers.js"

let authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/google",loginWithGoogle)
authRouter.get("/logout",logout)

export default authRouter