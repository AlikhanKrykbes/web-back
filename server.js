// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const ExampleModel = require('./models/schema')

const app = express();
const port = process.env.PORT || 3000;

const connectionString = 'mongodb+srv://hanalik:b3W5nwSBZDpfCNH5@cluster0.kzhjubm.mongodb.net/assignment';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Define routes
app.post('/create', async (req, res) => {
    try {
        const newExample = await ExampleModel.create(req.body);
        res.json(newExample);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.use("/public/css", express.static(path.resolve(__dirname, 'public', 'css')))
app.use("/public/images", express.static(path.resolve(__dirname, 'public', 'images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const homeRoute = require('./public/routes/home');
const bookRoute = require('./public/routes/book');
app.post('/book/submit', async (req, res) => {
    try {
        const { tour, destination, adults, children, arrivalDate, departureDate, text } = req.body;

        // Save the form data to MongoDB using Mongoose
        const newExample = await ExampleModel.create({
            tour,
            destination,
            adults,
            children,
            arrivalDate,
            departureDate,
            text
        });

        // Send a success response back to the client
        res.status(200).json({ success: true, message: 'Tour successfully booked!' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        // Send an error response back to the client
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.use('/home', homeRoute);
app.use('/book', bookRoute);
app.get('/weather', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city = 'London';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/weather2', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city2 = 'Paris';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city2}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/weather3', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city3 = 'Islamabad';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city3}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/weather4', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city4 = 'Rome';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city4}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/weather5', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city5 = 'Agra';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city5}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/weather6', async (req, res) => {
    try {
        const apiKey = '7f0d1f04613c4c6b91b65926241901'; 
        const city6 = 'Washington'; 

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city6}&aqi=no`);

        const temperature = response.data.current.temp_c; 

        const weatherData = {
            temperature: temperature,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/home`);
});
