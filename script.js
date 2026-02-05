/*JAVA SCRIPT FILE FOR THE PORTFOLIO*/
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initSmoothScroll();
    initHeaderScroll();
    initTypingEffect();
    updateCopyrightYear();
    initContactForm();
});
// 1. THEME TOGGLE
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode if saved or system prefers it
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        updateToggleState(true);
    }
    
    // Toggle button click handler
    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleState(isDark);
        createRipple(toggleBtn);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const isDark = e.matches;
            body.classList.toggle('dark-mode', isDark);
            updateToggleState(isDark);
        }
    });
}

function updateToggleState(isDark) {
    const text = document.querySelector('.toggle-text');
    const body = document.body;
    
    if (text) {
        text.textContent = isDark ? 'Light' : 'Dark';
    }
    
    // Force background update by triggering a reflow
    body.style.display = 'none';
    body.offsetHeight; // Trigger reflow
    body.style.display = '';
}

function createRipple(button) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);
// 2. SCROLL REVEAL
function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    sections.forEach(section => observer.observe(section));
}
// 3. SMOOTH SCROLL
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 4. HEADER SCROLL EFFECT
function initHeaderScroll() {
    const header = document.querySelector('header');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset > 50;
                if (header) {
                    header.style.boxShadow = scrolled 
                        ? '0 8px 40px rgba(0,0,0,0.2)' 
                        : 'var(--glass-shadow)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}
// 5. TYPING EFFECT FOR BRAND TAGLINE
function initTypingEffect() {
    const roles = [
        "Information Science Engineering Student",
        "Intern at Adversity Solution", 
    ];
    
    const element = document.querySelector('.brand p');
    if (!element) return;
    
    // Clear initial text
    element.textContent = '';
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Cursor effect
        element.style.borderRight = '2px solid var(--accent)';
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
            element.style.borderRight = 'none';
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}
// 6. COPYRIGHT YEAR
function updateCopyrightYear() {
    const footerSmall = document.querySelector('footer small');
    if (footerSmall) {
        footerSmall.innerHTML = `&copy; ${new Date().getFullYear()} Niti N Makam portfolio`;
    }
}

// KEYBOARD SHORTCUT
document.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.click();
    }
});

// Console greeting
console.log('%c🌿 Niti\'s Portfolio', 'font-size: 20px; font-weight: bold; color: #6B7D6A;');
console.log('%cLiquid Glass Edition', 'font-size: 12px; color: #9AB89A;');

// Contact Form - Minimal & Effective
function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.textContent = 'Sending...';
        status.textContent = '';
        status.className = '';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                status.textContent = 'Message sent! I\'ll reply soon.';
                status.className = 'success';
                form.reset();
            } else {
                throw new Error('Failed');
            }
        } catch {
            status.textContent = 'Failed to send. Please email me directly.';
            status.className = 'error';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send Message';
        }
    });
}
