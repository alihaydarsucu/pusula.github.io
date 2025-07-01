document.addEventListener('DOMContentLoaded', function() {
    // ================= MOBİL MENÜ FONKSİYONLARI =================
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-links a, .nav-menu a');

    /**
     * Toggles the visibility of the mobile menu and overlay, and enables or disables page scrolling accordingly.
     */
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    /**
     * Closes the mobile menu and overlay, restoring page scrolling.
     */
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Menü linklerine tıklandığında menüyü kapat
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ================= HEADER SCROLL EFFECT =================
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('header-scrolled', window.scrollY > 100);
    });

    // ================= BACK TO TOP BUTTON =================
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('active', window.scrollY > 300);
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ================= ACTIVE MENU ITEM TRACKING =================
    const sections = document.querySelectorAll('section');

    /**
     * Updates navigation link highlighting based on the currently viewed section.
     *
     * Adds the 'active' class to the navigation link whose href matches the section currently in view, and removes it from others. The current section is determined by comparing the scroll position to each section's offset from the top of the page.
     */
    function updateActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('load', updateActiveSection);

    // ================= SMOOTH SCROLL =================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================= NUMBER ANIMATION (ACHIEVEMENTS SECTION) =================
    const statItems = document.querySelectorAll('.stat-number');
    if (statItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target, 0, parseInt(entry.target.textContent), 1500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => observer.observe(item));
    }

    // ================= CONTACT FORM =================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
            this.reset();
        });
    }
});

/**
 * Animates a numeric value within an element from a start value to an end value over a specified duration.
 * @param {Element} element - The DOM element whose text content will be updated.
 * @param {number} start - The initial value to display.
 * @param {number} end - The final value to display.
 * @param {number} duration - The animation duration in milliseconds.
 */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}