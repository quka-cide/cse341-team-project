const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Assuming your User model is here

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // MUST MATCH the authorized redirect URI in your Google Developer Console
        callbackURL: '/api/users/google/redirect', 
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists in your DB
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                // User exists, return the user object
                return done(null, existingUser);
            } else {
                // User does not exist, create a new user account
                const newUser = await User.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    // No password needed for OAuth login
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.error('Error during Google authentication:', err);
            return done(err, null);
        }
    })
);

// Passport serialization: how to store the user in the session (optional, but good practice)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});