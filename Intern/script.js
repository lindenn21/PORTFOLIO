/*=========================================
        PORTFOLIO SCRIPT — Monochrome & Interactions
        Linden Powell Rivera
=========================================*/

/* =========================================
   MULTILINGUAL LOADING SCREEN
   Types "POWELL" in 6 languages/scripts,
   then fades out to reveal the site.
========================================= */
(function () {
    const LANGUAGES = [
        { lang: "ENGLISH", word: "TRACE ON" },
        { lang: "JAPANESE", word: "トレース・オン" },
        { lang: "KOREAN", word: "트레이스 온" },
        { lang: "ARABIC", word: "تريس أون" },
        { lang: "RUSSIAN", word: "ТРЕЙС ОН" },
        { lang: "CHINESE", word: "描迹开始" },
        { lang: "ENGLISH", word: "TRACE ON" },
    ];

    const CHAR_DELAY = 10;   // ms per character typed
    const HOLD_DELAY = 170;  // ms word stays visible before erasing
    const ERASE_DELAY = 8;   // ms per character erased
    const BETWEEN_DELAY = 20;   // ms between entries

    const loaderEl = document.getElementById("site-loader");
    const typedEl = document.getElementById("loaderTyped");
    const langEl = document.getElementById("loaderLang");
    const barEl = document.getElementById("loaderBar");

    if (!loaderEl) return;

    // Block page scroll while loader is showing
    document.body.style.overflow = "hidden";

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeWord(word) {
        typedEl.textContent = "";
        for (const char of word) {
            typedEl.textContent += char;
            await sleep(CHAR_DELAY);
        }
    }

    async function eraseWord() {
        while (typedEl.textContent.length > 0) {
            typedEl.textContent = typedEl.textContent.slice(0, -1);
            await sleep(ERASE_DELAY);
        }
    }

    async function runLoader() {
        const totalDuration = LANGUAGES.length * (
            LANGUAGES[0].word.length * CHAR_DELAY +
            HOLD_DELAY +
            LANGUAGES[0].word.length * ERASE_DELAY +
            BETWEEN_DELAY
        );

        // Animate the progress bar
        barEl.style.transition = `width ${totalDuration}ms linear`;
        barEl.style.width = "100%";

        for (let i = 0; i < LANGUAGES.length; i++) {
            const { lang, word } = LANGUAGES[i];
            langEl.textContent = lang;
            await typeWord(word);
            await sleep(HOLD_DELAY);

            // On the last word, don't erase — just fade out
            if (i < LANGUAGES.length - 1) {
                await eraseWord();
                await sleep(BETWEEN_DELAY);
            }
        }

        // Fade out loader
        loaderEl.classList.add("fade-out");
        document.body.style.overflow = "";

        // Remove from DOM after transition
        loaderEl.addEventListener("transitionend", () => {
            loaderEl.remove();
        }, { once: true });
    }

    runLoader();
})();

