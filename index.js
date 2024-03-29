const express = require("express");
const app = express();

app.use(express.json());

app.use('/users', require("./route/users"));
app.use('/notes', require("./route/notes"));

app.listen(3000, () => {
    console.log("server running on port 3000");
})