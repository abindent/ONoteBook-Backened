const express = require('express')
const router = express.Router();
var fetchUser = require("../middleware/fetchUser")
const Notes = require("../models/Notes")
const { body, validationResult } = require("express-validator")

// ROUTE 1 : FETCHING NOTES AND ITS DETAILS USING GET REQUEST WITH : api/auth/user - Login Required
router.get("/notes", fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        return res.status(500).send("Internal Server Error or Runtime Error")
    }

})

// ROUTE 2 : ADDING NEW NOTES WITH POST REQUEST WITH : /api/notes/add - Login Required
router.post("/add", fetchUser, [
    body('title', "Title length must be atleast 3 characters.").isLength({ min: 3 }),
    body('description', "Descriotion must be atleast 5 characters.").isLength({ min: 5 })
], async (req, res) => {
    try {
        // Destructuring to get the parameters
        const { title, description, tag } = req.body;
        // If errors return bad request with errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // Creating Notes
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const addNote = await note.save()
        res.json(addNote)
    } catch (error) {
        return res.status(500).send("Internal Server Error or Runtime Error")
    }
})

// ROUTE 3 : UPDATING EXISTING NOTES WITH PUT REQUEST WITH : /api/notes/update - Login Required
router.put("/update/:id", fetchUser, async (req, res) => {
    try {

        // Destructuring to get the parameters
        const { title, description, tag } = req.body;

        // Creating a newNote object
        const newNote = {}
        // Updating note
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(400).send("Note not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

        res.json({ note })
    } catch (error) {
        console.log(error.messages)
        return res.status(500).send("Internal Server Error or Runtime Error")
    }
})

// ROUTE 4 : DELETING EXISTING NOTES WITH DELETE REQUEST WITH : /api/notes/delete - Login Required
router.delete("/delete/:id", fetchUser, async (req, res) => {
    try {

        // Destructuring to get the parameters
        const { title, description, tag } = req.body;

        // Creating a newNote object
        const newNote = {}
        // Updating note
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(400).send("Note not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)

        res.json({ "Success": "Deleted Successfully", note: note })
    } catch (error) {
        return res.status(500).send("Internal Server Error or Runtime Error")
    }
})

module.exports = router