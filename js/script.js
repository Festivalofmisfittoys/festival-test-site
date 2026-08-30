/* =========================================================
   FOMT COUNTDOWN
   ========================================================= */

const countdown = document.getElementById("countdown");
const revealDate = new Date("September 8, 2026 00:00:00").getTime();

function updateCountdown() {
    if (!countdown) return;

    const now = Date.now();
    const distance = revealDate - now;

    if (distance <= 0) {
        countdown.textContent = "LINEUP REVEALED";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================================
   DOM EVENT LISTENERS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       HAMBURGER NAVIGATION
       ========================================== */

    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {

        navToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("is-open");

            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        /* Close menu after clicking a link */
        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("is-open");
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open navigation");
            });
        });

        /* Close menu when clicking outside */
        document.addEventListener("click", function (event) {
            if (
                !navMenu.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                navMenu.classList.remove("is-open");
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open navigation");
            }
        });
    }


    /* ==========================================
       FOMT ARTIST CARDS + MODAL
       ========================================== */

    const cards = document.querySelectorAll(".artist-card");
    const modal = document.getElementById("artist-modal");
    const modalTitle = document.getElementById("artist-modal-title");
    const modalBio = document.getElementById("artist-modal-bio");
    const closeElements = document.querySelectorAll("[data-close-modal]");
    const learnMoreButtons = document.querySelectorAll(".learn-more-btn");

    cards.forEach(card => {
        card.addEventListener("click", function (e) {
            if (
                e.target.closest(".learn-more-btn") ||
                e.target.closest(".artist-socials")
            ) {
                return;
            }

            if (window.matchMedia("(hover: none)").matches) {
                card.classList.toggle("is-flipped");
            }
        });
    });

    learnMoreButtons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const artistNumber = btn.dataset.artist || "";

            if (!modal) return;

            if (modalTitle) {
                modalTitle.textContent = `ARTIST ${artistNumber}`;
            }

            if (modalBio) {
                modalBio.textContent =
                    "This artist is currently locked away. The official Festival of Misfit Toys lineup will be revealed September 8.";
            }

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        });
    });

    function closeModal() {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    closeElements.forEach(el => {
        el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });


    /* ==========================================
       WEB3FORMS CONTACT FORM
       ========================================== */

    const contactForm = document.getElementById("contact-form");
    const contactResult = document.getElementById("contact-result");
    const contactSubmit = document.getElementById("contact-submit");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (contactSubmit) {
                contactSubmit.disabled = true;
                contactSubmit.textContent = "SENDING...";
            }

            if (contactResult) {
                contactResult.textContent = "";
                contactResult.className = "contact-result";
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    if (contactResult) {
                        contactResult.textContent = "MESSAGE SENT — THANK YOU FOR REACHING OUT!";
                        contactResult.classList.add("success");
                    }

                    contactForm.reset();

                    if (contactSubmit) {
                        contactSubmit.textContent = "MESSAGE SENT";
                        setTimeout(() => {
                            contactSubmit.disabled = false;
                            contactSubmit.textContent = "SEND MESSAGE";
                        }, 4000);
                    }
                } else {
                    if (contactResult) {
                        contactResult.textContent =
                            result.message || "SOMETHING WENT WRONG. PLEASE TRY AGAIN.";
                        contactResult.classList.add("error");
                    }

                    if (contactSubmit) {
                        contactSubmit.disabled = false;
                        contactSubmit.textContent = "SEND MESSAGE";
                    }
                }
            } catch (error) {
                console.error("Web3Forms error:", error);

                if (contactResult) {
                    contactResult.textContent = "UNABLE TO SEND MESSAGE. PLEASE TRY AGAIN.";
                    contactResult.classList.add("error");
                }

                if (contactSubmit) {
                    contactSubmit.disabled = false;
                    contactSubmit.textContent = "SEND MESSAGE";
                }
            }
        });
    }

});

