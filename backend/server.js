require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./model');

const app = express();
app.use(cors({
        origin:'http://localhost:5173',
        credentials:true}));
app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => console.log(err));

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({email,password:hashedPassword});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        //generating the jwt token
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"1h"
        })

        //Store in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(200).json({message:"User logged in successfully"});


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" });
});

app.get('/isAuthenticated',(req,res) => {
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
})




const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});