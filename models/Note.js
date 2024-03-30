const client = require("../dbConnection");

class Note {
    constructor({title, content, userId}) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
    async validate() {
        if(!this.content || this.content.trim() === "") {
            throw new Error("Content required");
        }
    }
    // craete new note
    async save() {
        try {
            await this.validate();
            const currentTimestamp = new Date();
            await client.query("INSERT INTO notes (title, content, userId, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)", [
                this.title, this.content, this.userId, currentTimestamp, currentTimestamp
            ]);
            return true;
        }
        catch(e) {
            console.error(e.message);
            throw new Error("Failed to save note");
        }
    }
    // update existing note by id
    async updateById(id, newData) {
        try {
            const existingNote = await client.query("SELECT * FROM notes WHERE id = $1 AND user_id = $2", [id, this.userId]);
            if (existingNote .rows.length === 0) {
                throw new Error("Note not found or user unauthorized to update");
            }
            const updateFields = [];
            const values = [id, this.userId];
            let paramIndex = 3; 
            if (newData.title) {
                updateFields.push(`title = $${paramIndex}`);
                values.push(newData.title);
                paramIndex++;
            }
            if (newData.content) {
                updateFields.push(`content = $${paramIndex}`);
                values.push(newData.content);
                paramIndex++;
            }
            const currentTimestamp = new Date();
            updateFields.push(`updated_at = $${paramIndex}`);
            values.push(currentTimestamp);
    
            const updateQuery = `UPDATE notes SET ${updateFields.join(', ')} WHERE id = $1 AND user_id = $2`;
            await client.query(updateQuery, values);
            
            return true;
        } 
        catch(e) {
            console.error(e.message);
            throw new Error("Failed to update note");
        }
    }
    // get a note by id 
    async getNoteById(id) {
        try {
            const existingNote = await client.query("SELECT * FROM notes WHERE id = $1 AND user_id = $2", [id, this.userId]);
            if (existingNote.rows.length === 0) {
                throw new Error("Note not found");
            }
            const { title, content } = existingNote.rows[0];
            return { id, title, content };
        }
        catch(e) {
        console.error(e);
        throw new Error("Failed to fetch note");
        }
    }
}

module.exports = Note;
