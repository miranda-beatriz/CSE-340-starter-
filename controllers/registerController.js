const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const pool = require('../database/');
const router = express.Router();

// Página de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', flashMessage: req.flash('error') });
});

// Processa o registro
router.post('/register', [
    body('account_firstname').notEmpty().withMessage('First name is required'),
    body('account_lastname').notEmpty().withMessage('Last name is required'),
    body('account_email').isEmail().withMessage('Enter a valid email'),
    body('account_password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
        .withMessage('Password must be at least 12 characters and contain at least 1 number, 1 uppercase letter, and 1 special character')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('register', { 
            title: 'Register', 
            errors, 
            locals: req.body 
        });
    }

    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    try {
        // Hash da senha antes de salvar no banco
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(account_password, salt);
        
        // Inserir dados no banco de dados
        const result = await pool.query(
            'INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *',
            [account_firstname, account_lastname, account_email, hashedPassword]
        );
        
        console.log('User registered:', result.rows[0]);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/account/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/account/register');
    }
});

module.exports = router;
