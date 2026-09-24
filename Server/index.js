const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');

const authRoutes=require('./routes/auth.js');
const eventsRoutes=require('./routes/events.js');
const bookingRoutes=require('./routes/booking.js');


// .env file configuration
dotenv.config();

// express app initialization
const app=express();

// middleware
app.use(cors());
app.use(express.json()); // to parse incoming JSON requests from the client
app.use(express.urlencoded({ extended: true })); // to parse incoming URL-encoded requests from the client

// routes
app.use ('/api/auth',authRoutes);
app.use ('/api/events',eventsRoutes);
app.use ('/api/bookings',bookingRoutes);

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