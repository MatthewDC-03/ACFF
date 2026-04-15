const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User = require('../model/userModel')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas')
        
        try {
            // Fetch all users
            const users = await User.find({})
            
            if (users.length === 0) {
                console.log('\n❌ No users found in the database')
            } else {
                console.log(`\n✅ Found ${users.length} user(s):\n`)
                console.log('=' .repeat(80))
                
                users.forEach((user, index) => {
                    console.log(`\nUser ${index + 1}:`)
                    console.log(`  ID: ${user._id}`)
                    console.log(`  Username: ${user.username}`)
                    console.log(`  Email: ${user.email}`)
                    console.log(`  Type: ${user.type}`)
                    console.log(`  Created: ${user._id.getTimestamp()}`)
                })
                
                console.log('\n' + '='.repeat(80))
            }
            
            process.exit(0)
        } catch (error) {
            console.error('Error fetching users:', error)
            process.exit(1)
        }
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error)
        process.exit(1)
    })
