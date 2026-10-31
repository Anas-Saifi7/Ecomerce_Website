import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto";
import User from "../models/User.js";

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CALLBACK_URL
) {
  throw new Error("Google OAuth environment variables are missing");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const emailVerified = profile._json?.email_verified === true;

        if (!email || !emailVerified) {
          return done(null, false);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          if (!user.isActive) {
            return done(null, false);
          }

          return done(null, user);
        }

        user = await User.findOne({ email });

        if (user) {
          if (!user.isActive) {
            return done(null, false);
          }

          user.googleId = profile.id;
          await user.save();

          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName || email.split("@")[0],
          email,
          googleId: profile.id,
          password: crypto.randomBytes(32).toString("hex"),
          role: "customer",
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;