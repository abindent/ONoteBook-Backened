// Importing Modules
const connectToMongo = require('./db');
const express = require('express')
const cors = require("cors")

// Connection to MongoDB
connectToMongo();

// CONFIGURATION
const app = express()
const port = process.env.PORT || 3000

// MIDDLEWARES
app.use(express.json())
app.use(cors())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// Redirecting to hide backened API
app.get("/", (req, res) => {
    res.redirect("https://github.com/abindent")
})

app.listen(port, () => {
    console.log(`ONotebook backend listening at https://onotebook-backened.herokuapp.com`)
})
