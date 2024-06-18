import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User.model';

interface Done {
  (err: Error | null, user?: any, info?: any): void;
}

passport.use(
  new LocalStrategy((username: string, password: string, done: Done) => {
    User.findOne({ username }, (err: Error, user: IUser) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'No such username exists.' });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done: Done) => {
  done(null, user._id);
});

passport.deserializeUser((_id: string, done: Done) => {
  User.findById(_id, (err: Error, user: IUser) => {
    done(err, user);
  });
});

export default passport;
