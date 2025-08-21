// Mobile menu toggle function
document.addEventListener('DOMContentLoaded', function() {
    // If page loads with a hash, adjust scroll to account for fixed header
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'auto'
                });
            }, 0);
        }
    }

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        const closeMobileMenu = () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                if (!icon.classList.contains('fa-bars')) {
                    icon.classList.add('fa-bars');
                }
            }
        };

        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Toggle between bars and times icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Click outside to close mobile menu
        document.addEventListener('click', function(event) {
            if (!navMenu.classList.contains('active')) return;
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = navToggle.contains(event.target);
            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const teamMembers = document.querySelectorAll('.team-member');
    
    if (filterButtons.length > 0 && teamMembers.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // First, fade out all members
                teamMembers.forEach(member => {
                    member.classList.add('fade-out');
                    member.classList.remove('fade-in');
                });
                
                // After fade out animation, show/hide members and fade in the visible ones
                setTimeout(() => {
                    teamMembers.forEach((member, index) => {
                        if (filterValue === 'all' || member.getAttribute('data-category') === filterValue) {
                            member.style.display = 'block';
                            // Stagger the fade-in animation for a nice effect
                            setTimeout(() => {
                                member.classList.remove('fade-out');
                                member.classList.add('fade-in');
                            }, index * 100); // 100ms delay between each member
                        } else {
                            member.style.display = 'none';
                            member.classList.remove('fade-out', 'fade-in');
                        }
                    });
                }, 300); // Wait for fade-out to complete
            });
        });
    }

    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Close mobile menu when menu links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    if (!icon.classList.contains('fa-bars')) {
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Change header for scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Update active menu item
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Number increment animation (success section)
    const statItems = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target, 0, parseInt(entry.target.textContent), 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => {
        observer.observe(item);
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contact-success');
    if (contactForm && contactForm.action && contactForm.action.includes('formsubmit.co')) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            try {
                await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // Hide form, show success message for 10 seconds
                this.style.display = 'none';
                if (contactSuccess) {
                    contactSuccess.style.display = 'block';
                }

                setTimeout(() => {
                    if (contactSuccess) contactSuccess.style.display = 'none';
                    this.reset();
                    this.style.display = 'block';
                }, 10000);
            } catch (error) {
                console.error('Form submission failed:', error);
                alert('Mesaj gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        });
    } else if (contactForm) {
        // Fallback local behavior if not using FormSubmit
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            this.style.display = 'none';
            if (contactSuccess) {
                contactSuccess.style.display = 'block';
            }
            setTimeout(() => {
                if (contactSuccess) contactSuccess.style.display = 'none';
                this.reset();
                this.style.display = 'block';
            }, 10000);
        });
    }
});

// Number increment animation function
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Smooth scroll function
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Infographic carousels
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.infographic-carousel');
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.infographic-track');
        const slides = Array.from(carousel.querySelectorAll('.infographic-slide'));
        const prevBtn = carousel.querySelector('.infographic-nav.prev');
        const nextBtn = carousel.querySelector('.infographic-nav.next');
        let index = 0;

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        function goPrev() {
            index = (index - 1 + slides.length) % slides.length;
            update();
        }

        function goNext() {
            index = (index + 1) % slides.length;
            update();
        }

        if (prevBtn) prevBtn.addEventListener('click', goPrev);
        if (nextBtn) nextBtn.addEventListener('click', goNext);

        // Keyboard accessibility when buttons focused
        [prevBtn, nextBtn].forEach(btn => {
            if (!btn) return;
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') goPrev();
                if (e.key === 'ArrowRight') goNext();
            });
        });
    });
});