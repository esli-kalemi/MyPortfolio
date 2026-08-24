const components = {
    navbar: "components/navbar.html",
    home: "components/hero.html",
    about: "components/about.html",
    skills: "components/skills.html",
    projects: "components/projects.html",
    education: "components/education.html",
    contact: "components/contact.html",
    footer: "components/footer.html"
};


async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}


async function loadComponents() {

    for (const [id, file] of Object.entries(components)) {
        await loadComponent(id, file);
    }

}

// =========================
// MOBILE NAVIGATION
// =========================

document.addEventListener("click", function (event) {

    const menuToggle = event.target.closest(".menu-toggle");
    const navLink = event.target.closest(".nav-links a");

    const navLinks = document.querySelector(".nav-links");


    // Open / close menu

    if (menuToggle && navLinks) {

        navLinks.classList.toggle("active");

    }


    // Close menu after clicking a link

    if (navLink && navLinks) {

        navLinks.classList.remove("active");

    }

    // =========================
// DARK MODE
// =========================

    const themeToggle = event.target.closest(".theme-toggle");

    if (themeToggle) {

        document.body.classList.toggle("dark-mode");

        const isDarkMode =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "darkMode",
            isDarkMode
        );

        themeToggle.textContent =
            isDarkMode ? "☀️" : "🌙";

    }

});

loadComponents().then(() => {

    initializeAnimations();

    const savedDarkMode =
        localStorage.getItem("darkMode");

    const themeToggle =
        document.querySelector(".theme-toggle");


    if (savedDarkMode === "true") {

        document.body.classList.add("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }

    }

});

// =========================
// CONTACT FORM
// =========================

document.addEventListener("submit", function (event) {

    const form = event.target.closest("#contactForm");

    if (!form) {
        return;
    }

    event.preventDefault();


    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    const formMessage = form.querySelector("#formMessage");


    if (!name || !email || !message) {

            formMessage.textContent =
                "Please fill in all fields.";

            formMessage.className =
                "form-message error";

            return;
        }


        // Validate email

        const emailError =
    form.querySelector("#emailError");

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if (!emailPattern.test(email)) {

    emailError.textContent =
        "Please enter a valid email address.";

    emailError.className =
        "field-error error";

    return;
}


emailError.textContent = "";
emailError.className = "field-error";


    formMessage.textContent =
        `Thank you, ${name}! Your message has been received.`;

    formMessage.className =
        "form-message success";


    form.reset();

});