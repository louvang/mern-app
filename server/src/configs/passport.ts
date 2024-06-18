import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User.model';

interface Done {
  (err: Error | null, user?: any, info?: any): void;
}

passport.use(
  new LocalStrategy(async (username: string, password: string, done: Done) => {
    try {
      const user: IUser | null = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'No such username exists.' });
      }

      const isValidPassword = await user.validPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      if (err instanceof Error) {
        return done(err);
      } else {
        return done(new Error('An unknown error occurred while logging in.'));
      }
    }
  })
);

passport.serializeUser((user, done: Done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id: string, done: Done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    if (err instanceof Error) {
      return done(err);
    } else {
      return done(new Error('An unknown error occurred while logging out.'));
    }
  }
});

export default passport;
