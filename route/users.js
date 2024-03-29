const router= require("express").Router();
const client = require("../dbConnection");
const User = require("../models/User");
const jwtTokenGenerator = require("../utils/jwtTokenGenerator");
const bcrypt = require("bcrypt");

router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = new User({ userName, email, password });
        await user.validate();
        // console.log(user)
        if(await user.save()) {
            res.status(201).json({message: "user registered successfully"});
        }
        else {
            res.status(409).json({ error: "User already exists" });
        }
    }
    catch(e) {
        console.error(e.message);
        if (e.message === "User already exist") {
            res.status(409).json(e.message);
        }
        else if(e.message === "Invalid email format") {
            res.json(e.message);
        }
        else if(e.message === "invalid password") {
            res.json(e.message);
        }
        else {
            res.status(500).json({ error: e.message });
        }
    }
})

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await client.query("SELECT * from users where email = $1", [email]);
        console.log(user);
        if(user.rows.length === 0) {
            return res.status(401).json({message : "user does not exist"});
        }
        const validPassword = bcrypt.compare(password, user.rows[0].password);
        if(!validPassword) {
            return res.status(401).json({message: "username or password is incorrect"});
        }
        const token = jwtTokenGenerator(user.rows[0].user_name, user.rows[0].id);
        res.json({jwtToken : token});
    }
    catch (e) {
        res.send(e.message);
    }
})

module.exports = router;
