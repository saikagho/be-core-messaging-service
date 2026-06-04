import { Router } from 'express';
import passport from '../config/auth.js';
import { getAuthenticationCallback } from "../controllers/auth.controller.js"
import { checkGoogleConfig } from '../middlewares/authentication/google.middleware.js';
import { checkGithubConfig } from '../middlewares/authentication/github.middleware.js';
import { checkFacebookConfig } from '../middlewares/authentication/facebook.middlware.js';

const router = Router();

/** 1. Google Auth Routes **/
router.get("/google", checkGoogleConfig, passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get("/google/callback", checkGoogleConfig, passport.authenticate('google', { failureRedirect: '/login', session: false }), getAuthenticationCallback)

/** 2. Github Auth Routes **/
router.get("/github", checkGithubConfig, passport.authenticate('github', { scope: ['user:email'], session: false }))
router.get("/github", checkGithubConfig, passport.authenticate('github', { failureRedirect: '/login', session: false }), getAuthenticationCallback)

/** 3. Facebook Auth Routes **/
router.get("/facebook", checkFacebookConfig, passport.authenticate('facebook', { scope: ['email'], session: false }))
router.get("/facebook", checkFacebookConfig, passport.authenticate('facebook', { failureRedirect: '/login', session: false }), getAuthenticationCallback)

export default router;