
import express from 'express';
const router = express.Router();
import supabase from '../config/supabase.js';

// POST /auth/signup
router.post('/signup', async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      return res.status(200).json({ message: 'Signup initiated', data });
    } catch (err) {
      return res.status(500).json({ error: 'Server error during signup.' });
    }
  });

// POST /auth/signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        return res.status(401).json({ error: error.message });
      }
  
      return res.status(200).json({
        message: 'Sign-in successful',
        session: data.session,
        user: data.user,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Server error during sign-in.' });
    }
  });

  router.post('/resetpassword', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }
      try {
        await supabase.auth.resetPasswordForEmail(email, {
            // update url
            redirectTo: 'http://localhost:3000/account/changepassword',
        })
      } catch (err) {
        return res.status(500).json({ error: 'Server error during password reset'});
      }
  })

  router.post('/changepassword', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
      }
      try {
        await supabase.auth.updateUser({ password: password })
      } catch (err) {
        return res.status(500).json({ error: 'Server error during password reset'});
      }
  })

  export { router as authRoutes };