async function includeHTML(id, file) {
    const element = document.getElementById(id);
    if (!element) return;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Cannot load ${file}`);
        element.innerHTML = await response.text();
    } catch (err) {
        console.error(err);
    }
}

async function loadPortfolio() {
    await includeHTML("nav-include", "nav.html");
    await includeHTML("hero-include", "hero.html");
    await includeHTML("about-include", "about.html");
    await includeHTML("experience-include", "experience.html");
    await includeHTML("resume-include", "resume.html");
    await includeHTML("works-include", "work.html");
    await includeHTML("contact-include", "contact.html");

    initializePortfolio();
}

document.addEventListener("DOMContentLoaded", loadPortfolio);

function initializePortfolio() {
    initThemeToggle();
    mobileNavigation();
    navbarScrollState();
    activeNavigation();
    revealAnimation();
    heroTypewriter();
    aboutTypewriterScrollDriven();
    experienceCarousel();
    stackPillPicker();
    educationCarousel();
    projectCarousel();
    smoothScrolling();
}

/*=====================================================
            THEME TOGGLE SYSTEM
=====================================================*/

function getSavedOrSystemTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
    }
    return "dark";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update active class on toggle options
    const toggleOptions = document.querySelectorAll(".theme-toggle__option");
    toggleOptions.forEach(btn => {
        if (btn.dataset.themeVal === theme) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function initThemeToggle() {
    const currentTheme = getSavedOrSystemTheme();
    applyTheme(currentTheme);

    const toggles = document.querySelectorAll(".theme-toggle");
    toggles.forEach(toggleEl => {
        toggleEl.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme") || "dark";
            const nextTheme = current === "dark" ? "light" : "dark";
            localStorage.setItem("portfolio-theme", nextTheme);
            applyTheme(nextTheme);
        });
    });

    // Listen for system theme changes if no local storage preference is set
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => {
            if (!localStorage.getItem("portfolio-theme")) {
                applyTheme(e.matches ? "light" : "dark");
            }
        });
    }
}

/*=====================================================
                NAVBAR — HIDE ON HERO
=====================================================*/

function navbarScrollState() {
    const navbar = document.getElementById("floatingNav");
    const hero = document.getElementById("hero");
    if (!navbar || !hero) return;

    function updateNavbar() {
        const heroBottom = hero.offsetHeight - 100;
        if (window.scrollY > heroBottom) {
            navbar.classList.add("show");
        } else {
            navbar.classList.remove("show");
        }
    }

    updateNavbar();
    window.addEventListener("scroll", updateNavbar);
}

function mobileNavigation() {
    const button = document.getElementById("navToggler");
    const menu = document.getElementById("mobileMenu");
    if (!button || !menu) return;

    button.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

function activeNavigation() {
    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll(".nav-link");
    if (!sections.length) return;

    function updateLinks() {
        let current = "";
        sections.forEach(section => {
            const top = section.offsetTop - 180;
            const height = section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                current = section.id;
            }
        });

        links.forEach(link => {
            link.classList.remove("active");
            if (link.dataset.target === current) {
                link.classList.add("active");
            }
        });
    }

    updateLinks();
    window.addEventListener("scroll", updateLinks);
}

/*=====================================================
                REVEAL
=====================================================*/

function revealAnimation() {
    const elements = document.querySelectorAll("[data-animate]");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: .15 });

    elements.forEach(el => observer.observe(el));
}

/*=====================================================
            HERO TYPEWRITER
=====================================================*/

function heroTypewriter() {
    const target = document.getElementById("heroTyped");
    if (!target) return;

    const phrases = ["Loeee! I'm Linden.", "Hardware & Software student", "Doing side quests..", "GRAHHH!!!"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 60;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/*=====================================================*
 * ABOUT TYPEWRITER — SCROLL CONTROLLED
 *
 * DOWN = TYPE
 * UP   = DELETE
 *
 * Does NOT start typing until the intro
 * actually enters the viewport.
 *=====================================================*/
function aboutTypewriterScrollDriven() {

    const target =
        document.getElementById("introTypewriter");

    const container =
        document.getElementById("aboutIntroBlock");

    if (!target || !container) return;

    const fullText =
        "Linden Powell Rivera is a Computer Engineering student at the Polytechnic University of the Philippines – Sta. Mesa, with a growing focus on networking, hardware, and web development. He has hands-on experience in cabling, troubleshooting, and software projects while continuing to develop his technical skills.";

    // 1.0 = normal
    // 1.25 = 25% slower
    // 1.5 = 50% slower
    const typewriterSpeed = 1.25;

    let ticking = false;


    /*=================================================
     * STAGE HEIGHT
     *=================================================*/

    function updateStageHeight() {

        const vh = window.innerHeight;
        const isMobile = window.innerWidth <= 600;

        let distance;

        if (isMobile) {

            distance = vh * 0.2;

        } else {

            distance = vh * 0.40;
        }

        distance *= typewriterSpeed;

        /*
         * Enough room to type the entire text.
         */
        container.style.minHeight =
            `${vh + distance}px`;
    }


    /*=================================================
     * TYPEWRITER
     *=================================================*/

    function updateTypewriter() {

        const rect =
            container.getBoundingClientRect();

        const vh =
            window.innerHeight;

        const isMobile =
            window.innerWidth <= 600;


        /*---------------------------------------------
         * HOW FAR THE USER MUST SCROLL
         *---------------------------------------------*/

        let distance;

        if (isMobile) {

            distance =
                vh * 0.2;

        } else {

            distance =
                vh * 0.40;
        }

        distance *= typewriterSpeed;


        /*---------------------------------------------
         * START POINT
         *---------------------------------------------*/

        /*
         * The typewriter starts when the ABOUT
         * INTRO reaches this point on screen.
         *
         * 0.85 = 85% down the viewport.
         *
         * This means the intro is actually
         * visible before typing begins.
         */

        const startPoint =
            vh * 0.25;


        /*---------------------------------------------
         * SCROLL PROGRESS
         *---------------------------------------------*/

        let progress =
            (startPoint - rect.top) /
            distance;


        /*
         * Clamp between:
         *
         * 0 = completely invisible
         * 1 = completely typed
         */

        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /*---------------------------------------------
         * CHARACTER COUNT
         *---------------------------------------------*/

        const charCount =
            Math.floor(
                progress *
                fullText.length
            );


        /*---------------------------------------------
         * DISPLAY
         *---------------------------------------------*/

        target.textContent =
            fullText.substring(
                0,
                charCount
            );


        ticking = false;
    }


    /*=================================================
     * SCROLL
     *=================================================*/

    function handleScroll() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
            updateTypewriter
        );
    }


    /*=================================================
     * RESIZE
     *=================================================*/

    function handleResize() {

        updateStageHeight();
        updateTypewriter();
    }


    /*=================================================
     * INITIALIZE
     *=================================================*/

    updateStageHeight();
    updateTypewriter();


    /*=================================================
     * EVENTS
     *=================================================*/

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        handleResize
    );
}

/*=====================================================
            EXPERIENCE PILL PICKER
=====================================================*/

const expData = [
    {
        title: "World Citi Colleges",
        roleDate: "Software & Technical Intern · 2026",
        logo: "images/worldciti.png",
        bullets: [
            "Assisted with networking, troubleshooting, and guided web development for school and hospital operations.",
            "Hands-on technical support, cabling, and maintaining system functionality in an active environment (Hospital and School).",
            "Collaborated on software tools for operational efficiency."
        ],
        stack: ["Linux", "Networking", "Troubleshooting", "Installation", "Management", "PHP", "Tailwind", "JS", "HTML"]
    },
    {
        title: "Polytechnic University of the Philippines",
        roleDate: "BS Computer Engineering Student · 2024 — Present",
        logo: "images/pup.png",
        bullets: [
            "Developing software and hardware solutions through hands-on academic projects.",
            "Built Operating Systems simulator, train route finding graph algorithms, and DSA visualizers.",
            "Exploring embedded systems, routing algorithms, data structures, and full-stack web integration."
        ],
        stack: ["Python", "Flask", "JavaScript", "Data Structures", "Git", "HTML"]
    }
];

function experienceCarousel() {
    const prevBtn = document.getElementById("expPrev");
    const nextBtn = document.getElementById("expNext");
    const counterEl = document.getElementById("expCounter");
    const card = document.querySelector(".exp-main-card");

    const titleEl = document.getElementById("expTitle");
    const roleDateEl = document.getElementById("expRoleDate");
    const logoImgEl = document.getElementById("expLogoImg");
    const bulletsEl = document.getElementById("expBullets");
    const stackEl = document.getElementById("expStackPills");

    if (!prevBtn || !nextBtn || !card || !titleEl) return;

    let currentIndex = 0;
    let isAnimating = false;

    function renderExp(idx, direction = 0) {
        const data = expData[idx];
        if (!data) return;

        titleEl.textContent = data.title;
        roleDateEl.textContent = data.roleDate;
        logoImgEl.src = data.logo;
        logoImgEl.alt = `${data.title} logo`;
        bulletsEl.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join("");
        stackEl.innerHTML = data.stack.map(s => `<span>${s}</span>`).join("");
        counterEl.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(expData.length).padStart(2, "0")}`;

        card.classList.remove("slide-next", "slide-prev");

        if (direction !== 0) {
            void card.offsetWidth;
            card.classList.add(direction > 0 ? "slide-next" : "slide-prev");

            setTimeout(() => {
                card.classList.remove("slide-next", "slide-prev");
                isAnimating = false;
            }, 380);
        } else {
            isAnimating = false;
        }
    }

    function changeExp(direction) {
        if (isAnimating || expData.length < 2) return;

        isAnimating = true;
        currentIndex = (currentIndex + direction + expData.length) % expData.length;
        renderExp(currentIndex, direction);
    }

    prevBtn.addEventListener("click", () => changeExp(-1));
    nextBtn.addEventListener("click", () => changeExp(1));

    renderExp(0);
}

