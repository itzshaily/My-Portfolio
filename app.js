// Enhanced Portfolio JavaScript with Fixed Navigation
class VibrantPortfolio {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        // Core setup
        this.addCustomStyles();
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupInteractiveElements();
        
        // Initialize components after loading
        setTimeout(() => {
            this.initializeComponents();
        }, 100);
    }

    // Loading Screen with Enhanced Animation
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        // Create particle effect in loading screen
        this.createLoadingParticles();

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('loaded');
            
            // Remove loading screen from DOM
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
                this.isLoaded = true;
                this.startMainAnimations();
            }, 500);
        }, 2000);
    }

    createLoadingParticles() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'loading-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: loadingFloat ${2 + Math.random() * 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            loadingScreen.appendChild(particle);
        }
    }

    // Fixed Navigation System
    setupNavigation() {
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupHeaderEffects();
    }

    setupSmoothScrolling() {
        // Get all navigation links and buttons that should scroll
        const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('href');
                console.log('Clicked link with target:', targetId); // Debug log
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    console.log('Found target section:', targetSection); // Debug log
                    
                    const headerHeight = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    this.closeMobileMenu();
                    
                    // Add click animation
                    this.addRippleEffect(link, e);
                    
                    // Update active nav link after scroll
                    setTimeout(() => {
                        this.updateActiveNavLink();
                    }, 100);
                } else {
                    console.warn('Target section not found for:', targetId);
                }
            });
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -60% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    setupHeaderEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (!header) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header hide/show effect
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // Background blur effect
            if (currentScrollY > 50) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(15, 23, 42, 0.8)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Fixed Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Set initial theme
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.applyTheme(savedTheme);

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            this.applyTheme(newTheme);
            this.addRippleEffect(themeToggle, e);
            
            // Save preference
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Smooth transition
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    // Fixed Mobile Menu
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
            
            this.addRippleEffect(mobileToggle, e);
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu) {
            navMenu.classList.add('active');
            navMenu.style.animation = 'slideDown 0.3s ease-out forwards';
        }
        
        if (mobileToggle) {
            mobileToggle.classList.add('active');
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu) {
            navMenu.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => {
                navMenu.classList.remove('active');
                navMenu.style.animation = '';
            }, 300);
        }
        
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
        }

        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Main Animations After Loading
    startMainAnimations() {
        this.initTypingEffect();
        this.initCounterAnimations();
        this.initSkillBars();
        this.initParallaxEffects();
        this.initCursorEffects();
    }

    // Enhanced Typing Effect
    initTypingEffect() {
        const typedTextElement = document.getElementById('typed-text');
        if (!typedTextElement) return;
        
        const textToType = "INTERESTED IN PROBLEM SOLVING. ALWAYS EAGER TO LEARN AND BECOME BETTER.";
        let index = 0;
        
        typedTextElement.textContent = '';
        
        const typeText = () => {
            if (index < textToType.length) {
                typedTextElement.textContent += textToType.charAt(index);
                index++;
                
                // Add random typing speed variation
                const delay = textToType.charAt(index) === ' ' ? 100 : 30 + Math.random() * 70;
                setTimeout(typeText, delay);
            } else {
                // Start blinking cursor
                const cursor = document.querySelector('.cursor');
                if (cursor) {
                    cursor.style.animation = 'blink 1s infinite';
                }
            }
        };
        
        // Start typing after a brief delay
        setTimeout(typeText, 1000);
    }

    // Animated Counters with Easing
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (easeOutCubic)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeProgress * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                    // Add completion animation
                    counter.style.animation = 'pulse 0.5s ease-out';
                }
            };
            
            requestAnimationFrame(update);
        };

        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Enhanced Skill Progress Bars
    initSkillBars() {
        const skillBars = document.querySelectorAll('.progress-bar');
        if (skillBars.length === 0) return;
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const skillCard = progressBar.closest('.skill-card');
                    const width = progressBar.getAttribute('data-width');
                    
                    // Staggered animation
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                        
                        // Add glow effect
                        setTimeout(() => {
                            progressBar.style.boxShadow = `0 0 20px rgba(99, 102, 241, 0.6)`;
                        }, 500);
                        
                        // Animate skill card
                        if (skillCard) {
                            skillCard.style.animation = 'skillCardPulse 0.6s ease-out 0.5s';
                        }
                    }, 200);
                    
                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    // Scroll Animations with Enhanced Effects
    setupScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.skill-card, .project-card, .certificate-card, .timeline-item, .contact-item, .stat'
        );
        
        if (animateElements.length === 0) return;
        
        // Add initial animation classes
        animateElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('visible');
                    
                    // Add specific animations based on element type
                    if (element.classList.contains('skill-card')) {
                        element.style.animation = 'slideInUp 0.8s ease-out forwards';
                    } else if (element.classList.contains('project-card')) {
                        element.style.animation = 'slideInScale 0.8s ease-out forwards';
                    } else if (element.classList.contains('certificate-card')) {
                        element.style.animation = 'rotateIn 0.8s ease-out forwards';
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Parallax Effects
    initParallaxEffects() {
        const heroBackground = document.querySelector('.hero-background');
        const particles = document.querySelectorAll('.particle');
        
        if (heroBackground || particles.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (heroBackground && scrolled < window.innerHeight) {
                    heroBackground.style.transform = `translateY(${rate}px)`;
                }
                
                particles.forEach((particle, index) => {
                    const speed = 0.2 + (index * 0.1);
                    particle.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        }
    }

    // Enhanced Contact Form
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message')
        };

        // Real-time validation with enhanced feedback
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field) {
                field.addEventListener('input', () => this.validateField(fieldName, field));
                field.addEventListener('blur', () => this.validateField(fieldName, field));
                field.addEventListener('focus', () => this.clearFieldError(field));
            }
        });

        // Form submission with animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    validateField(fieldName, field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters long';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.add('error');
            field.classList.remove('valid');
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    handleFormSubmission() {
        const fields = ['name', 'email', 'subject', 'message'];
        let isFormValid = true;

        // Validate all fields
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const fieldValid = this.validateField(fieldName, field);
                if (!fieldValid) isFormValid = false;
            }
        });

        if (isFormValid) {
            const submitButton = document.querySelector('#contactForm button[type="submit"]');
            if (!submitButton) return;
            
            const originalContent = submitButton.innerHTML;
            
            // Animated submission
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            submitButton.style.background = 'linear-gradient(135deg, #6366f1, #06b6d4)';

            // Simulate API call
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #10b981, #3b82f6)';
                
                // Show success animation
                this.showSuccessMessage();
                
                // Reset form
                setTimeout(() => {
                    const form = document.getElementById('contactForm');
                    if (form) form.reset();
                    
                    submitButton.innerHTML = originalContent;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    
                    // Clear validation classes
                    fields.forEach(fieldName => {
                        const field = document.getElementById(fieldName);
                        if (field) {
                            field.classList.remove('valid', 'error');
                        }
                    });
                }, 3000);
            }, 2000);
        } else {
            // Shake form on error
            const form = document.getElementById('contactForm');
            if (form) {
                form.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    form.style.animation = '';
                }, 500);
            }
        }
    }

    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Thank you for your message!</h3>
                <p>I'll get back to you as soon as possible.</p>
            </div>
        `;
        
        document.body.appendChild(successMessage);
        
        // Animate in
        setTimeout(() => {
            successMessage.classList.add('visible');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            successMessage.classList.remove('visible');
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
            }, 300);
        }, 4000);
    }

    // Interactive Elements
    setupInteractiveElements() {
        this.setupHoverEffects();
        this.setupClickAnimations();
        this.setupKeyboardNavigation();
    }

    setupHoverEffects() {
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) rotateX(5deg)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0)';
            });
        });

        // Skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const progressBar = card.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.animation = 'pulse 0.5s ease-in-out';
                }
            });
        });

        // Certificate cards
        const certCards = document.querySelectorAll('.certificate-card');
        certCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0) scale(1)';
            });
        });
    }

    setupClickAnimations() {
        // Add click ripple effect to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .nav-link, .social-link, .project-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.addRippleEffect(element, e);
            });
        });
    }

    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    this.closeMobileMenu();
                    break;
                case 'Tab':
                    // Add focus indicators
                    document.body.classList.add('keyboard-navigation');
                    break;
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Cursor Effects
    initCursorEffects() {
        // Custom cursor for modern browsers
        if (window.innerWidth > 768) {
            this.createCustomCursor();
        }
    }

    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    // Utility Methods
    updateActiveNavLink() {
        // This method is called by the scroll spy
        // Additional logic can be added here if needed
    }

    addCustomStyles() {
        if (document.getElementById('portfolio-dynamic-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'portfolio-dynamic-styles';
        style.textContent = `
            /* Loading Particles Animation */
            @keyframes loadingFloat {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }

            /* Mobile Menu Animations */
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideUp {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }

            /* Enhanced Animations */
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(50px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInScale {
                from { opacity: 0; transform: translateY(30px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            @keyframes rotateIn {
                from { opacity: 0; transform: rotate(-10deg) scale(0.9); }
                to { opacity: 1; transform: rotate(0deg) scale(1); }
            }
            
            @keyframes skillCardPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* Ripple Effect */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: rippleAnimation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes rippleAnimation {
                to { transform: scale(4); opacity: 0; }
            }

            /* Success Message */
            .success-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #10b981, #3b82f6);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
                transition: all 0.3s ease;
            }
            
            .success-message.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .success-content {
                text-align: center;
            }
            
            .success-content i {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: white;
            }
            
            .success-content h3 {
                margin-bottom: 0.5rem;
                color: white;
            }
            
            .success-content p {
                margin: 0;
                opacity: 0.9;
            }

            /* Custom Cursor */
            .custom-cursor {
                width: 20px;
                height: 20px;
                border: 2px solid #6366f1;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                mix-blend-mode: difference;
            }
            
            .cursor-dot {
                width: 4px;
                height: 4px;
                background: #06b6d4;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.05s ease;
            }
            
            .custom-cursor.cursor-hover {
                width: 40px;
                height: 40px;
                border-color: #ec4899;
            }

            /* Form Validation States */
            .form-control.valid {
                border-color: #10b981 !important;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
            }

            /* Keyboard Navigation */
            .keyboard-navigation *:focus {
                outline: 2px solid #6366f1 !important;
                outline-offset: 2px !important;
            }

            /* Mobile Menu Active State - Fixed */
            .nav-menu.active {
                display: flex !important;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(15, 23, 42, 0.98);
                flex-direction: column;
                padding: 1rem;
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .nav-menu.active .nav-link {
                padding: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .nav-menu.active .nav-link:hover {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 0.5rem;
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }

            /* Loading Screen Enhancement */
            .loading-screen .loader {
                position: relative;
                z-index: 2;
            }

            /* Loaded State */
            body.loaded {
                overflow-x: hidden;
            }

            /* Ensure navigation works on mobile */
            @media (max-width: 768px) {
                .nav-menu {
                    display: none;
                }
                
                .mobile-menu-toggle {
                    display: flex !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize the portfolio application
let portfolioApp = null;

// Single initialization with enhanced error handling
function initializePortfolio() {
    if (!portfolioApp) {
        try {
            portfolioApp = new VibrantPortfolio();
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }
}

// Multiple initialization attempts for reliability
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Fallback initialization
setTimeout(() => {
    if (!portfolioApp) {
        console.log('Fallback initialization triggered');
        initializePortfolio();
    }
}, 1000);

// Performance optimization
window.addEventListener('load', () => {
    // Optimize animations after full load
    requestAnimationFrame(() => {
        document.body.classList.add('fully-loaded');
    });
});

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (portfolioApp && window.innerWidth > 768) {
            // Reinitialize desktop features if needed
            portfolioApp.initCursorEffects();
        }
    }, 250);
});

// Export for potential external use
window.VibrantPortfolio = VibrantPortfolio;