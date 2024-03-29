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
    async save() {
        try {
            await this.validate();
            await client.query("INSERT INTO notes (title, content, userId) VALUES ($1, $2, $3)", [
                this.title, this.content, this.userId
            ]);
            return true;
        }
        catch(e) {
            console.error(e.message);
            return false;
        }
    }
}

module.exports = Note;
