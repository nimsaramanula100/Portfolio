/* ===========================
   PORTFOLIO JAVASCRIPT
   Manula Nimsara - Premium Portfolio
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===========================
    // PRELOADER
    // ===========================
    const preloader = document.getElementById('preloader');
    const preloaderPercentage = document.getElementById('preloaderPercentage');
    let loadProgress = 0;

    const preloaderInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(preloaderInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                animateHeroElements();
            }, 500);
        }
        preloaderPercentage.textContent = Math.floor(loadProgress) + '%';
    }, 100);

    // ===========================
    // CUSTOM CURSOR
    // ===========================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Trail particles for the cursor
    const cursorTrails = [];
    const maxTrails = 8;

    function createTrailDot(x, y) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(0, 229, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99997;
            left: ${x}px;
            top: ${y}px;
            transition: opacity 0.5s ease, transform 0.5s ease;
            box-shadow: 0 0 6px rgba(0, 229, 255, 0.4);
        `;
        document.body.appendChild(trail);
        cursorTrails.push(trail);

        // Fade out and remove
        requestAnimationFrame(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0)';
        });

        setTimeout(() => {
            trail.remove();
            cursorTrails.shift();
        }, 500);
    }

    let trailCounter = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Offset so the arrow tip (top-left of SVG) lands at the mouse point
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 2 + 'px';

        // Create trail particles every few frames
        trailCounter++;
        if (trailCounter % 3 === 0) {
            createTrailDot(mouseX, mouseY);
        }
    });

    function animateCursorFollower() {
        followerX += (mouseX - followerX - 20) * 0.12;
        followerY += (mouseY - followerY - 20) * 0.12;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateCursorFollower);
    }
    animateCursorFollower();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-content, .contact-social');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // ===========================
    // PARTICLE & CODE STREAM CANVAS (Developer Spectrum)
    // ===========================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let codeParticles = [];
    const particleCount = 50;
    const codeParticleCount = 20;

    const spectrumColors = [
        { r: 59,  g: 130, b: 246 }, // Blue
        { r: 249, g: 115, b: 22  }, // Orange
        { r: 234, g: 179, b: 8   }, // Yellow
        { r: 16,  g: 185, b: 129 }, // Green
        { r: 168, g: 85,  b: 247 }  // Purple
    ];

    const codeSnippets = [
        'const dev = new FullStackDeveloper("Manula");',
        'async function buildUI() { await renderGlass(); }',
        '<div class="glass-card">Modern UI</div>',
        'import { useState, useEffect } from "react";',
        'const spectrum = ["#3b82f6", "#f97316", "#10b981"];',
        'SELECT * FROM projects WHERE status = "SUCCESS";',
        'git commit -m "feat: multi-color glassmorphism"',
        'npm run dev',
        '<MN/>',
        'console.log("Welcome to my portfolio!");',
        'const HNDIT = true;',
        'const design = { blur: "24px", theme: "spectrum" };',
        'function animate() { requestAnimationFrame(); }',
        'const status = 200; // OK',
        'const future = "unlimited";',
        'export default App;',
        'docker-compose up -d',
        'const skills = ["React", "Node", "Vue", "Python"];'
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = spectrumColors[Math.floor(Math.random() * spectrumColors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.6)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class CodeParticle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * (canvas.width - 250);
            this.y = initial ? Math.random() * canvas.height : canvas.height + 30;
            this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            this.speedY = -(Math.random() * 0.4 + 0.3);
            this.fontSize = Math.floor(Math.random() * 3) + 11;
            this.color = spectrumColors[Math.floor(Math.random() * spectrumColors.length)];
            this.opacity = Math.random() * 0.25 + 0.15;
        }

        update() {
            this.y += this.speedY;
            if (this.y < -40) {
                this.reset(false);
            }
        }

        draw() {
            ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`;
            ctx.fillText(this.text, this.x, this.y);
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    for (let i = 0; i < codeParticleCount; i++) {
        codeParticles.push(new CodeParticle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    const alpha = 0.12 * (1 - distance / 130);
                    const c1 = particles[i].color;
                    const c2 = particles[j].color;
                    const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    grad.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${alpha})`);
                    grad.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${alpha})`);

                    ctx.beginPath();
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw drifting developer code streams
        codeParticles.forEach(cp => {
            cp.update();
            cp.draw();
        });

        // Draw particle mesh
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===========================
    // NAVIGATION
    // ===========================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNavLink();

        // Animate skill bars
        animateSkillBars();
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===========================
    // THEME TOGGLE
    // ===========================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ===========================
    // TYPEWRITER EFFECT
    // ===========================
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        'Full-Stack Developer',
        'UI/UX Designer',
        'Mobile App Developer',
        'Problem Solver',
        'Creative Thinker',
        'Tech Enthusiast'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeWriter() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // ===========================
    // HERO ANIMATION
    // ===========================
    function animateHeroElements() {
        typeWriter();
        animateCounters();
    }

    // ===========================
    // COUNTER ANIMATION
    // ===========================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            updateCounter();
        });
    }

    // ===========================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ===========================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ===========================
    // SKILL BARS ANIMATION
    // ===========================
    let skillBarsAnimated = false;

    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && !skillBarsAnimated) {
            skillBarsAnimated = true;
            const progressBars = document.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
            });
        }
    }

    // ===========================
    // SKILLS TABS
    // ===========================
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillGrids = document.querySelectorAll('.skills-grid');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            skillGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === targetTab) {
                    grid.classList.add('active');
                    // Re-animate skill bars for new tab
                    const progressBars = grid.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        bar.style.width = '0';
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 100);
                    });
                }
            });
        });
    });

    // ===========================
    // PROJECT FILTERS
    // ===========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===========================
    // TESTIMONIAL SLIDER
    // ===========================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentTestimonial = 0;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;

        document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        goToTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        goToTestimonial(currentTestimonial);
    });

    // Auto slide
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        goToTestimonial(currentTestimonial);
    }, 5000);

    // ===========================
    // CONTACT FORM
    // ===========================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Construct the mailto link
        const mailtoLink = `mailto:nimsaramanula100@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
        
        // Open the email client
        window.location.href = mailtoLink;

        // Show a brief success visual and reset form
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Opening Email App...</span><i class="fas fa-check"></i>';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            contactForm.reset();
        }, 3000);
    });

    // ===========================
    // BACK TO TOP
    // ===========================
    const backToTopBtn = document.getElementById('backToTop');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===========================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // TILT EFFECT ON PROJECT CARDS
    // ===========================
    const tiltCards = document.querySelectorAll('.project-card, .skill-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===========================
    // MAGNETIC BUTTONS
    // ===========================
    const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===========================
    // TEXT REVEAL ON SCROLL
    // ===========================
    const revealElements = document.querySelectorAll('.section-title, .about-heading');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===========================
    // PARALLAX EFFECT ON HERO SHAPES
    // ===========================
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ===========================
    // PROJECT MODAL EXPAND LOGIC
    // ===========================
    const projectModalBackdrop = document.getElementById('projectModalBackdrop');
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const aloraLuxeCard = document.querySelector('[data-project="aloraluxe"]');
    const aloraLuxeBtn = document.querySelector('.project-details-btn[data-project="aloraluxe"]');

    function openProjectModal(cardElement) {
        if (projectModalBackdrop && projectModal) {
            if (cardElement) {
                const rect = cardElement.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;
                projectModal.style.transformOrigin = `${originX}px ${originY}px`;
            } else {
                projectModal.style.transformOrigin = 'center center';
            }
            projectModalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeProjectModal() {
        if (projectModalBackdrop) {
            projectModalBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (aloraLuxeCard) {
        aloraLuxeCard.addEventListener('click', (e) => {
            // Prevent if clicked directly on social external links
            if (e.target.closest('.project-link')) return;
            openProjectModal(aloraLuxeCard);
        });
    }

    if (aloraLuxeBtn) {
        aloraLuxeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProjectModal(aloraLuxeCard);
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    if (projectModalBackdrop) {
        projectModalBackdrop.addEventListener('click', (e) => {
            if (e.target === projectModalBackdrop) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModalBackdrop && projectModalBackdrop.classList.contains('active')) {
            closeProjectModal();
        }
    });
});
