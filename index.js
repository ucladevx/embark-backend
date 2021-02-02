const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('secretKey', process.env.JWT_SECRET);

const PORT = process.env.PORT || 9000

//  list all routes here, such as profileRoutes, messageRoutes, etc.
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")
const studentRoutes = require("./routes/student")
const clubRoutes = require("./routes/club")

// route them accordingly eg. app.use("/profile", profileRoutes)
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/student', studentRoutes)
app.use('/club', clubRoutes)

app.get('/health', (req, res) => {
    res.status(200).send({
        message: `GET /health on Port ${PORT} successful`
    })
})

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to database')
    } catch (err) {
        console.log(err);
        console.log('Could not connect to database. Exiting...')
        process.exit(1)
    }
}

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

connectToDB()