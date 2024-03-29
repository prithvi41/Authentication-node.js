const client = require("../dbConnection");
const bcrypt = require("bcrypt");

class User {
    constructor({userName, email, password}) {
        this.userName = userName;
        this.email = email;
        this.password =password;
    }

    async validate() {
        if(!this.userName || this.userName.trim() === "" || !this.email || this.email.trim() === "") {
            throw new Error("email or user name can not be empty");
        }
        if(!this.password || this.password.trim() === "" || this.password.length < 8) {
            throw new Error("invalid password");
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.email)) {
            throw new Error("Invalid email format");
        }
    }
    async userExist() {
        const user = await client.query("SELECT * from users where email = $1 or user_name = $2", [this.email, this.userName]);
        return user.rows.length > 0;
    }

    async save() {
        try {
            await this.validate();
            if(await this.userExist()) {
                throw new Error("User already exist");
            }
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);

            await client.query("INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)", [this.userName, 
            this.email, this.password]);
            return true;

        }
        catch(e) {
            console.error(e.message);
            return false;
        }
    }
}

module.exports = User;