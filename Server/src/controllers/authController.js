import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async(req , res)=>{
    try{
        const {name , email ,phone, password } = req.body;

        // check if user already exist
        const existingUser = await prisma.user.findUnique({
            where :{
                email
            }
        });

        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            });
        }

        // hash password 
        const hashedPassword = await bcrypt.hash(password ,10);

        // create user 
        const user = await prisma.user.create({
            data:{
                name,
                email,
                phone,
                password: hashedPassword
            }
        });


        res.status(201).json({
            message:"user registered successfully",
            user:{
                id:user.id,
                name : user.name,
                email:user.email,
                phone:user.phone,
                role:user.role
            }
        });
    }
    catch(error){
         console.error("Registration error:", error);

        res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });       
    }
}


// login user logic

export const loginUser = async(req, res)=>{
    try{
        const {email , password}= req.body;

        // find user in db

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });

        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }

        // compare password

        const isPasswordCorrect = await bcrypt.compare(
            password ,
            user.password
        )
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        // create JWT here

        const token = jwt.sign({
            userId : user.id,
            role : user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    ) ;

    res.status(200).json({
        message:"User Logedin successfully",
        token,
        user:{
            id: user.id,
            name: user.name,
            email:user.email,
            phone :user.phone,
            role:user.role
        }
    })
    }

    catch(error){
         console.error("Login error:", error);

        res.status(500).json({
            message: "Failed to login",
            error: error.message
        });       
    }
}


export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};