require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const cors = require('cors')

// epxress app
const app = express()

app.use(cors({
    origin: ['https://acff.vercel.app', 'https://localhost:4000', 'https://acff-api.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH','PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}))


// middleware
app.use(express.json())

// Example user route
app.get('/', (req, res) => {
    res.json({message: "HELLO"});
});

app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)

// connecto db
mongoose.connect(process.env.MONGO_URI, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
})
.then(()=>{
    app.listen(4000, () =>{
        console.log('connected to db')
    })
})
.catch((error)=>{
    console.log(error)
})