/*=====================================================
            TECH / HARDWARE STACK PILL PICKER
=====================================================*/

function stackPillPicker() {

    const pillBtns = document.querySelectorAll(".stack-pill-btn");
    const tabContents = document.querySelectorAll(".stack-tab-content");

    if (!pillBtns.length || !tabContents.length) return;

    pillBtns.forEach(btn => {

        btn.addEventListener("click", () => {

            const target = btn.dataset.stackTab;

            pillBtns.forEach(pill => {
                pill.classList.toggle("active", pill === btn);
            });

            tabContents.forEach(content => {
                content.classList.toggle(
                    "active",
                    content.id === `${target}StackContent`
                );
            });

        });

    });

}

/*=====================================================
            EDUCATION PILL PICKER
=====================================================*/

const eduData = [
    {
        title: "Polytechnic University of the Philippines",
        degreeDate: "BS Computer Engineering · 2024 — Present",
        logo: "images/pup.png",
        // bullets: [
        //     "Developing core competencies in Computer Engineering, bridging hardware systems and software development.",
        //     "Built practical projects involving Operating Systems simulation, Data Structures & Algorithms, and Metro Train graph routing.",
        //     "Hands-on experience in logic design, embedded computing, network configurations, and full-stack web integration."
        // ],
        // stack: ["Operating Systems", "Data Structures", "Networking", "Python", "Flask", "Web Dev"]
    },
    {
        title: "Our Lady of Fatima University",
        degreeDate: "Senior High School – STEM · Completed",
        logo: "images/edu2.jpg",
        // bullets: [
        //     "Academic track focusing on Science, Technology, Engineering, and Mathematics (STEM).",
        //     "Developed strong foundations in mathematics, physical sciences, logic, and introductory programming concepts.",
        //     "Participated in STEM research projects, problem-solving, and team collaborations."
        // ],
        // stack: ["STEM", "Mathematics", "Physics", "Research", "Logic"]
    }
];

