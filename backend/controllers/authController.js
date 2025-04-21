const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/UserModel');


const getAuthentication=(req,res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({isAuthenticated:false});
    }
    try{
        jwt.verify(token,process.env.JWT_SECRET);
        res.json({isAuthenticated:true});
    }
    catch(err){
        res.json({isAuthenticated:false});
    }
}

const login = async (req, res) => {
    const { email, password } = req.body; // 'email' here could be either email or name

    try {
        let user;

        // Simple check to see if input is email or name
        if (email.includes('@')) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ name: email });
        }

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Store in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json(
            { message: "User logged in successfully" ,
                name: user.name,
                email: user.email 
            });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


const logout=()=>(req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" });
}

const signup=async (req, res) => {
    const { name,email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        const existingUserName = await User.findOne({name});
        if (existingUser || existingUserName) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name,email,password:hashedPassword});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports={getAuthentication,logout,login,signup}