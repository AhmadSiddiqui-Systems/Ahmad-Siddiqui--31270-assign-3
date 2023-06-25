const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.send("Plz fill all the fields")
    }
    try {
        const userExist = await User.findOne({ email })

        if(userExist){
            return res.send("User already existed with the Email")
        }

        const register = await User.create({
            name,
            email,
            password,
        })

        return res.json({message: "User Registered Successfully!",
                            register})
        
    } catch (error) {
        return res.send(error)
    } 
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.send("Plz fill all the fields!")
    }

    const userExist = await User.findOne({email});

    if(userExist){
        const isMatch = await bcrypt.compare(password, userExist.password);

        if(isMatch){
            const token = await userExist.generateAuthToken();
            console.log(token)
            return res.send("User Login Successfully!")
        }else{
            return res.send("Invalid Credentials!")
        }    
    }else{
        return res.send("User not Found!")
    }

}



module.exports = {
    registerUser,
    loginUser
};