function educationCarousel() {
    const prevBtn = document.getElementById("eduPrev");
    const nextBtn = document.getElementById("eduNext");
    const counterEl = document.getElementById("eduCounter");
    const card = document.querySelector(".edu-main-card");

    const titleEl = document.getElementById("eduTitle");
    const degreeDateEl = document.getElementById("eduDegreeDate");
    const logoImgEl = document.getElementById("eduLogoImg");
    const bulletsEl = document.getElementById("eduBullets");
    const stackEl = document.getElementById("eduStackPills");

    if (!prevBtn || !nextBtn || !card || !titleEl) return;

    let currentIndex = 0;
    let isAnimating = false;

    function renderEdu(idx, direction = 0) {
        const data = eduData[idx];
        if (!data) return;

        titleEl.textContent = data.title;
        degreeDateEl.textContent = data.degreeDate;
        logoImgEl.src = data.logo;
        logoImgEl.alt = `${data.title} logo`;
        bulletsEl.innerHTML = (data.bullets || [])
            .map(b => `<li>${b}</li>`)
            .join("");

        stackEl.innerHTML = (data.stack || [])
            .map(s => `<span>${s}</span>`)
            .join("");
        counterEl.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(eduData.length).padStart(2, "0")}`;

        card.classList.remove("slide-next", "slide-prev");

        if (direction !== 0) {
            void card.offsetWidth;
            card.classList.add(direction > 0 ? "slide-next" : "slide-prev");

            setTimeout(() => {
                card.classList.remove("slide-next", "slide-prev");
                isAnimating = false;
            }, 380);
        } else {
            isAnimating = false;
        }
    }

    function changeEdu(direction) {
        if (isAnimating || eduData.length < 2) return;

        isAnimating = true;
        currentIndex = (currentIndex + direction + eduData.length) % eduData.length;
        renderEdu(currentIndex, direction);
    }

    prevBtn.addEventListener("click", () => changeEdu(-1));
    nextBtn.addEventListener("click", () => changeEdu(1));

    renderEdu(0);
}

/*=====================================================
            FEATURED PROJECTS STAGE PICKER
=====================================================*/

function projectCarousel() {
    const prevBtn = document.getElementById("projPrev");
    const nextBtn = document.getElementById("projNext");
    const counterEl = document.getElementById("projCounter");
    const cards = Array.from(document.querySelectorAll(".featured-project-card"));

    if (!prevBtn || !nextBtn || !cards.length) return;

    let currentIndex = cards.findIndex(card => card.classList.contains("active"));
    if (currentIndex < 0) currentIndex = 0;

    let isAnimating = false;

    function renderProject(idx, direction = 0) {
        cards.forEach(card => {
            card.classList.remove("active", "slide-next", "slide-prev");
        });

        const nextCard = cards[idx];
        if (!nextCard) return;

        nextCard.classList.add("active");
        counterEl.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;

        if (direction !== 0) {
            void nextCard.offsetWidth;
            nextCard.classList.add(direction > 0 ? "slide-next" : "slide-prev");

            setTimeout(() => {
                nextCard.classList.remove("slide-next", "slide-prev");
                isAnimating = false;
            }, 380);
        } else {
            isAnimating = false;
        }
    }

    function changeProject(direction) {
        if (isAnimating || cards.length < 2) return;

        isAnimating = true;
        currentIndex = (currentIndex + direction + cards.length) % cards.length;
        renderProject(currentIndex, direction);
    }

    prevBtn.addEventListener("click", () => changeProject(-1));
    nextBtn.addEventListener("click", () => changeProject(1));

    renderProject(currentIndex);
}

/*=====================================================
            SMOOTH SCROLL
=====================================================*/

function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}
