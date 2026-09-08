const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');

const authRoutes=require('./routes/auth');


// .env file configuration
dotenv.config();

// express app initialization
const app=express();

// middleware
app.use(cors());

// routes
app.use ('/api/auth',authRoutes);
app.use(express.json()); // to parse incoming JSON requests from the client

// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running at Port ${PORT}`);
})