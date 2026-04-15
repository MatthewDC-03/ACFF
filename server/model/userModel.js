const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    about: {
        type: String,
        default: ''
    },
    totalVideos: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    type: { type: Boolean, default: false }
})


// Register logic - this don't work then using an arrow function
userSchema.statics.register = async function (username,email,password){

    // validation
    if(!username  || !email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough')
    }

    // findOne - on this statement when you find a same email throw an Error
    const usernameExists = await this.findOne({username})
    const emailExists = await this.findOne({email})

    if(usernameExists || emailExists){
        throw Error('Username or Email already uses')
    }

    // [ HASH PASSWORD ]
    // salt = now salt is basically a random string of characters that gets added to the users password before
    // it gets hashed and it also add a extra layer security to it because it means that if two people use the same password
    // if the salt for each of those passwords was different then the resulting hash would be different as well so it prevents hackers from
    // password matching if they manage to crack one since hashes for identical password will be different thanks to that salt.

    const salt = await bcrypt.genSalt(10, ) // we use await because this step takes time to complete by Design.
                                            // the first argument which is the number of rounds the higher the number the longer it will take for potential
                                            // hackers to crack password but also it takes longer for users to signup as well. Default is 10.
    
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({username, email, password: hash})

    return user

}

// Login logic
userSchema.statics.login = async function(username,password){
    // validation
    if(!username  || !password) {
        throw Error('All fields must be filled')
    }
    const findUser = await this.findOne({username})
    if(!findUser){
        throw Error('Incorrect Username')
    }
    const match = await bcrypt.compare(password, findUser.password)

    if (!match){
        throw Error('Incorrect password')
    }

    return findUser
}

module.exports = mongoose.model('User', userSchema)