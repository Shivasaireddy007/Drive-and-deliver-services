"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("./entity/User");
const data_source_1 = __importDefault(require("./data-source")); // ✅ Fix incorrect import
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userRepository = data_source_1.default.getRepository(User_1.User);
        let user = await userRepository.findOne({
            where: { email: profile.emails[0].value },
        });
        if (!user) {
            user = userRepository.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: 'oauth',
            });
            await userRepository.save(user);
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
// ✅ Fix `serializeUser` & `deserializeUser` typing issues
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const userRepository = data_source_1.default.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
