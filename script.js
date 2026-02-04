document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initThemeToggle();
    initScrollReveal();
    initSmoothScroll();
    initHeaderScroll();
});

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        updateToggleState(true);
    }
    
    // Toggle handler
    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update button appearance
        updateToggleState(isDark);
        
        // Trigger ripple effect
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
    text.textContent = isDark ? 'Light' : 'Dark';
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
    `;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

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

function initHeaderScroll() {
    const header = document.querySelector('header');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset > 50;
                header.style.boxShadow = scrolled 
                    ? '0 8px 40px rgba(0,0,0,0.15)' 
                    : '0 4px 30px rgba(0,0,0,0.05)';
                ticking = false;
            });
            ticking = true;
        }
    });
}


console.log('%c🌟 Niti\'s Portfolio', 'font-size: 24px; font-weight: bold; color: #6B7D6A;');
console.log('%cBuilt with vanilla JavaScript & CSS', 'font-size: 12px; color: #5F6F64;');
console.log('%cTry pressing "T" to toggle theme!', 'font-size: 12px; color: #A1BC98;');

document.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        document.getElementById('theme-toggle').click();
    }
});