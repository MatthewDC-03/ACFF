const jwt = require('jsonwebtoken')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { Time, TimeModel } = require('../model/timeModel')
const { LogsTime } = require('../model/timeLogsModel')
const { esp32 } = require('../model/esp32Model')

const createToken = (_id) =>{
    //       payloader      the secret       user only have 3days to login and the token epxired
  return  jwt.sign({_id}, "adobojwtformyacff", { expiresIn: '3d' })
}

// login user
const loginUser = async (req,res) => {
    const {username,password} = req.body

    try {
        const user = await User.login(username,password)

        // create a token
        const userIdLogin = user._id;
        const token = createToken(userIdLogin)

        res.status(200).json({username, token, userIdLogin})
    }
    catch (error){
        res.status(400).json({error: error.message})
    }
}

// register user
const registerUser = async function(req,res){

    const {username,email,password} = req.body

    try {
        const user = await User.register(username,email,password)

        // create a token
        const userId = user._id;
        const token = createToken(userId)

        res.status(200).json({username, token})
    }
    catch (error){
        res.status(400).json({error: error.message})
    }

}

// get single user
const getUser = async (req,res) =>{
    // geting the url id whenever a user got the id from the url or type
    const { id } = req.params

    const user = await User.findById(id)

    if (!user){
        return res.status(404).json({error: "No such user"})
    }
    res.status(200).json(user)

}

// FeederShare hardware (Logic) - Manual Feed
const manualActivation = async (req, res) => {
    const { _id } = req.body;

    // Find the user and set type to true
    const user = await User.findByIdAndUpdate(_id, {
        type: true
    }, { new: true });  // Ensure you get the updated document

    if (!user) {
        return res.status(500).json({ message: "Error updating type" });
    }

    res.status(200).json({ message: "'type' set to true, will revert to false after delay via MongoDB Trigger" });
};

// FeederShare hardware (Logic) - GET Timed Feed
const getTimedFeed = async (req, res) => {
    const { id: userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
  
    try {
      // Find times for the specific user, sorted by 'time'
      const times = await TimeModel.find({ userId }).sort({ time: 1 });
  
      if (!times.length) {
        return res.status(404).json({ message: "No times found for this user." });
      }
  
      res.status(200).json(times);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
// FeederShare hardware (Logic) - POST Timed Feed
const postTimedFeed = async (req,res) => {
    const {userId, time} = req.body
    if (!userId || !time) {
        return res.status(400).json({ message: 'User ID and time are required.' });
      }
    try{
        const newTime = new TimeModel({
            userId,
            time,
        });
        await newTime.save()

        res.status(201).json({ message: 'Time added successfully!', data: newTime });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// FeederShare - Remove Fime feed
const deleteTimedFeed = async (req,res) => {
    const { userId, time } = req.body;

  if (!userId || !time) {
    return res.status(400).json({ message: 'User ID and time are required' });
  }

  try {
    // Find the time entry for the user
    const timeRecord = await TimeModel.findOne({ userId, time });

    if (!timeRecord) {
      return res.status(404).json({ message: 'Time entry not found for this user' });
    }

    // Delete the time record
    await TimeModel.deleteOne({ userId, time });

    res.status(200).json({ message: 'Time deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting time', error: error.message });
  }
}

// Post Logs Timed Feed
const logsTimeFeed = async (req,res) => {
  const {userId, timestamp, status} = req.body
    try{
        const newLogs = new LogsTime({
            userId,
            timestamp,
            status
        });
        await newLogs.save()

        res.status(201).json({ message: 'Time added successfully!', data: newLogs });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// Get Logs Timed Feed
const getLogsTimedFeed = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Find times for the specific user, sorted by 'time'
    const times = await LogsTime.find({ userId }).sort({ time: 1 });

    if (!times.length) {
      return res.status(404).json({ message: "No times found for this user." });
    }

    res.status(200).json(times);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const esp32CamID = async (req, res) => {
  const { userId, esp32ID, wifiConnectTime } = req.body;

  // Check if userId exists and is valid (string format)
  if (!userId) {
    return res.status(400).json({ message: "userId is required and cannot be null" });
  }

  // If lastUpdated is not provided, set it to null
  const wifiConnectTimeValue = wifiConnectTime || null;

  try {
    // Perform the update operation, ensuring that userId is set as a string
    const esp32data = await esp32.findOneAndUpdate(
      { userId: userId }, // Find document by string userId
      { 
        userId: userId,     // Set or update the userId as string
        esp32ID: esp32ID,   // Set or update the esp32ID
        wifiConnectTime: wifiConnectTimeValue // Set lastUpdated to null if not provided
      },
      { 
        new: true,           // Return the updated document (or newly inserted one)
        upsert: true         // Insert a new document if no match is found
      });

    // Check if data was found or inserted successfully
    if (esp32data) {
      res.status(200).json({
        message: "ESP32 ID updated successfully or new entry inserted",
        esp32data
      });
    } else {
      res.status(500).json({ message: "Failed to insert or update ESP32 data" });
    }
  } catch (error) {
    console.error("Error during ESP32 ID update:", error);
    res.status(500).json({ message: "Server error during update" });
  }
};

// Update username
const updateUsername = async (req, res) => {
    const { id } = req.params
    const { newUsername, currentPassword } = req.body

    if (!newUsername || !currentPassword) {
        return res.status(400).json({ error: 'New username and current password are required' })
    }

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ error: 'User not found' })

        // Verify current password before allowing change
        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) return res.status(401).json({ error: 'Incorrect current password' })

        // Check if username is already taken
        const exists = await User.findOne({ username: newUsername })
        if (exists) return res.status(400).json({ error: 'Username already taken' })

        user.username = newUsername
        await user.save()

        res.status(200).json({ message: 'Username updated successfully', username: newUsername })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update password
const updatePassword = async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' })
    }

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ error: 'User not found' })

        // Verify current password
        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) return res.status(401).json({ error: 'Incorrect current password' })

        // Validate new password strength
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ error: 'New password is not strong enough' })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update about
const updateAbout = async (req, res) => {
    const { id } = req.params
    const { about } = req.body

    try {
        const user = await User.findByIdAndUpdate(id, { about }, { new: true })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json({ message: 'About updated successfully', about: user.about })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get recent activity (feed logs) for a user
const getRecentActivity = async (req, res) => {
    const { id: userId } = req.params

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' })
    }

    try {
        const logs = await LogsTime.find({ userId })
            .sort({ _id: -1 }) // newest first
            .limit(10)

        res.status(200).json(logs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { loginUser, registerUser, getUser, manualActivation, getTimedFeed, postTimedFeed, deleteTimedFeed, logsTimeFeed, getLogsTimedFeed, esp32CamID, updateUsername, updatePassword, updateAbout, getRecentActivity }