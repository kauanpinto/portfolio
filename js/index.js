// Actual year
document.getElementById("year").textContent = new Date().getFullYear();

// Change theme
const themeBtn = document.getElementById("theme-btn");
const root = document.documentElement;

function applyInitialTheme() {
    const themeSaved = localStorage.getItem("theme");

    let isDark;
    if (themeSaved) {
        isDark = themeSaved === "dark";
    } else {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    root.classList.toggle("dark", isDark);
    themeBtn.classList.toggle("active", isDark);
    themeBtn.setAttribute(
        "aria-label",
        isDark ? "Ativar tema claro" : "Ativar tema escuro",
    );
}

applyInitialTheme();

themeBtn.addEventListener("click", () => {
    themeBtn.classList.toggle("active");
    root.classList.toggle("dark");

    const isDark = root.classList.contains("dark");
    themeBtn.setAttribute(
        "aria-label",
        isDark ? "Ativar tema claro" : "Ativar tema escuro",
    );

    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Hamburger button
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
let scrollY = 0;

menuBtn.addEventListener("click", () => {
    const isOpening = !navLinks.classList.contains("active");

    navLinks.classList.toggle("active");
    menuBtn.classList.toggle("open");

    if (isOpening) {
        scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
    }

    const isOpen = menuBtn.classList.contains("open");
    menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

const navLinkItems = navLinks.querySelectorAll("a");

navLinkItems.forEach((link) => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        const targetEl = document.querySelector(targetId);

        navLinks.classList.remove("active");
        menuBtn.classList.remove("open");
        document.body.classList.remove("no-scroll");
        document.body.style.top = "";

        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            window.scrollTo(0, scrollY);
        }
    });
});

// Glow effect
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;
let idleTimer = null;
const glow = document.getElementById("glow");
const IDLE_DELAY = 300;

function updateTarget(x, y) {
    targetX = x;
    targetY = y;

    glow.classList.add("active");
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
        glow.classList.remove("active");
    }, IDLE_DELAY);
}

window.addEventListener("mousemove", (e) => updateTarget(e.clientX, e.clientY));

window.addEventListener(
    "touchmove",
    (e) => {
        const t = e.touches[0];
        updateTarget(t.clientX, t.clientY);
    },
    { passive: true },
);

window.addEventListener("touchend", () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => glow.classList.remove("active"), IDLE_DELAY);
});

function loop() {
    const ease = 0.1;

    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    glow.style.setProperty("--x", currentX + "px");
    glow.style.setProperty("--y", currentY + "px");

    requestAnimationFrame(loop);
}

loop();

// Project card animation
const projectCards = document.querySelectorAll(".project-card");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("visible", entry.isIntersecting);
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
    },
);

projectCards.forEach((card) => observer.observe(card));

// Dynamic navbar height position
function updateNavbarHeight() {
    const navbar = document.querySelector(".navbar");
    const height = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
        "--navbar-height",
        `${height}px`,
    );
}

updateNavbarHeight();
window.addEventListener("resize", updateNavbarHeight);
