
import {Router} from "express"
import isValid from "../middleware/validation.js"
import * as authValidationSchemas from '../modules/auth.validation.js'
import * as authController from '../modules/auth.controller.js'

const router = Router()

router.post("/signup",isValid(authValidationSchemas.signupSchema) , authController.signup)
router.get("/confirmEmail/:activationCode",isValid(authValidationSchemas.activateSchema) , authController.activateAccount)
router.post("/login",isValid(authValidationSchemas.loginSchema) , authController.login)

export default router