const express = require('express')
require('dotenv').config()
const authRoutes = require('./routes/authRoute')
const profileRoutes = require('./routes/productRoute')
const cookieParser = require('cookie-parser')
const {connect} = require('./db/dbConnection')
const cors = require('cors')


const app = express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())

// db connection
connect()
// auth-router 
app.use('/auth', authRoutes)
app.use('/customer', profileRoutes)

// server started
app.listen(process.env.PORT, ()=>console.log('server started on port 8000'))
