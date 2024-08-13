import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User, { IUser } from '../models/User.model';

// Environment variable configuration
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: `${__dirname}/../../.env.production.local`,
  });
} else {
  require('dotenv').config({
    path: `${__dirname}/../../.env.development.local`,
  });
}

interface Done {
  (err: Error | null, user?: any, info?: any): void;
}

interface JwtPayload {
  id: string;
}

// Local strategy
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

// JWT Strategy
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET not defined');
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done: Done) => {
    try {
      const user = await User.findById(jwt_payload.id).exec();
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      if (err instanceof Error) {
        return done(err, false);
      } else {
        return done(
          new Error('An unknown error occurred while verifying token.')
        );
      }
    }
  })
);

export default passport;
