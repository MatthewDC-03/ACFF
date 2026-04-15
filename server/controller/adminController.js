const User = require('../model/userModel')

// Get all users (for admin/debugging purposes)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' })
        }

        // Return user info without passwords
        const userList = users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            type: user.type,
            createdAt: user._id.getTimestamp()
        }))

        res.status(200).json({
            count: users.length,
            users: userList
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getAllUsers }
