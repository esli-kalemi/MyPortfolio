// =========================
// SCROLL ANIMATIONS
// =========================

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


// =========================
// OBSERVE ELEMENTS
// =========================

function initializeAnimations() {

    const elements = document.querySelectorAll(
        ".section-heading, " +
        ".about-content, " +
        ".skill-category, " +
        ".project-card, " +
        ".timeline-item, " +
        ".contact-content"
    );


    elements.forEach((element) => {

        element.classList.add("hidden");

        observer.observe(element);

    });

}