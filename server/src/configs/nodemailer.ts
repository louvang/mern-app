import nodemailer from 'nodemailer';

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

const port = parseInt(process.env.NODEMAILER_PORT as string, 10);

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: port,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export default transporter;
