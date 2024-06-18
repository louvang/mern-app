import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  confirmationToken?: string;
  displayName?: string;
  profilePicture?: string;
  bio?: string;
  role: 'user' | 'admin';
  status: 'unconfirmed' | 'confirmed' | 'suspended' | 'banned' | 'deleted';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  changeUsername(newUsername: string): Promise<void>;
  changeEmail(newEmail: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  changeDisplayName(newDisplayName: string): Promise<void>;
  changeProfilePicture(newProfilePicture: string): Promise<void>;
  changeBio(newBio: string): Promise<void>;
  validPassword(password: string): Promise<boolean>;
  updateLastLogin(): Promise<void>;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuidv4() },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmationToken: { type: String },
    displayName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['unconfirmed', 'confirmed', 'suspended', 'banned', 'deleted'],
      default: 'unconfirmed',
      required: true,
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Method to change username
userSchema.methods.changeUsername = async function (
  newUsername: string
): Promise<void> {
  try {
    const existingUser = await mongoose
      .model<IUser>('User')
      .findOne({ username: newUsername });

    if (existingUser) {
      throw new Error('Username is already taken.');
    }

    this.username = newUsername;
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing username: ${err.message}`);
    } else {
      throw new Error('An unknown error occurred while changing the username.');
    }
  }
};

// Method to change email
userSchema.methods.changeEmail = async function (
  newEmail: string
): Promise<void> {
  try {
    const existingUser = await mongoose
      .model<IUser>('User')
      .findOne({ email: newEmail });

    if (existingUser) {
      throw new Error('Email is already taken.');
    }

    this.email = newEmail;
    this.status = 'unconfirmed';
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing email: ${err.message}`);
    } else {
      throw new Error('An unknown error occurred while changing the email.');
    }
  }
};

// Method to change password
userSchema.methods.changePassword = async function (
  newPassword: string
): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    this.password = hashedPassword;
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing password: ${err.message}`);
    } else {
      throw new Error('An unknown error occurred while changing the password.');
    }
  }
};

// Method to change display name
userSchema.methods.changeDisplayName = async function (
  newDisplayName: string
): Promise<void> {
  try {
    this.displayName = newDisplayName;
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing display name: ${err.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while changing the display name.'
      );
    }
  }
};

// Method to change profile picture
userSchema.methods.changeProfilePicture = async function (
  newProfilePicture: string
): Promise<void> {
  try {
    this.profilePicture = newProfilePicture;
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing profile picture: ${err.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while changing the profile picture.'
      );
    }
  }
};

// Method to change bio
userSchema.methods.changeBio = async function (newBio: string): Promise<void> {
  try {
    this.bio = newBio;
    await this.save();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error changing bio: ${err.message}`);
    } else {
      throw new Error('An unknown error occurred while changing the bio.');
    }
  }
};

// Static method to find by role
userSchema.statics.findByRole = function (role: string): Promise<IUser[]> {
  return this.find({ role }).exec();
};

// Static method to find by status
userSchema.statics.findByStatus = function (status: string): Promise<IUser[]> {
  return this.find({ status }).exec();
};

// Method to validate password for login
userSchema.methods.validPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Method to update last login timestamp
userSchema.methods.updateLastLogin = async function (): Promise<void> {
  this.lastLogin = new Date();
  await this.save();
};

export default mongoose.model<IUser>('User', userSchema);
