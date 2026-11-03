
/* =========================================================
   RED KANGAROO - COMPLETE JAVASCRIPT
   Flavor | Can Animation | Sidebar | SLAM | KO | Scroll
========================================================= */

const canImageBaseUrl = new URL("../../images/", document.currentScript.src).href;

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. COMMON ELEMENTS
    ===================================================== */

    const body = document.body;

    const canImage = document.getElementById("canImage");
    const canStage = document.querySelector(".can-stage");
    const arena = document.getElementById("productArena");
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");

    const flavorButtons = document.querySelectorAll(
        ".flavor-btn1, .flavor-btn2, .flavor-btn3, .flavor-btn4, .flavor-btn5, [data-flavor]"
    );

    const productCards = document.querySelectorAll(".product-card");


    /* =====================================================
       2. FLAVOR IMAGE CONFIGURATION
    ===================================================== */

    const flavorImages = {
        original: {
            fv: "Red Kangaroo original fv.png",
            bv: "Red Kangaroo original bv.png"
        },

        mango: {
            fv: "Red Kangaroo mango (FV).png",
            bv: "Red Kangaroo mango (BV).png"
        },

        blue: {
            fv: "Red Kangaroo blue (FV).png",
            bv: "Red Kangaroo blue (BV).png"
        },

        lime: {
            fv: "Red Kangaroo lime (FV).png",
            bv: "Red Kangaroo lime (BV).png"
        },

        zero: {
            fv: "Red Kangaroo zero (FV).png",
            bv: "Red Kangaroo zero (BV).png"
        }
    };

    let currentFlavor = "original";
    let isBackView = false;
    let isChangingImage = false;

    let imageChangeTimer = null;
    let animationTimers = [];


    /* =====================================================
       3. IMAGE PATH HELPER
    ===================================================== */

    function getFlavorImage(flavor, view = "fv") {

        const selectedFlavor = flavorImages[flavor];

        if (!selectedFlavor) {
            return "";
        }

        return canImageBaseUrl + encodeURIComponent(
            selectedFlavor[view]
        ).replace(/%2F/g, "/");
    }


    /* =====================================================
       4. CAN IMAGE UPDATE
    ===================================================== */

    function updateCanImage(flavor, view = "fv") {

        if (!canImage) return;

        const newImage = getFlavorImage(flavor, view);

        if (!newImage) return;

        canImage.style.opacity = "0";

        clearTimeout(imageChangeTimer);

        imageChangeTimer = setTimeout(function () {

            canImage.src = newImage;

            canImage.onload = function () {
                canImage.style.opacity = "1";
            };

            canImage.onerror = function () {
                canImage.style.opacity = "1";
                console.error("Can image not found:", newImage);
            };

        }, 180);
    }


    /* =====================================================
       5. FLAVOR SWITCHING
    ===================================================== */

    function setFlavor(flavor, selectedButton) {

        if (!flavorImages[flavor]) return;

        currentFlavor = flavor;
        isBackView = false;

        // Clear previous animation
        clearTimeout(imageChangeTimer);

        // Active button
        flavorButtons.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.flavor === flavor
            );

        });

        // Product cards
        productCards.forEach(function (card) {

            const isSelected = card.dataset.flavor === flavor;

            card.classList.toggle("active", isSelected);

            card.style.display = isSelected ? "block" : "none";

        });

        // Arena background
        if (arena) {

            arena.classList.remove(
                "arena-original",
                "arena-crimson",
                "arena-black",
                "arena-mango",
                "arena-blue",
                "arena-lime",
                "arena-zero"
            );

            arena.classList.add("arena-" + flavor);
            arena.classList.add("hit");

            setTimeout(function () {
                arena.classList.remove("hit");
            }, 350);
        }

        // Can flip animation
        if (canImage) {

            canImage.classList.remove("hit");
            canImage.classList.add("rotate");

            setTimeout(function () {

                updateCanImage(flavor, "fv");

                canImage.classList.remove("rotate");
                canImage.classList.add("hit");

            }, 220);
        }

        console.log("Selected flavor:", flavor);
    }


    // Flavor button click
    flavorButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const flavor = this.dataset.flavor;

            if (flavor) {
                setFlavor(flavor, this);
            }

        });

    });


    // Set default flavor
    if (canImage && flavorImages.original) {
        updateCanImage("original", "fv");
    }

    if (flavorButtons.length) {

        const defaultButton = Array.from(flavorButtons).find(
            button => button.dataset.flavor === "original"
        );

        if (defaultButton) {
            defaultButton.classList.add("active");
        }
    }


    /* =====================================================
       6. CAN FRONT / BACK VIEW
    ===================================================== */

    function changeCanView(view) {

        if (!canImage || isChangingImage) return;

        if (view === "bv" && isBackView) return;
        if (view === "fv" && !isBackView) return;

        const newImage = getFlavorImage(currentFlavor, view);

        if (!newImage) return;

        isChangingImage = true;

        canImage.style.opacity = "0";

        clearTimeout(imageChangeTimer);

        imageChangeTimer = setTimeout(function () {

            canImage.src = newImage;

            canImage.onload = function () {

                canImage.style.opacity = "1";

                isBackView = view === "bv";
                isChangingImage = false;

            };

            canImage.onerror = function () {

                canImage.style.opacity = "1";
                isChangingImage = false;

                console.error("Image loading failed:", newImage);
            };

        }, 250);
    }


    // Hover to show back view
    if (canImage) {

        canImage.addEventListener("mouseenter", function () {
            changeCanView("bv");
        });

        canImage.addEventListener("mouseleave", function () {
            changeCanView("fv");
        });

    }


    /* =====================================================
       7. MOUSE TILT AND HOVER ZOOM
    ===================================================== */

    let mouseRotateX = 0;
    let mouseRotateY = 0;
    let scrollScale = 1;
    let scrollTranslateY = 0;

    function updateCanTransform() {

        if (!canImage) return;

        const isHovering = canStage &&
            canStage.classList.contains("hover-zoom");

        const hoverScale = isHovering ? 1.10 : 1;

        const finalScale = scrollScale * hoverScale;

        canImage.style.transform =
            `perspective(1000px)
            rotateX(${mouseRotateX}deg)
            rotateY(${mouseRotateY}deg)
            scale(${finalScale})
            translateY(${scrollTranslateY}px)`;
    }


    if (canStage && canImage) {

        canStage.addEventListener("mouseenter", function () {

            canStage.classList.add("hover-zoom");

            updateCanTransform();

        });

        canStage.addEventListener("mouseleave", function () {

            canStage.classList.remove("hover-zoom");

            mouseRotateX = 0;
            mouseRotateY = 0;

            updateCanTransform();

        });

        canStage.addEventListener("mousemove", function (event) {

            const rect = canStage.getBoundingClientRect();

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            if (!centerX || !centerY) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            mouseRotateX =
                ((y - centerY) / centerY) * -10;

            mouseRotateY =
                ((x - centerX) / centerX) * 10;

            updateCanTransform();

        });

    }


    /* =====================================================
       8. PUNCH REVEAL ANIMATION
    ===================================================== */

    const punchElements = document.querySelectorAll(
        ".punch-text, .punch-impact"
    );

    if ("IntersectionObserver" in window) {

        const punchObserver = new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                        punchObserver.unobserve(entry.target);
                    }

                });

            },

            {
                threshold: 0.4
            }

        );

        punchElements.forEach(function (element) {
            punchObserver.observe(element);
        });

    } else {

        punchElements.forEach(function (element) {
            element.classList.add("active");
        });

    }


    /* =====================================================
       9. SLAM OVERLAY ON SCROLL
    ===================================================== */

    const slamOverlay = document.getElementById("slamOverlay");

    let lastSlamTime = 0;

    const SLAM_COOLDOWN = 1200;

    function showSlam() {

        if (!slamOverlay) return;

        const now = Date.now();

        if (now - lastSlamTime < SLAM_COOLDOWN) return;

        lastSlamTime = now;

        slamOverlay.classList.remove("active");

        // Restart animation
        void slamOverlay.offsetWidth;

        slamOverlay.classList.add("active");

        setTimeout(function () {
            slamOverlay.classList.remove("active");
        }, 700);

    }


    let slamScrollFrame = false;

    window.addEventListener("scroll", function () {

        if (slamScrollFrame) return;

        slamScrollFrame = true;

        requestAnimationFrame(function () {

            const trigger =
                document.body.scrollHeight * 0.75;

            const currentPosition =
                window.scrollY + window.innerHeight;

            if (currentPosition > trigger) {
                showSlam();
            }

            slamScrollFrame = false;

        });

    }, { passive: true });


    /* =====================================================
       10. CTA - KO OVERLAY
    ===================================================== */

    const ctaButtons = document.querySelectorAll(".cta");

    const koOverlay = document.getElementById("koOverlay");

    if (koOverlay) {

        const koHit = koOverlay.querySelector(".ko-hit");
        const koLine = koOverlay.querySelector(".ko-line");

        ctaButtons.forEach(function (cta) {

            cta.addEventListener("click", function () {

                koOverlay.classList.remove("active");

                body.classList.remove("ko-shake");

                if (koHit) koHit.style.animation = "";
                if (koLine) koLine.style.animation = "";

                // Restart animation
                void koOverlay.offsetWidth;

                koOverlay.classList.add("active");
                body.classList.add("ko-shake");

                setTimeout(function () {

                    if (koLine) {
                        koLine.style.animation =
                            "koLine .3s forwards";
                    }

                }, 120);

                setTimeout(function () {

                    if (koHit) {
                        koHit.style.animation =
                            "koHit .5s cubic-bezier(.1,.9,.2,1) forwards";
                    }

                }, 180);

                setTimeout(function () {

                    koOverlay.classList.remove("active");

                    body.classList.remove("ko-shake");

                    if (koHit) koHit.style.animation = "";
                    if (koLine) koLine.style.animation = "";

                }, 900);

            });

        });

    }


    /* =====================================================
       11. HAMBURGER / SIDEBAR
    ===================================================== */

    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("closeBtn");


    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        sidebar.setAttribute("aria-hidden", "false");

        if (hamburger) {

            hamburger.style.display = "none";

            hamburger.setAttribute("aria-hidden", "true");

        }

        body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        sidebar.setAttribute("aria-hidden", "true");

        if (hamburger) {

            hamburger.style.display = "";

            hamburger.setAttribute("aria-hidden", "false");

        }

        body.classList.remove("sidebar-open");
    }


    // Open menu
    if (hamburger && sidebar) {

        hamburger.addEventListener("click", function (event) {

            event.stopPropagation();

            openSidebar();

        });

    }


    // Close menu button
    if (closeBtn) {

        closeBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            closeSidebar();

        });

    }


    // Close on outside click
    document.addEventListener("click", function (event) {

        if (!sidebar || !sidebar.classList.contains("open")) {
            return;
        }

        if (
            !sidebar.contains(event.target) &&
            event.target !== hamburger &&
            !hamburger?.contains(event.target)
        ) {

            closeSidebar();

        }

    });


    // Close on Escape
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });


    // Close menu after clicking a navigation link
    if (sidebar) {

        sidebar.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                closeSidebar();
            });

        });

    }


    /* =====================================================
       12. SCROLL-BASED CAN POWER AND ARENA ENERGY
    ===================================================== */

    function updateScrollEffects() {

        const viewportHeight = window.innerHeight;

        // Can scroll animation
        if (canStage && canImage) {

            const rect = canStage.getBoundingClientRect();

            if (
                rect.top < viewportHeight &&
                rect.bottom > 0
            ) {

                const progress =
                    1 - Math.abs(
                        rect.top - viewportHeight / 2
                    ) / (viewportHeight / 2);

                const power = Math.max(
                    0,
                    Math.min(progress, 1)
                );

                scrollScale = 1 + power * 0.15;

                scrollTranslateY = power * 10;

                const glow = power * 15;

                canImage.style.filter =
                    `drop-shadow(0 0 ${glow}px rgba(255,0,0,0.6))`;

            } else {

                scrollScale = 1;
                scrollTranslateY = 0;

                canImage.style.filter = "none";

            }

            updateCanTransform();
        }


        // Arena energy
        if (arena) {

            const rect = arena.getBoundingClientRect();

            if (
                rect.top < viewportHeight &&
                rect.bottom > 0
            ) {

                const progress =
                    1 - Math.abs(
                        rect.top - viewportHeight / 2
                    ) / (viewportHeight / 2);

                const power = Math.max(
                    0,
                    Math.min(progress, 1)
                );

                arena.style.setProperty(
                    "--energy",
                    power * 0.45
                );

                arena.style.backgroundPosition =
                    `${50 + power * 2}% ${50 - power * 2}%`;

            }

        }

    }


    let scrollFrame = false;

    window.addEventListener("scroll", function () {

        if (scrollFrame) return;

        scrollFrame = true;

        requestAnimationFrame(function () {

            updateScrollEffects();

            scrollFrame = false;

        });

    }, { passive: true });


    // Initial scroll calculation
    updateScrollEffects();


    /* =====================================================
       13. VIDEO UNMUTE BUTTON
    ===================================================== */

    const unmuteButtons = document.querySelectorAll(".video-unmute-btn");

    unmuteButtons.forEach(function (button) {
        const videoWrap = button.closest(".athlete-video-wrap");
        const video = videoWrap ? videoWrap.querySelector("video") : null;

        if (!video) return;

        function updateButtonLabel() {
            button.textContent = video.muted ? "Unmute" : "Mute";
        }

        updateButtonLabel();

        button.addEventListener("click", function () {
            video.muted = !video.muted;

            if (!video.muted) {
                video.volume = 0.8;
                video.play().catch(function () {});
            }

            updateButtonLabel();
        });

    });

    if (contactForm && formSuccess) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
            contactForm.reset();
        });
    }


    /* =====================================================
       14. INITIAL SIDEBAR STATE
    ===================================================== */

    if (sidebar) {
        sidebar.setAttribute("aria-hidden", "true");
    }

    if (hamburger) {
        hamburger.setAttribute("aria-hidden", "false");
    }


    /* =====================================================
       15. CLEANUP ON PAGE EXIT
    ===================================================== */

    window.addEventListener("pagehide", function () {

        clearTimeout(imageChangeTimer);

        animationTimers.forEach(function (timer) {
            clearTimeout(timer);
        });

    });


    console.log("Red Kangaroo JavaScript initialized successfully.");

});
