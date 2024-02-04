import { withIronSession } from 'next-iron-session';

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export const withSession = (handler) => withIronSession(handler, sessionOptions);
