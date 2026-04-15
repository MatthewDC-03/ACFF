const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const { loginUser, 
        registerUser, 
        getUser, 
        manualActivation, 
        getTimedFeed, 
        postTimedFeed, 
        deleteTimedFeed, 
        logsTimeFeed, 
        getLogsTimedFeed,
        esp32CamID,
        updateUsername,
        updatePassword,
        updateAbout,
        getRecentActivity
      } = require('../controller/userController')

const { getAllUsers } = require('../controller/adminController')

const router = express.Router()

// login route (no auth required)
router.post('/login', loginUser)

// register route (no auth required)
router.post('/register', registerUser)

// get all users (no auth required - for debugging/admin)
router.get('/admin/all-users', getAllUsers)

// get user (protected)
router.get('/:id', requireAuth, getUser)

// FeederShare hardware - manual active (protected)
router.patch('/toggle-type', requireAuth, manualActivation) 

// FeederShare hardware - get timed feed (protected)
router.get('/:id/get-times', requireAuth, getTimedFeed)

// FeederShare hardware - post timed feed (protected)
router.post('/set-time', requireAuth, postTimedFeed)

// FeederShare hardware - delete timed feed (protected)
router.delete('/delete-time', requireAuth, deleteTimedFeed)

// FeederShare time feed logs (protected)
router.post('/logs-feed', requireAuth, logsTimeFeed)

// FeederShare get time feed logs (protected)
router.get('/:id/get-logs', requireAuth, getLogsTimedFeed)

// FeederShare update esp32 id (protected)
router.patch('/esp32', requireAuth, esp32CamID)

// Update username (protected)
router.patch('/:id/update-username', requireAuth, updateUsername)

// Update password (protected)
router.patch('/:id/update-password', requireAuth, updatePassword)

// Update about (protected)
router.patch('/:id/update-about', requireAuth, updateAbout)

// Get recent activity (protected)
router.get('/:id/recent-activity', requireAuth, getRecentActivity)

router.get("/stream", (req, res) => {
    res.redirect(`http://192.168.100.32/stream`);
  });

module.exports = router