/*=========================================
        PORTFOLIO SCRIPT — Monochrome & Interactions
        Linden Powell Rivera
=========================================*/

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
    mobileNavigation();
    navbarScrollState();
    activeNavigation();
    revealAnimation();
    heroTypewriter();
    aboutTypewriterScrollDriven();
    experiencePillPicker();
    stackPillPicker();
    educationPillPicker();
    projectStagePicker();
    smoothScrolling();
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

    const phrases = ["Let's build web apps", "Hardware & Software student", "Full-stack developer"];
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

        let speed = isDeleting ? 40 : 80;

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

/*=====================================================
    ABOUT TYPEWRITER — SCROLL CONTROLLED
    DOWN = TYPE
    UP = DELETE
=====================================================*/

function aboutTypewriterScrollDriven() {

    const target = document.getElementById("introTypewriter");
    const container = document.getElementById("aboutIntroBlock");

    if (!target || !container) return;

    const fullText =
        "Linden Powell Rivera is a Computer Engineering student at the Polytechnic University of the Philippines – Sta. Mesa, with a growing focus on networking, hardware, and web development. He has hands-on experience in cabling, troubleshooting, and software projects while continuing to develop his technical skills.";

    let lastScrollY = window.scrollY;
    let charCount = 0;

    function updateTypewriter() {

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        /*
            Start as soon as the intro enters
            the lower part of the screen.
        */
        const start = windowHeight * 0.60;

        /*
            Finish when the intro reaches
            the upper part of the screen.
        */
        const end = windowHeight * 0.20;

        let progress =
            (start - rect.top) / (start - end);

        progress = Math.max(0, Math.min(1, progress));

        charCount = Math.floor(progress * fullText.length);

        const visibleText = fullText.substring(0, charCount);

        if (charCount > 0) {

            target.innerHTML =
                visibleText +
                '<span class="intro-cursor">|</span>';

        } else {

            target.innerHTML = "";

        }

        lastScrollY = window.scrollY;
    }

    window.addEventListener("scroll", updateTypewriter);

    updateTypewriter();
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
            "Hands-on technical support, cabling, and maintaining system functionality in an active environment.",
            "Collaborated on software tools and web interface updates for operational efficiency."
        ],
        stack: ["Linux", "Networking", "Python", "HTML", "CSS", "JavaScript"]
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

function experiencePillPicker() {
    const pillBtns = document.querySelectorAll(".exp-pill-btn");
    const titleEl = document.getElementById("expTitle");
    const roleDateEl = document.getElementById("expRoleDate");
    const logoImgEl = document.getElementById("expLogoImg");
    const bulletsEl = document.getElementById("expBullets");
    const stackEl = document.getElementById("expStackPills");

    if (!pillBtns.length || !titleEl) return;

    function renderExp(idx) {
        const data = expData[idx];
        if (!data) return;

        pillBtns.forEach((btn, i) => btn.classList.toggle("active", i === idx));

        titleEl.textContent = data.title;
        roleDateEl.textContent = data.roleDate;
        logoImgEl.src = data.logo;

        bulletsEl.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join("");
        stackEl.innerHTML = data.stack.map(s => `<span>${s}</span>`).join("");
    }

    pillBtns.forEach((btn, idx) => {
        btn.addEventListener("click", () => renderExp(idx));
    });

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
        bullets: [
            "Developing core competencies in Computer Engineering, bridging hardware systems and software development.",
            "Built practical projects involving Operating Systems simulation, Data Structures & Algorithms, and Metro Train graph routing.",
            "Hands-on experience in logic design, embedded computing, network configurations, and full-stack web integration."
        ],
        stack: ["Operating Systems", "Data Structures", "Networking", "Python", "Flask", "Web Dev"]
    },
    {
        title: "Our Lady of Fatima University",
        degreeDate: "Senior High School – STEM · Completed",
        logo: "images/pup.png",
        bullets: [
            "Academic track focusing on Science, Technology, Engineering, and Mathematics (STEM).",
            "Developed strong foundations in mathematics, physical sciences, logic, and introductory programming concepts.",
            "Participated in STEM research projects, problem-solving, and team collaborations."
        ],
        stack: ["STEM", "Mathematics", "Physics", "Research", "Logic"]
    }
];

function educationPillPicker() {
    const pillBtns = document.querySelectorAll(".edu-pill-btn");
    const titleEl = document.getElementById("eduTitle");
    const degreeDateEl = document.getElementById("eduDegreeDate");
    const logoImgEl = document.getElementById("eduLogoImg");
    const bulletsEl = document.getElementById("eduBullets");
    const stackEl = document.getElementById("eduStackPills");

    if (!pillBtns.length || !titleEl) return;

    function renderEdu(idx) {
        const data = eduData[idx];
        if (!data) return;

        pillBtns.forEach((btn, i) => btn.classList.toggle("active", i === idx));

        titleEl.textContent = data.title;
        degreeDateEl.textContent = data.degreeDate;
        logoImgEl.src = data.logo;

        bulletsEl.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join("");
        stackEl.innerHTML = data.stack.map(s => `<span>${s}</span>`).join("");
    }

    pillBtns.forEach((btn, idx) => {
        btn.addEventListener("click", () => renderEdu(idx));
    });

    renderEdu(0);
}

/*=====================================================
            FEATURED PROJECTS STAGE PICKER
=====================================================*/

function projectStagePicker() {
    const tabBtns = document.querySelectorAll(".project-tab-btn");
    const cards = document.querySelectorAll(".featured-project-card");

    if (!tabBtns.length) return;

    tabBtns.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            cards.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            if (cards[idx]) {
                cards[idx].classList.add("active");
            }
        });
    });
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
