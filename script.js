document.addEventListener('DOMContentLoaded', () => {

    // --- SMOOTH SCROLLING FOR NAVIGATION LINKS ---
    // Selects all anchor links that start with '#' and adds a click event listener.
    // On click, it prevents the default jump and smoothly scrolls to the target section.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Close mobile menu on link click
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- LANGUAGE TOGGLE FUNCTIONALITY ---
    // Handles switching the website's language between English and French.
    const langToggle = document.getElementById('lang-toggle');
    const aboutEn = document.getElementById('about-en');
    const aboutFr = document.getElementById('about-fr');
    let currentLang = 'en'; // Initial language

    langToggle.addEventListener('click', () => {
        // Determine the new language
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        // Set the lang attribute on the HTML element for accessibility
        document.documentElement.lang = currentLang;

        // Toggle visibility of the bilingual 'About Me' sections
        aboutEn.classList.toggle('hidden');
        aboutFr.classList.toggle('hidden');

        // Translate all elements with data-lang attributes
        const elementsToTranslate = document.querySelectorAll('[data-lang-en]');
        elementsToTranslate.forEach(el => {
            // Skip elements that have the 'data-no-translate' attribute
            if (el.hasAttribute('data-no-translate')) {
                return;
            }

            const text = el.getAttribute(`data-lang-${currentLang}`);
            if (text) {
                // Handle form inputs and textareas differently from other elements
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.innerText = text;
                }
            }
        });

        // Restart typing animation for the new language
        restartTypingAnimation();
    });

    // --- MOBILE MENU TOGGLE ---
    // Handles the opening and closing of the mobile navigation menu.
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });



    // --- TYPING ANIMATION ---
    const englishTitles = ['IT Professional', 'Data Analyst', 'Cybersecurity Analyst', 'AI Engineer', 'IT Project Manager'];
    const frenchTitles = ['Professionnelle en TI', 'Analyste de Données', 'Analyste en Cybersécurité', 'Ingénieure en IA', 'Gestionnaire de Projet TI'];
    
    let activeTitles = englishTitles; // Default to English
    const typingElement = document.getElementById('typing-text');
    let titleIndex = 0;
    let charIndex = 0;
    let typingTimeout;
    let erasingTimeout;

    const TYPING_SPEED = 100; // ms per character
    const DELETING_SPEED = 50; // ms per character
    const HOLD_TIME = 2000; // 2 seconds

    // Attach the cursor class initially
    typingElement.classList.add('typing-cursor');

    function type() {
        const currentTitle = activeTitles[titleIndex];
        if (charIndex < currentTitle.length) {
            typingElement.textContent += currentTitle.charAt(charIndex);
            charIndex++;
            typingTimeout = setTimeout(type, TYPING_SPEED);
        } else {
            // Text is fully typed, now wait and then delete
            erasingTimeout = setTimeout(erase, HOLD_TIME);
        }
    }

    function erase() {
        const currentTitle = activeTitles[titleIndex];
        if (charIndex > 0) {
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            erasingTimeout = setTimeout(erase, DELETING_SPEED);
        } else {
            // Text is fully erased, move to the next title
            titleIndex = (titleIndex + 1) % activeTitles.length; // Cycle through titles
            charIndex = 0; // Reset character index for the next title
            typingTimeout = setTimeout(type, TYPING_SPEED); // Start typing the next title
        }
    }

    function restartTypingAnimation() {
        // Clear any ongoing timeouts
        clearTimeout(typingTimeout);
        clearTimeout(erasingTimeout);

        // Set active titles based on current language
        activeTitles = (currentLang === 'en') ? englishTitles : frenchTitles;
        
        // Reset animation state
        titleIndex = 0;
        charIndex = 0;
        typingElement.textContent = ''; // Clear current text
        
        // Start typing the first title of the new language
        type();
    }

    // Initial start of the animation
    restartTypingAnimation();
});
