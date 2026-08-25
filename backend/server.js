const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Resend } = require("resend");

const app = express();

const PORT =  process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);


// Middleware

app.use(cors());

app.use(express.json());


// Test route

app.get("/", (req, res) => {
    res.json({
        message: "Portfolio backend is running!"
    });
});


// Contact form route

app.post("/api/contact", async (req, res) => {

    const { name, email, message } = req.body;

    // Validate required fields

    if (!name || !email || !message) {
        return res.status(400).json({
            error: "Name, email and message are required."
        });
    }


    try {

        const { data, error } = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["eslikalemi@yahoo.com"],
            subject: `Portfolio contact from ${name}`,
            replyTo: email,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `
        });


        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to send email."
            });
        }


        res.status(200).json({
            message: "Email sent successfully!",
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong."
        });
    }
});


// Start server

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});