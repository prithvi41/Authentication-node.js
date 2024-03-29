const router= require("express").Router();
const client = require("../dbConnection");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticate");
const Note = require("../models/Note");

router.post('/new', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const {title, content} = req.body;
        const notes = new Note({ title, content, userId  });
        await notes.validate();
        await notes.save();
        res.status(201).json({ message: "Note created successfully" });
    }
    catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

module.exports = router;