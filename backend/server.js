const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);


// =========================
// SECURITY MIDDLEWARE
// =========================

// Security headers
app.use(helmet());


// Only allow requests from your portfolio
app.use(cors({
    origin: "https://esli-kalemi.github.io"
}));


// Limit the size of incoming JSON requests
app.use(express.json({
    limit: "10kb"
}));


// Rate limit contact form requests
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // maximum 5 requests per IP
    message: {
        error: "Too many contact requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "Portfolio backend is running!"
    });
});


// =========================
// CONTACT FORM
// =========================

app.post(
    "/api/contact",
    contactLimiter,
    async (req, res) => {

        const { name, email, message } = req.body;


        // Validate required fields

        if (!name || !email || !message) {
            return res.status(400).json({
                error: "Name, email and message are required."
            });
        }


        // Validate data types

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                error: "Invalid form data."
            });
        }


        // Remove unnecessary whitespace

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanMessage = message.trim();


        // Validate that fields aren't empty

        if (!cleanName || !cleanEmail || !cleanMessage) {
            return res.status(400).json({
                error: "Name, email and message cannot be empty."
            });
        }


        // Validate email

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                error: "Please provide a valid email address."
            });
        }


        // Limit field lengths

        if (cleanName.length > 100) {
            return res.status(400).json({
                error: "Name is too long."
            });
        }

        if (cleanEmail.length > 254) {
            return res.status(400).json({
                error: "Email address is too long."
            });
        }

        if (cleanMessage.length > 5000) {
            return res.status(400).json({
                error: "Message is too long."
            });
        }


        try {

            const { data, error } =
                await resend.emails.send({

                    from: "Portfolio <onboarding@resend.dev>",

                    to: ["eslikalemi@yahoo.com"],

                    subject:
                        `Portfolio contact from ${cleanName}`,

                    replyTo: cleanEmail,

                    text: `
Name: ${cleanName}
Email: ${cleanEmail}

Message:
${cleanMessage}
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
    }
);


// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );
});