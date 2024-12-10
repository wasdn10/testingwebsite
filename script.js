// ===============================
// Global Variables and Selectors
// ===============================
const preloader = document.getElementById('preloader');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');

// ===============================
// Utility Functions
// ===============================

/**
 * Toggles a CSS class on an element.
 * @param {HTMLElement} element - The element to toggle the class on.
 * @param {string} className - The class to toggle.
 */
const toggleClass = (element, className) => {
    if (element) element.classList.toggle(className);
};

/**
 * Adds a CSS class to an element.
 * @param {HTMLElement} element - The element to add the class to.
 * @param {string} className - The class to add.
 */
const addClass = (element, className) => {
    if (element) element.classList.add(className);
};

/**
 * Removes a CSS class from an element.
 * @param {HTMLElement} element - The element to remove the class from.
 * @param {string} className - The class to remove.
 */
const removeClass = (element, className) => {
    if (element) element.classList.remove(className);
};

/**
 * Throttles a function to improve performance on high-frequency events.
 * @param {Function} func - The function to throttle.
 * @param {number} delay - The delay in milliseconds.
 */
const throttle = (func, delay) => {
    let timeout = null;
    return (...args) => {
        if (!timeout) {
            func(...args);
            timeout = setTimeout(() => (timeout = null), delay);
        }
    };
};

// ===============================
// Preloader Management
// ===============================

const Preloader = {
    hide() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => (preloader.style.display = 'none'), 500); // Smooth fade-out
        }
    },
};

// ===============================
// Hamburger Menu Management
// ===============================

const Menu = {
    toggle() {
        toggleClass(navLinks, 'active');
        const isExpanded = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    },
    closeOnClick() {
        links.forEach(link =>
            link.addEventListener('click', () => removeClass(navLinks, 'active'))
        );
    },
    init() {
        if (hamburger) {
            hamburger.addEventListener('click', this.toggle);
            this.closeOnClick();
        }
    },
};

// ===============================
// Sticky Header Management
// ===============================

const StickyHeader = {
    handle() {
        if (window.scrollY > 50) {
            addClass(header, 'sticky');
        } else {
            removeClass(header, 'sticky');
        }
    },
};

// ===============================
// Smooth Scrolling
// ===============================

const SmoothScroll = {
    enable() {
        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - header.offsetHeight,
                        behavior: 'smooth',
                    });
                }
            });
        });
    },
};

// ===============================
// Section Visibility and Animations
// ===============================

const SectionObserver = {
    observe() {
        const options = {
            root: null,
            threshold: 0.1, // Trigger when 10% of the section is visible
        };
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    addClass(entry.target, 'visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        sections.forEach(section => observer.observe(section));
    },
};

// ===============================
// Form Submission Handling
// ===============================

const FormHandler = {
    handle() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (name && email && message) {
                alert(`Thank you, ${name}! Your message has been sent.`);
                form.reset(); // Clear the form fields
            } else {
                alert('Please fill out all fields before submitting.');
            }
        });
    },
};

// ===============================
// Active Navigation Highlight
// ===============================

const ActiveNavigation = {
    highlight() {
        const scrollPosition = window.scrollY + header.offsetHeight + 10;

        links.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (
                section.offsetTop <= scrollPosition &&
                section.offsetTop + section.offsetHeight > scrollPosition
            ) {
                addClass(link, 'active');
            } else {
                removeClass(link, 'active');
            }
        });
    },
};

// ===============================
// Initialization
// ===============================

const App = {
    init() {
        Preloader.hide();
        Menu.init();
        SmoothScroll.enable();
        SectionObserver.observe();
        FormHandler.handle();
    },
};

// ===============================
// Event Listeners
// ===============================

document.addEventListener('DOMContentLoaded', App.init);

window.addEventListener(
    'scroll',
    throttle(() => {
        StickyHeader.handle();
        ActiveNavigation.highlight();
    }, 100)
)
