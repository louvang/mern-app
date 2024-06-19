import { Request, Response, NextFunction } from 'express';
import passport from '../configs/passport';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User.model';
// import { v4 as uuidv4 } from 'uuid'; // use for token generation

interface RegisterUserRequestBody {
  username: string;
  password: string;
  email: string;
}

// Register user if not yet existing
export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequestBody>,
  res: Response
) => {
  try {
    const { username, password, email } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send('User registered successfully.');
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(`Error creating user: ${err.message}`);
    } else {
      res.status(500).send('An unknown error while creating user.');
    }
  }
};

// Send confirmation email
export const sendConfirmationEmail = async (req: Request, res: Response) => {
  // TODO: nodemailer for email
  res.send('Confirmation email sent.');
};

// Confirm user email
export const confirmUserEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ confirmationToken: token });
    if (!user) {
      return res.status(400).send('Invalid confirmation token');
    }

    user.status = 'confirmed';
    user.confirmationToken = undefined;
    await user.save();

    res.send('Email confirmed successfully');
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(`Error confirming email: ${err.message}`);
    } else {
      res.status(500).send('An unknown error occurred while confirming email.');
    }
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', async (err: Error, user: IUser, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send(info.message);
    }

    try {
      await user.updateLastLogin();

      req.logIn(user, (err: Error) => {
        if (err) {
          return next(err);
        }

        res.send('Logged in successfully');
      });
    } catch (err) {
      if (err instanceof Error) {
        return res
          .status(500)
          .send(`Error updating last login: ${err.message}`);
      } else {
        return res
          .status(500)
          .send('An unknown error occurred while logging in.');
      }
    }
  })(req, res, next);
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.logout((err: Error) => {
    if (err) {
      return res.status(500).send(`Error logging out: ${err.message}`);
    }

    res.send('Logged out successfully');
  });
};

// Get current user
export const getCurrentUser = (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as IUser;
    res.send({ name: user.username });
  } else {
    res.status(401).send({ error: 'Not logged in' });
  }
};
