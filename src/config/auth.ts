import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback as GoogleVerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Helper interface to represent the standard normalized profile returned after auth
export interface AuthenticatedUser {
  id: string;
  displayName: string;
  email?: string;
  provider: string;
}

// 1. Configure Google OAuth2 Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: GoogleVerifyCallback,
      ) => {
        const user: AuthenticatedUser = {
          id: profile.id,
          displayName: profile.displayName || 'Google User',
          email: profile.emails?.[0]?.value,
          provider: 'google',
        };
        return done(null, user);
      },
    ),
  );
  logger.info('🔑 Google OAuth2 strategy successfully configured.');
} else {
  logger.warn('⚠️ Google OAuth2 credentials missing. Google strategy disabled.');
}

// 2. Configure GitHub OAuth2 Strategy
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CALLBACK_URL) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        done: (err: any, user?: AuthenticatedUser | false | null) => void,
      ) => {
        const user: AuthenticatedUser = {
          id: profile.id,
          displayName: profile.displayName || profile.username || 'GitHub User',
          email: profile.emails?.[0]?.value,
          provider: 'github',
        };
        return done(null, user);
      },
    ),
  );
  logger.info('🔑 GitHub OAuth2 strategy successfully configured.');
} else {
  logger.warn('⚠️ GitHub OAuth2 credentials missing. GitHub strategy disabled.');
}

// 3. Configure Facebook OAuth2 Strategy
if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET && env.FACEBOOK_CALLBACK_URL) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
        callbackURL: env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails'],
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: FacebookProfile,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        done: (err: any, user?: AuthenticatedUser | false | null) => void,
      ) => {
        const user: AuthenticatedUser = {
          id: profile.id,
          displayName: profile.displayName || 'Facebook User',
          email: profile.emails?.[0]?.value,
          provider: 'facebook',
        };
        return done(null, user);
      },
    ),
  );
  logger.info('🔑 Facebook OAuth2 strategy successfully configured.');
} else {
  logger.warn('⚠️ Facebook OAuth2 credentials missing. Facebook strategy disabled.');
}

// Since we use stateless token handshakes (session: false), serialize/deserialize can be minimal placeholders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser(
  (
    obj: AuthenticatedUser,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (err: any, user?: AuthenticatedUser | null) => void,
  ) => {
    done(null, obj);
  },
);

export default passport;
