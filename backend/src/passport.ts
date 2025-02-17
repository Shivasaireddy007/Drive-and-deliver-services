import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './entity/User';
import AppDataSource from './data-source'; // ✅ Fix incorrect import

// ✅ Define a new interface instead of recursive reference
interface CustomUser {
  id: number;
  email: string;
  name: string;
}

// ✅ Extend Express.User with our custom type
declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
      try {
        const userRepository = AppDataSource.getRepository(User);

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
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// ✅ Fix `serializeUser` & `deserializeUser` typing issues
passport.serializeUser((user: CustomUser, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
