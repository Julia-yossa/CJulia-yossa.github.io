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

        // Reload blog posts if on blog page
        if (blogPostsContainer) {
            loadBlogPosts();
        }

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
    const englishTitles = ['Infrastructure Analyst', 'Data Analyst', 'Cybersecurity Analyst', 'AI Engineer', 'IT Project Manager'];
    const frenchTitles = ['Analyste TI', 'Analyste de Données', 'Analyste en Cybersécurité', 'Ingénieure en IA', 'Gestionnaire de Projet TI'];
    
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

    // --- BLOG MODAL FUNCTIONALITY ---
    const modal = document.getElementById('blog-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.bg-gray-900');
            const title = card.querySelector('h3').getAttribute(`data-lang-${currentLang}`) || card.querySelector('h3').textContent;
            const date = card.querySelector('p:nth-of-type(1)').getAttribute(`data-lang-${currentLang}`) || card.querySelector('p:nth-of-type(1)').textContent;
            
            modalTitle.textContent = title;
            modalDate.textContent = date;

            const fullContent = card.getAttribute(`data-full-content-${currentLang}`);
            
            if (fullContent) {
                modalContent.innerHTML = fullContent;
            } else {
                // Fallback for posts without full content
                const excerpt = card.querySelector('p:nth-of-type(2)').getAttribute(`data-lang-${currentLang}`) || card.querySelector('p:nth-of-type(2)').textContent;
                const fullContentEn = `<p>${excerpt}</p><p>This is where the full blog post content would appear. For this demo, we are only showing the excerpt.</p>`;
                const fullContentFr = `<p>${excerpt}</p><p>C'est ici que le contenu complet de l'article de blog apparaîtrait. Pour cette démo, nous ne montrons que l'extrait.</p>`;
                modalContent.innerHTML = (currentLang === 'en') ? fullContentEn : fullContentFr;
            }
            
            modal.classList.remove('hidden');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // --- LOAD BLOG POSTS FOR BLOG PAGE ---
    const blogPostsContainer = document.getElementById('blog-posts');
    if (blogPostsContainer) {
        loadBlogPosts();
    }

    function loadBlogPosts() {
        fetch('posts.json')
            .then(response => response.json())
            .then(posts => {
                const blogPostsContainer = document.getElementById('blog-posts');
                blogPostsContainer.innerHTML = ''; // Clear any existing content

                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'bg-gray-900 rounded-lg overflow-hidden shadow-lg';

                    const title = post[`title${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`];
                    const date = post[`date${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`];
                    const excerpt = post[`excerpt${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`];
                    const fullContent = post[`fullContent${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`];

                    postElement.innerHTML = `
                        <img src="${post.image}" alt="${title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <h3 class="text-2xl font-bold mb-2">${title}</h3>
                            <p class="text-sm text-gray-400 mb-2">${date}</p>
                            <p class="text-gray-400 text-sm mb-4">${excerpt}</p>
                            <button class="read-more-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors" data-lang-en="Read More" data-lang-fr="Lire la Suite">Read More</button>
                        </div>
                    `;

                    // Set data attribute for full content
                    postElement.setAttribute(`data-full-content-${currentLang}`, fullContent);

                    blogPostsContainer.appendChild(postElement);
                });

                // Re-attach event listeners for the new buttons
                attachReadMoreListeners();
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                const blogPostsContainer = document.getElementById('blog-posts');
                blogPostsContainer.innerHTML = '<p class="text-center text-gray-400">Error loading blog posts.</p>';
            });
    }

    function attachReadMoreListeners() {
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.bg-gray-900');
                const title = card.querySelector('h3').textContent;
                const date = card.querySelector('p:nth-of-type(1)').textContent;

                modalTitle.textContent = title;
                modalDate.textContent = date;

                const fullContent = card.getAttribute(`data-full-content-${currentLang}`);
                
                if (fullContent) {
                    modalContent.innerHTML = fullContent;
                } else {
                    // Fallback
                    const excerpt = card.querySelector('p:nth-of-type(2)').textContent;
                    const fullContentEn = `<p>${excerpt}</p><p>This is where the full blog post content would appear. For this demo, we are only showing the excerpt.</p>`;
                    const fullContentFr = `<p>${excerpt}</p><p>C'est ici que le contenu complet de l'article de blog apparaîtrait. Pour cette démo, nous ne montrons que l'extrait.</p>`;
                    modalContent.innerHTML = (currentLang === 'en') ? fullContentEn : fullContentFr;
                }
                
                modal.classList.remove('hidden');
            });
        });
    }
});
