import { Router} from "express";
import { changeCurrentUserPassword, getChannelSubscriber, getCurrentUser, getUserWatchHistory, loginUser, registerUser, updateCoverImage, updateUserAvatar, updateUserDetails } from "../controllers/users.contollers.js";
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
router.route('/currentUser').post(verifyJwt,getCurrentUser)
router.route('/change-password').post(verifyJwt,changeCurrentUserPassword)

router.route('/change/coverImage').patch(verifyJwt,updateCoverImage)
router.route('/change/avatar').patch(verifyJwt,upload.single('avatar'),updateUserAvatar)
router.route('/change/user-details').patch(verifyJwt,updateUserDetails)
router.route('/channel-subscriber/:name').get(verifyJwt,getChannelSubscriber)
router.route('/watchHistory').get(verifyJwt,getUserWatchHistory)



export {router}