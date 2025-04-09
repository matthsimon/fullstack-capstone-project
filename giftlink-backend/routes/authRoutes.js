//Step 1 - Task 2: Import necessary packages
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pino = require('pino');
const connectToDatabase = require('../models/db');

//Step 1 - Task 3: Create a Pino logger instance
const logger = Pino()

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const coll = db.collection("users");

        //Task 3: Check for existing email
        const email = req.body.email;
        if (!await coll.findOne({"email": email})) {
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

router.post('/login', async (req, res) => {
    try {
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
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        if (hash !== user.password) {
            logger.info("Password does not match");
            return res.status(401).send("Password does not match");
        }

        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const authtoken = jwt.sign({"id": result.insertedId}, JWT_SECRET, {"expiresIn": "1h"});
        res.json({
            authtoken,
            'firstName': user.firstName,
            'email': user.email
        });
    } catch (e) {
         return res.status(500).send('Internal server error');

    }
});

module.exports = router;