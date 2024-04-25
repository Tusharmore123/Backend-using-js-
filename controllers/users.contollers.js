
import { asynchandler } from "../utils/asycnhandler.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/Clodinary.js";
import { ApiResponseHandler } from "../utils/ApiResponseHandler.js";
import jwt from 'jsonwebtoken';
const registerUser = asynchandler(async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })

    // Insert User 
    // get User details from front end
    // validate the user details are not ""
    // check for existing users based on email or username
    // get avatar and coverImage
    // validate avavtar and coverage
    // update avatar and cover image to cloudinary 
    // insert  values into database
    // to get the values from milter we add it in middle ware  and then access it using req.files()

    const { name, email, fullName, password } = req.body

    if ([name, email, fullName, password].some((field) => {
        field.trim() === ""
    })) {
        throw new ApiError("All fields are required", 407)

    }
    const existingUser = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })
    console.log(existingUser)

    if (existingUser) {
        throw new ApiError('User already exists', 407)
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(avatarLocalPath)
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError("avatarImage is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError("failed to upload avatar", 500)
    }
    const user = await User.create({
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        name: name,
        password: password,
        email: email,
        fullName: fullName

    })
    console.log(user)
    const createdUser = await User.findById(user.id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError("Failed to craete new user", 500)
    }

    res.sendStatus(201).json(
        new ApiResponseHandler(createdUser, 200, "Created new user successfully")
    )

})
const generateRefreshAndAccessToken = async (userId) => {
    try {

        const user = await User.findById(userId)
        const accessToken = await user.generateAcessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError("Failed to generate access token", 500)
    }
}

const loginUser = asynchandler(async (req, res) => {
    // get username and password
    // validate username and password
    // generate referesh and access token
    // add it in database
    // Send info in cookie
    const { email, password, name } = req.body

    if (!(email || name)) {
        throw new ApiError("provide username or password")
    }
    if (!name) {
        throw new ApiError('Provide User Name', 407)
    }

    const user = await User.findOne({
        $or: [{ email }, { name }]
    })
    const userValidate = user.validatePassword(password)
    if (!userValidate) {
        throw new ApiError("Enter Valid Password", 407)
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)
    const userDetails = User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    res.cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)

    res.sendStatus(200).json(
        new ApiResponseHandler(
            userDetails,
            200,
            "Logged In Successfully"
        )
    )
})

const logoutUser = asynchandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError("failed to logOut", 500)

    }
    const userData = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }

        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }

    res.sendStatus(200).
        clearCookie("accessToken", accessToken)
        .clearCookie("refreshToken", refreshToken)
        .json(
            new ApiResponseHandler({}, 200, "logged out successfully")
        )
})


export const refreshUserSession = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError("invalid request", 401)
    }
    const user = jwt.verify(incomingRefreshToken,
        process.env.REFRESH_TOKEN)
    if (!user) {
        throw new ApiError('Invalid refresh taken', 402)
    }
    const oldRefreshTokenInfo = await User.findById(user.Id)

    if (refreshToken != oldRefreshTokenInfo.refreshToken) {
        throw new ApiError("Invalid token ", 402)
    }
    const { accessToken, refreshToken } = generateRefreshAndAccessToken(user._id)
    options = {
        httpOnly: true,
        secure: true
    }
    res.cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
    res.sendStatus(200).json(
        new ApiResponseHandler({ accessToken, newRefreshToken: refreshToken }
            , 200,
            "new session generated successfully")
    )

})

const changeCurrentUserPassword = async(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword || newPassword)) {
        throw new ApiError("please enter old and new password", 402)
    }
    const user = await User.findById(req?._id)
    const isPasswordCorrect = user.validatePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError("UnAuthorized User", 401)
    }

    if (!user) {
        throw new ApiError("Invalid User Id", 401)
    }
    user.password = newPassword
    user.save();
    res.send(200).json(
        new ApiResponseHandler({ password: newPassword }, 200, "Updated Successfully")
    )
})


