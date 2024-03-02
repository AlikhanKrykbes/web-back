const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const ExampleModel = require('./models/schema');
const passportLocalMongoose = require('passport-local-mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const User = require('./models/user'); 

// Create Express app
const app = express();
const port = process.env.PORT || 3000;


// Connect to MongoDB
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

app.use(session({ secret: 'hello', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// Configure Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Указываем имя поля для email
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
        
            const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
        
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  // После настройки Passport
app.use(passport.initialize());
app.use(passport.session());

// Определение методов serialize и deserialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.resolve()));
  
  
  app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body; // Добавляем username в деструктуризацию

    // Проверяем, совпадают ли пароли
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }

    try {
        // Проверяем, существует ли пользователь с таким же email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Отладочный вывод для проверки значений перед хешированием пароля
        console.log('Password before hashing:', password);

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log('Password after hashing:', hashedPassword);
        const newUser = new User({ firstName, lastName, email, username, password: hashedPassword });
        await newUser.save();
        req.login(newUser, (err) => {
            if (err) {
                console.error('Error during login after registration:', err);
                return res.status(500).json({ message: 'Internal server error during user login after registration' });
            }
           // Отправляем URL для перенаправления
            return res.redirect('/book');
        });
        

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error during user registration' });
    }
});

  
app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            console.log('Login failed: Email or password is missing');
            return res.status(401).send('Email or password is missing');
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).send('User not found');
        }

        if (!user.password) {
            console.log('Login failed: User password is missing');
            return res.status(401).send('User password is missing');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Login failed: Incorrect password');
            return res.status(401).send('Incorrect password');
        }

        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error('Login error:', loginErr);
                return next(loginErr);
            }
            console.log('Login successful');
            
            return res.redirect('/book'); // Отправляем URL для перенаправления
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during user login' });
    }
});


// Serve static files
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

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
const loginRoute = require('./public/routes/signin');
const registerRoute = require('./public/routes/signup')



// Регистрация маршрутов
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
app.use('/login', loginRoute);
app.use('/register', registerRoute);

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