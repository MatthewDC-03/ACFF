require('dotenv').config({ path: './server/.env' })
const mongoose = require('mongoose')

// Define User schema inline to avoid path issues
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
    type: { type: Boolean, default: false }
})

const User = mongoose.model('User', userSchema)

// Connect to MongoDB
console.log('Connecting to MongoDB Atlas...')
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB Atlas\n')
        
        try {
            // Fetch all users
            const users = await User.find({})
            
            if (users.length === 0) {
                console.log('❌ No users found in the database')
            } else {
                console.log(`✅ Found ${users.length} user(s):\n`)
                console.log('='.repeat(80))
                
                users.forEach((user, index) => {
                    console.log(`\nUser ${index + 1}:`)
                    console.log(`  ID: ${user._id}`)
                    console.log(`  Username: ${user.username}`)
                    console.log(`  Email: ${user.email}`)
                    console.log(`  Type: ${user.type}`)
                    console.log(`  Created: ${user._id.getTimestamp()}`)
                })
                
                console.log('\n' + '='.repeat(80))
                console.log('\n📝 Use these credentials to login to the application')
            }
            
            process.exit(0)
        } catch (error) {
            console.error('Error fetching users:', error)
            process.exit(1)
        }
    })
    .catch((error) => {
        console.error('❌ Failed to connect to MongoDB:', error.message)
        process.exit(1)
    })
