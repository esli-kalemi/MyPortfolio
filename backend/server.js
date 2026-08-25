const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 3000;


// Middleware

app.use(cors());

app.use(express.json());


// Test route

app.get("/", (req, res) => {
    res.json({
        message: "Portfolio backend is running!"
    });
});


// Start server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});