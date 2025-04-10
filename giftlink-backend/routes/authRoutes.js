//Step 1 - Task 2: Import necessary packages
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Pino = require('pino');
const { body, validationResult } = require('express-validator');

const connectToDatabase = require('../models/db');
const { ReturnDocument } = require('mongodb');

//Step 1 - Task 3: Create a Pino logger instance
const logger = Pino()

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register',
        body('email').isEmail(),
        body('firstName').notEmpty(),
        body('lastName').notEmpty(),
        body('password').notEmpty(),
        async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const coll = db.collection("users");

        //Task 3: Check for existing email
        const email = req.body.email;
        if (await coll.findOne({"email": email})) {
            logger.info("User already exists");
            return res.status(409).send("Email already registered");
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        //Task 4: Save user details in database
        const result = await coll.insertOne({
            "email": email,
            "password": hash,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
        });
        //Task 5: Create JWT authentication with user._id as payload
        const authtoken = jwt.sign({"id": result.insertedId}, JWT_SECRET, {"expiresIn": "1h"});
        logger.info('User registered successfully');
        res.json({
            authtoken,
            email
        });
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

router.post('/login',
        body('email').isEmail(),
        body('password').notEmpty(),
        async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const coll = db.collection('users');
        // Task 3: Check for user credentials in database
        // Task 5: Fetch user details from database
        const user = await coll.findOne({"email": req.body.email});
        if (!user) {
            // Task 7: Send appropriate message if user not found
            logger.info("User does not exist");
            return res.status(404).send("Email not found");
        }
        
        // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
            if (err) throw err;
            if (result) {
                // Task 6: Create JWT authentication if passwords match with user._id as payload
                const authtoken = jwt.sign({"id": user._id}, JWT_SECRET, {"expiresIn": "1h"});
                res.json({
                    authtoken,
                    'firstName': user.firstName,
                    'email': user.email
                });
            } else {
                logger.info("Password does not match");
                return res.status(401).send("Password does not match");
            }
        });
    } catch (e) {
         return res.status(500).send('Internal server error');

    }
});

router.put('/update',
    body('email').notEmpty().isEmail().withMessage('Invalid email format'),
    body('name').notEmpty().isAlpha().withMessage('Name is required'),
    async (req, res) => {
    // Task 2: Validate the input using `validationResult` and return approiate message if there is an error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
        // Task 4: Connect to MongoDB
        const db = await connectToDatabase();
        const coll = db.collection('users');
        // Task 5: find user credentials in database
        // Task 6: update user credentials in database
        const user = await coll.findOneAndUpdate(
            { email: req.body.email },
            { $set: {
                firstName: req.body.name,
                updatedAt: new Date(),
            }},
            {returnDocument: ReturnDocument.AFTER}
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Task 7: create JWT authentication using secret key from .env file
        const authtoken = jwt.sign({"id": user._id}, JWT_SECRET, {"expiresIn": "1h"});
        res.json({authtoken});
    } catch (e) {
        return res.status(500).send('Internal server error');

    }
});

module.exports = router;