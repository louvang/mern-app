import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  profilePicture?: string;
  bio?: string;
  role: 'user' | 'admin' | 'master';
  status: 'active' | 'inactive' | 'suspended' | 'banned' | 'deleted';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin', 'master'],
      default: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'banned', 'deleted'],
      default: 'active',
      required: true,
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Set displayName to username if not provided
userSchema.pre('save', function (next) {
  const user = this as IUser;
  if (!user.displayName) {
    user.displayName = user.username;
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema);