const updateUserDetails = async(async (req, res) => {
    const { email, fullName } = req.body
    if (!email && !fullName) {
        throw new ApiError("All info is required", 401)
    }
    const user = await User.findByIdAndUpdate(req?.id,

        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    )
    res.send(200).json({
        fullName,
        email,
        message: "updated successfully"
    })
})

const updateUserAvatar = async(async (req, res) => {
    const avatarFilePath = req.file?.path
    if (!avatarFilePath) {
        throw new ApiError("Avatar file path is missing", 401)

    }
    const avatar = uploadOnCloudinary(avatarFilePath)
    if (!avatar) {
        throw new ApiError("fail to upload file on cloudinary", 401)
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, {
        new: true
    }).select("-password")
    return res.send(200).json({
        'data': user
        , message: 'updated avatar Successfully'
    })
})
const updateCoverImage = async(async (req, res) => {
    const coverImageFilePath = req.file?.path
    if (!coverImageFilePath) {
        throw new ApiError("Cover Image file path is missing", 401)

    }
    const coverImage = uploadOnCloudinary(coverImageFilePath)
    if (!coverImage) {
        throw new ApiError("fail to upload coverImage file on cloudinary", 401)
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }, {
        new: true
    }).select("-password")
    return res.send(200).json({
        'data': user
        , message: 'updated coverImage Successfully'
    })
})



const getChannelSubscriber = asynchandler(async (req, res) => {
    const { name } = req.params
    if (!name) {
        throw new ApiError("Invalid username", 400)
    }

    const channel = User.aggregate([{
        $match: {
            name: name
        }
    },
    {
        $lookup: {
            from: "subscribers",
            localField: "_id",
            foreignField: 'channel',
            as: 'subscribers'
        }
    },
    {
        $lookup: {
            from: "subscribers",
            localField: "_id",
            foreignField: 'subscriber',
            as: 'subscribedTo'
        }
    },
    {
        $addFields: {
            subscribersCount: {
                $size: '$subscribers'
            },
            subscribedCount: {
                $size: '$subscribedTo'
            },
            isSubscribed: {
                $condition: {
                    if: { $in: [req.user?._id, '$subscribers.subscriber'] },
                    then: true,
                    else: false

                }
            }
        }
    },{
    $project:{
        name:1,
        email:1,
        fullName:1,
        subscribersCount:1,
        subscribedCount:1,
        avatar:1,
        coverImage:1

    }
}
    ])
    if (!channel?.length){
        throw new ApiError("Invalid channnel",400)
    }

    return res.send(200).json(
        new ApiResponseHandler(channel,200)
    )

})

const getCurrentUser=asynchandler(async(req,res)=>{
    return req.user
})



const getUserWatchHistory=asynchandler(async (req,res)=>{
    const user=User.aggregate({
        $match:{
            _id:mongoose.Types.ObjectId(req.user?._id)
        }
    },
    {
        $lookup:{
            from :"videos",
            localField:'watchHistory',
            foreignField:'_id',
            as:'watchHistory',
            pipeline:[
                {
                    $lookup:{
                        from:'users',
                        localField:'owner',
                        foreignField:'_id',
                        as :'owner',
                        pipeline:[{
                            $project:{
                                name:1,
                                email:1,
                                avatar:1,
                                fullName
                            }
                        }]
                    },
                    $addFields:{
                        owner:{
                            first:'$owner'
                        }
                    }
                }
            ]
        }
    }
)
    if(!user?.wathcHistory){
        throw new ApiError('Invalid user',400)
    }
    return res.send(200).json(
        new ApiResponseHandler(user[0].wathcHistory,200)
    )
})





export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateCoverImage,
    updateUserAvatar,
    updateUserDetails,
    changeCurrentUserPassword,
    getChannelSubscriber,
    getUserWatchHistory
}