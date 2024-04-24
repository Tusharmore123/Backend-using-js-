import { Router} from "express";
import { loginUser, registerUser } from "../controllers/users.contollers.js";
import { upload } from "../middleware/Multer.js";
import { verifyJwt } from "../middleware/auth_middleware.js";

const router=Router()
router.route('/register').post(
    upload.fields([{
        name:'avatar',
        maxCount:1
    },{
        name:'coverImage',
        maxCount:1
    }])
    ,registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt,loginUser)

export {router}