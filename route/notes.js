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
        res.status(500).json({ error: "Failed to create note" });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const noteId = req.params.id;
        const notes = new Note({ title, content, userId });
        await notes.validate();
        await notes.updateById(noteId, { title, content });
        res.status(200).json({ message: "Note updated successfully" });
    } 
    catch(e) {
        console.error(e);
        res.status(500).json({ error: "Failed to update note" });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const note = new Note({ userId });
        const fetchedNote = await note.getNoteById(noteId);
        res.status(200).json(fetchedNote);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch note" });
    }
});

module.exports = router;