const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"]
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

// Password Hashing
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
       this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

//Generate Token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({_id: this._id}, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });
        this.tokens = this.tokens.concat({ token })
        await this.save()
        return token;
    } catch (error) {
        console.log(error)
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User;