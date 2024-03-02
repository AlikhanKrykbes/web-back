const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Configure Passport.js to use a local strategy
passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
