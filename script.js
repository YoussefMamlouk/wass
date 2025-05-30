// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.querySelector('.caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Project folders based on requirements
const projectFolders = ['kerkennah', 'al_ziyara', 'jmc', 'inde'];
// All other folders except home, logo, and about_me will be albums
const albumFolders = ['l\'oiseau_a_sidibou', 'zaghouan', 'la_goulette', 'traversee', 'kairouan', 'bab_bhar', 'bab_el_falla', 'mouhit', 'cathedrale', 'bizerte'];

// Current gallery images and index for modal navigation
let currentGallery = [];
let currentIndex = 0;

// Image data will be loaded from JSON
let imageData = {
    folders: {},
    firstImages: {},
    captions: {}
};

// Placeholder/fallback image
const placeholderImage = 'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';

// Special folders that require direct handling
const specialFolders = {
    'traversee': {
        thumbnail: 'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
        images: [
            'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
            'images/traversee/a34f9509-a80d-4886-ad36-e0a34eeacf24.jpeg',
            'images/traversee/e906b09d-02b4-4e3e-a8d8-3e6b0cc08be9.jpeg'
        ]
    },
    'cathedrale': {
        thumbnail: 'images/cathedrale/60d5d1d6-395d-435b-83e7-9fe37dcfd675.jpeg',
        images: [
            'images/cathedrale/60d5d1d6-395d-435b-83e7-9fe37dcfd675.jpeg',
            'images/cathedrale/d04624a6-6136-4c1b-9505-31ee2b953a4e.jpeg',
            'images/cathedrale/e5574915-cb16-446c-bbb0-0890d870fafc.jpeg'
        ]
    },
    'about_me': {
        thumbnail: 'images/about_me/d4334420-4f6f-4d92-b930-12f804d88e9b.jpeg',
        images: [
            'images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg'
        ]
    }
};

// News articles data - will be populated from directory structure
const newsArticles = [];

// Function to load news articles
async function loadNewsArticles() {
    try {
        // For now, we'll hardcode the known news article until we create a dynamic system
        const newsData = [
            {
                id: 'la_tunisie_postmoderne',
                title: 'J-1 : La Tunisie Post Moderne',
                date: '31 Mai 2024',
                location: 'Église Sainte Croix de Tunis, Médina',
                content: `Il s'agit d'un projet artistique qui réunit 28 Photographes Tunisiens avec des parcours et univers différents autour de 53 œuvres photographiques numériques. Vous allez découvrir une Tunisie sous ses différentes facettes avec des regards aussi différents que le changement d'un pays qui se questionne, se cherche, se déconstruit…`,
                images: [
                    'news/la_tunisie_postmoderne/501446282_10238227470369775_1870603491074280546_n.jpg',
                    'news/la_tunisie_postmoderne/502911955_10238227466929689_3131729391437451076_n.jpg'
                ],
                excerpt: 'Un projet artistique qui réunit 28 Photographes Tunisiens avec des parcours et univers différents autour de 53 œuvres photographiques numériques.'
            }
        ];
        
        return newsData;
    } catch (error) {
        console.error('Error loading news articles:', error);
        return [];
    }
}

// Function to create a news item element
function createNewsItem(article) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    // Use the first image as the featured image
    const featuredImage = article.images && article.images.length > 0 ? article.images[0] : 'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
    
    newsItem.innerHTML = `
        <div class="news-item-image">
            <img src="${featuredImage}" alt="${article.title}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'">
        </div>
        <div class="news-item-content">
            <div class="news-item-date">${article.date}</div>
            <h3 class="news-item-title">${article.title}</h3>
            <p class="news-item-excerpt">${article.excerpt}</p>
            <div class="news-item-footer">
                <span class="news-item-location">${article.location}</span>
                <a href="#" class="news-item-read-more" data-news-id="${article.id}">Read More</a>
            </div>
        </div>
    `;
    
    // Add click event to the news item
    newsItem.addEventListener('click', (e) => {
        if (!e.target.classList.contains('news-item-read-more')) {
            openNewsArticle(article);
        }
    });
    
    // Add click event to the read more link
    const readMoreLink = newsItem.querySelector('.news-item-read-more');
    readMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openNewsArticle(article);
    });
    
    return newsItem;
}

// Function to open a news article in a modal or new page
function openNewsArticle(article) {
    // Create a modal to display the full article
    const modal = document.createElement('div');
    modal.className = 'news-modal';
    modal.innerHTML = `
        <div class="news-modal-content">
            <div class="news-modal-header">
                <span class="news-modal-close">&times;</span>
            </div>
            <div class="news-modal-body">
                <div class="news-modal-date">${article.date}</div>
                <h1 class="news-modal-title">${article.title}</h1>
                <div class="news-modal-location">${article.location}</div>
                <div class="news-modal-images">
                    ${article.images.map(img => `
                        <img src="${img}" alt="${article.title}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'">
                    `).join('')}
                </div>
                <div class="news-modal-text">
                    <p>${article.content}</p>
                    ${article.fullContent ? `<p>${article.fullContent}</p>` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.news-modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Function to load and display news articles
async function displayNewsArticles() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    
    const articles = await loadNewsArticles();
    
    if (articles.length === 0) {
        newsGrid.innerHTML = '<p>No news articles available at the moment.</p>';
        return;
    }
    
    newsGrid.innerHTML = '';
    articles.forEach(article => {
        const newsItem = createNewsItem(article);
        newsGrid.appendChild(newsItem);
    });
}

// Function to get the first image from a folder
const getFirstImageFromFolder = (folder) => {
    // First check special folders
    if (specialFolders[folder]) {
        return specialFolders[folder].thumbnail;
    }
    
    // Then check imageData
    if (imageData.firstImages && imageData.firstImages[folder]) {
        return imageData.firstImages[folder];
    }
    
    // Fallback to hardcoded values if data not available
    const folderImages = {
        'about_me': 'images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg',
        'kerkennah': 'images/kerkennah/2e35b71e-0194-4a6a-bed9-aa76d319a115.jpeg',
        'al_ziyara': 'images/al_ziyara/32da94df-18d2-4ef2-aa8e-9ee834cc8253.jpeg',
        'jmc': 'images/jmc/f860521e-6d57-40a7-a381-1580ea80e5f7.jpeg',
        'inde': 'images/inde/b51ca394-5fd8-4184-b7ba-60ae4de0f0d8.jpeg',
        'traversee': 'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
        'kairouan': 'images/kairouan/d532f891-1979-4077-b55a-77deacdf7cc8.jpeg',
        'bab_bhar': 'images/bab_bhar/e4990f37-30f0-436d-8d11-ac1e12f78ffd.jpeg',
        'bab_el_falla': 'images/bab_el_falla/e86571d5-3cca-4fbd-8ea3-2855aac56229.jpeg',
        'mouhit': 'images/mouhit/a7046275-b722-417a-9a20-2b29d8496a0f.jpeg',
        'cathedrale': 'images/cathedrale/60d5d1d6-395d-435b-83e7-9fe37dcfd675.jpeg',
        'bizerte': 'images/bizerte/f498c6e7-2035-443c-be1c-f2c550f4cb63.jpeg', // Add first image from Bizerte folder
        'la_goulette': 'images/la_goulette/thumbnail-1.jpg',
        'zaghouan': 'images/zaghouan/thumbnail.jpg',
        'l\'oiseau_a_sidibou': 'images/l\'oiseau_a_sidibou/IMG_7525.jpeg',
        'home': 'images/zaghouan/thumbnail.jpg'
    };
    
    return folderImages[folder] || placeholderImage;
};

// Fallback captions (used if image-data.json can't be loaded)
const fallbackCaptions = {
    'kerkennah': `في بحر حبك تستريح قواربي    
وتعوم فوق صفائه اشجاني 
فأنا اذا ما مرّ طيفُك عابراً 
أنسى هموماً لم تكن تنساني

مولانا جلال الدين الرومي

Kerkennah Janvier 2025`,
    'inde': `‎عندما تلج دائرة الحب، تكون اللغة التي نعرفها قد عفى عليها الزمن، فالشيء الذي لا يمكن التعبير عنه بكلمات، لا يمكن إدراكه إلا بالصمت.

‎- شمس التبريزي

Cathédrale Saint Vincent de Tunis 
16-05-2025 Tunis 

SPECTACLE DE L'AMOUR ET LA PAIX`,
    'jmc': `"قد تنظر لما أنظر، ولكنك لا ترى ما أرى..."
- أرسطو

Journées musicales de Carthage 2025`,
    'al_ziyara': `‎عندما تلج دائرة الحب، تكون اللغة التي نعرفها قد عفى عليها الزمن، فالشيء الذي لا يمكن التعبير عنه بكلمات، لا يمكن إدراكه إلا بالصمت.

‎- شمس التبريزي

Cathédrale Saint Vincent de Tunis 
16-05-2025 Tunis 

SPECTACLE DE L'AMOUR ET LA PAIX`,
    'bab_bhar': `Virée hivernale à Bab Bhar….

‎لا تدع قلبك يصدأ بالأسى، ولا تبقَ طويلًا مع الغائبة قلوبهم

‎– جلال الدين الرومي

7 février 2025`,
    'traversee': `‎لا تسرف في التواضع ، فهو يفقد الناس القدرة على رؤية الحدود.

‎-جلال الدين الرومي

Traversée ……

Loud 'El Mouhit'
Sfax-Kerkennah 

Janvier 2025`,
    'kairouan': `Sortie photographique Kairouan Janvier 2025 avec Club Photo de Tunis

Fragments de vie ….`,
    'bab_el_falla': `‎دع روحك تجذبك بصمتٍ إلى ما تحبه، فإنها لن تُضلّك أبدًا.

‎- جلال الدين الرومي

Bab El Falla 
Ramadan 2025`,
    'mouhit': `"إن المرء مع من لا يفهمه سجين." 

 شمس الدين التبريزي 

📸Wassila Mestiri 
Loud Al Mouhit Avril 2025‎`,
    'cathedrale': `‎عندما تلج دائرة الحب، تكون اللغة التي نعرفها قد عفى عليها الزمن، فالشيء الذي لا يمكن التعبير عنه بكلمات، لا يمكن إدراكه إلا بالصمت.

‎- شمس التبريزي

Cathédrale Saint Vincent de Tunis 
16-05-2025 Tunis 

SPECTACLE DE L'AMOUR ET LA PAIX`,
    'bizerte': `‎قفزة من جدار الصمت - بنزرت 12 ماي 2025

‎قفز شاب وظهره ملامس لحائط الزمن، ويداه مفتوحتان كجناحين يبحثان عن حرية و اخرج الاخرى راسه من الماء كولادة ثانية للحياة . ليس هذا مجرّد غطس في البحر، بل هو إعلان حياة، صرخة جسد يرفض أن يُحبس، يرفض أن يتقيد، يرفض أن يُنسى.
‎هذا البحر ليس فقط ماءً، بل ذاكرة، ونسيان، وهروب نحو الممكن.
‎الصورة ليست عن اللعب، بل عن الحلم، عن الشباب الذين ما زالوا يحاولون الطيران رغم الصعوبات`,
    'la_goulette': `A une passante hommage à Baudelaire - La goulette 2024`,
    'zaghouan': `كن أنت الشخصنة 
الذي تَودّ مُقابلته
– شمس التبريزي
Bakhta - Jougar - zaghouan - Tunisie juin 2024`,
    'l\'oiseau_a_sidibou': `"أتدري من الذي إذا علّمته الطيران طار
وعاد إليك؟ إنّهُ من وجد فيك حريّته."
جلال الدين الرومي`
};

// Function to get caption for a folder
const getFolderCaption = (folder) => {
    if (imageData.captions && imageData.captions[folder]) {
        return imageData.captions[folder];
    }
    return fallbackCaptions[folder] || '';
};

// Header scroll effect (throttled)
let headerScrollTimeout;
window.addEventListener('scroll', () => {
    // Skip scroll effects when menu is open (but don't prevent the event)
    if (document.body.classList.contains('menu-open')) {
        return;
    }
    
    if (headerScrollTimeout) {
        clearTimeout(headerScrollTimeout);
    }
    
    headerScrollTimeout = setTimeout(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 16); // ~60fps
}, { passive: true });

// Mobile menu toggle
let scrollPosition = 0;
let isMenuToggling = false;

function closeMenu() {
    if (isMenuToggling) return;
    isMenuToggling = true;
    
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Clear all body styles
    document.body.style.top = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.height = '';
    
    // Remove touch scroll prevention
    document.removeEventListener('touchmove', preventScroll);
    
    // Use requestAnimationFrame to ensure DOM updates before scrolling
    requestAnimationFrame(() => {
        // More gentle scroll restoration for mobile
        if (scrollPosition > 0) {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        }
        setTimeout(() => {
            isMenuToggling = false;
        }, 100);
    });
}

function openMenu() {
    if (isMenuToggling) return;
    isMenuToggling = true;
    
    scrollPosition = window.pageYOffset;
    nav.classList.add('active');
    menuToggle.classList.add('active');
    
    // More stable mobile menu positioning
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.height = '100%';
    document.body.classList.add('menu-open');
    
    // Prevent touch scrolling on mobile with better targeting
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    setTimeout(() => {
        isMenuToggling = false;
    }, 100);
}

function preventScroll(e) {
    // Only prevent scroll if the touch is not on the navigation menu itself
    if (!nav.contains(e.target)) {
        e.preventDefault();
    }
}

menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMenuToggling) return;
    
    const isMenuOpen = nav.classList.contains('active');
    
    if (!isMenuOpen) {
        openMenu();
    } else {
        closeMenu();
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (nav.classList.contains('active')) {
            closeMenu();
        }
        
        // Update active link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        e.target !== menuToggle && 
        !menuToggle.contains(e.target)) {
        closeMenu();
    }
});

// Update active link on scroll (throttled for better performance)
let scrollTimeout;
let isActiveScrolling = false;

window.addEventListener('scroll', () => {
    // Skip active link updates when menu is open
    if (document.body.classList.contains('menu-open')) {
        return;
    }
    
    // Prevent multiple scroll events from firing simultaneously
    if (isActiveScrolling) return;
    
    // Clear previous timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    isActiveScrolling = true;
    
    // Throttle scroll events to prevent excessive firing on mobile
    scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
        
        isActiveScrolling = false;
    }, 100); // Increased throttle for mobile stability
}, { passive: true });

// Load image data from JSON file
function loadImageData() {
    // Add cache busting parameter to prevent browser caching
    const cacheBuster = `?cache=${Date.now()}`;
    return fetch('image-data.json' + cacheBuster)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load image data');
            }
            return response.json();
        })
        .then(data => {
            imageData = data;
            console.log('Image data loaded successfully', imageData);
            return data;
        })
        .catch(error => {
            console.error('Error loading image data:', error);
            // Continue with fallback data
            return null;
        });
}

// Fetch and display images from folders
document.addEventListener('DOMContentLoaded', () => {
    // Load image data first, then initialize the UI
    loadImageData().then(() => {
        // Set the hero background image
        const heroSection = document.querySelector('.hero');
        heroSection.style.backgroundImage = `url('${getFirstImageFromFolder('home')}')`;
        
        // Set the full-width feature background image
        const featureSection = document.querySelector('.full-width-feature');
        featureSection.style.backgroundImage = `url('${specialFolders['about_me'].thumbnail}')`;
        
        // Load About Me images
        loadGalleryImages('about_me', document.querySelector('.about-gallery'));
        
        // Load Project thumbnails
        const projectsGallery = document.querySelector('.projects-gallery');
        projectFolders.forEach(folder => {
            createProjectThumbnail(folder, projectsGallery, false);
        });
        
        // Load Album thumbnails
        const albumsGrid = document.querySelector('.albums-grid');
        albumFolders.forEach(folder => {
            createProjectThumbnail(folder, albumsGrid, true);
        });
        
        // Load News articles
        displayNewsArticles();
        
        console.log('All thumbnails loaded successfully');
    });
});

// Filter project thumbnails
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Modal functionality (only for About Me section images)
function openModal(imgSrc, caption, gallery, index) {
    modal.style.display = 'block';
    modalImg.src = imgSrc;
    
    // Use folder caption if available
    if (caption.includes('caption.txt')) {
        const folder = imgSrc.split('/')[1]; // Get folder name from path
        modalCaption.innerHTML = getFolderCaption(folder).replace(/\n/g, '<br>') || caption;
    } else {
        modalCaption.textContent = caption || '';
    }
    
    // Store current gallery and index for navigation
    currentGallery = gallery || [];
    currentIndex = index || 0;
    
    // Update navigation buttons
    updateNavButtons();
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    
    // Enable body scroll
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        const { src, caption } = currentGallery[currentIndex];
        modalImg.src = src;
        
        // Update caption
        if (caption.includes('caption.txt')) {
            const folder = src.split('/')[1]; // Get folder name from path
            modalCaption.innerHTML = getFolderCaption(folder).replace(/\n/g, '<br>') || caption;
        } else {
            modalCaption.textContent = caption || '';
        }
        
        updateNavButtons();
    }
}

function showNextImage() {
    if (currentIndex < currentGallery.length - 1) {
        currentIndex++;
        const { src, caption } = currentGallery[currentIndex];
        modalImg.src = src;
        
        // Update caption
        if (caption.includes('caption.txt')) {
            const folder = src.split('/')[1]; // Get folder name from path
            modalCaption.innerHTML = getFolderCaption(folder).replace(/\n/g, '<br>') || caption;
        } else {
            modalCaption.textContent = caption || '';
        }
        
        updateNavButtons();
    }
}

function updateNavButtons() {
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'block' : 'none';
}

// Event listeners for modal
closeBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// Keyboard navigation for modal
window.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    }
});

// Touch swipe support for modal
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left, show next image
        showNextImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right, show previous image
        showPrevImage();
    }
}

// Helper function to load gallery images (for About Me section only)
function loadGalleryImages(folder, container, category = null) {
    if (folder !== 'about_me') return;
    let folderImages = [];
    if (specialFolders[folder]) {
        folderImages = specialFolders[folder].images;
        console.log(`Using special images for ${folder}:`, folderImages);
    } else {
        folderImages = (imageData.folders && imageData.folders[folder]) ? 
            imageData.folders[folder] : 
            ['images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg'];
    }
    
    if (folderImages.length === 0) {
        console.error('No images found for About Me section');
        return;
    }
    
    try {
        // First, check if the HTML document contains the correct structure
        const aboutSection = document.getElementById('about');
        if (!aboutSection) {
            throw new Error('Could not find the About section in the document');
        }
        
        console.log('About section found:', aboutSection);
        
        // Store the original HTML content
        const originalContent = container.innerHTML;
        console.log('Original container content:', originalContent);
        
        // Make sure we have the about-text-block INSIDE the container
        const originalTextBlock = container.querySelector('.about-text-block');
        console.log('Original text block inside container:', originalTextBlock);
        
        if (!originalTextBlock) {
            console.warn('Could not find .about-text-block in the container, trying to find it in the about section');
            // Fallback - look in the entire about section
            const textBlockInSection = aboutSection.querySelector('.about-text-block');
            
            if (!textBlockInSection) {
                throw new Error('Could not find .about-text-block anywhere in the About section');
            }
            
            console.log('Text block found in about section:', textBlockInSection);
            // If we found it in the section but not in the container, the structure might be different
            // Reconstruct the container with proper markup
            container.innerHTML = '';
            const textBlockClone = textBlockInSection.cloneNode(true);
            container.appendChild(textBlockClone);
        }
        
        // Now we should have the text block in the container
        const textBlock = container.querySelector('.about-text-block');
        if (!textBlock) {
            throw new Error('Still could not find .about-text-block after reconstruction');
        }
        
        // Get references to section header and main text
        const sectionHeader = textBlock.querySelector('.section-header');
        const mainText = textBlock.querySelector('.about-main-text');
        
        if (!sectionHeader || !mainText) {
            throw new Error('Could not find required elements in the About section');
        }
        
        console.log('Found all required elements:', {sectionHeader, mainText});
        
        // Style the container
        container.style.display = 'flex';
        container.style.gap = '2rem';
        container.style.padding = '2rem';
        container.style.background = 'none';
        
        // Create image element that will be added
        const aboutImageSrc = folderImages[0];
        const img = document.createElement('img');
        img.src = aboutImageSrc;
        img.alt = 'About Me';
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.borderRadius = '0';
        img.style.boxShadow = 'none';
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'about-image-block';
        imageContainer.style.display = 'flex';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.alignItems = 'center';
        imageContainer.appendChild(img);
        
        // Check if we're in mobile view
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            // Mobile Layout (Headers, Image, Text)
            
            // First, save the elements before clearing the container
            const sectionHeaderClone = sectionHeader.cloneNode(true);
            const mainTextClone = mainText.cloneNode(true);
            
            // Empty the container
            container.innerHTML = '';
            
            // Create header block for mobile
            const headerContainer = document.createElement('div');
            headerContainer.className = 'about-header-block';
            headerContainer.style.width = '100%';
            headerContainer.style.textAlign = 'left';
            headerContainer.style.marginBottom = '2rem';
            headerContainer.appendChild(sectionHeaderClone);
            
            // Create text block 
            const textContainer = document.createElement('div');
            textContainer.className = 'about-text-block';
            textContainer.style.textAlign = 'left';
            textContainer.style.width = '100%';
            textContainer.appendChild(mainTextClone);
            
            // Set mobile styling
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            
            imageContainer.style.maxWidth = '90%';
            imageContainer.style.marginBottom = '2rem';
            img.style.maxHeight = '350px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            
            // Add elements in the correct order for mobile
            container.appendChild(headerContainer);
            container.appendChild(imageContainer);
            container.appendChild(textContainer);
            
            // Style all paragraphs consistently
            const paragraphs = textContainer.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.fontFamily = "'Cormorant Garamond', serif";
                p.style.fontSize = p.classList.contains('featured') ? '1.2rem' : '1rem';
                p.style.lineHeight = '1.7';
                p.style.marginBottom = '0.75em';
                if (p.classList.contains('featured')) {
                    p.style.fontStyle = 'italic';
                    p.style.color = '#111';
                } else {
                    p.style.color = '#333';
                }
            });
        } else {
            // Desktop Layout (Side by side)
            
            // Position the image container
            imageContainer.style.flex = '0 1 38%';
            imageContainer.style.maxWidth = '38%';
            img.style.maxHeight = '500px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            
            // Style the text block for desktop
            textBlock.style.flex = '0 1 58%';
            textBlock.style.maxWidth = '58%';
            textBlock.style.textAlign = 'left';
            
            // Style all paragraphs consistently
            const paragraphs = textBlock.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.fontFamily = "'Cormorant Garamond', serif";
                p.style.fontSize = p.classList.contains('featured') ? '1.4rem' : '1.2rem';
                p.style.lineHeight = '1.8';
                p.style.marginBottom = '0.75em';
                if (p.classList.contains('featured')) {
                    p.style.fontStyle = 'italic';
                    p.style.color = '#111';
                } else {
                    p.style.color = '#333';
                }
            });
            
            // Setup container for desktop layout
            container.style.flexDirection = 'row';
            container.style.justifyContent = 'space-between';
            container.style.alignItems = 'center';
            
            // Add the image container (text block is already in the DOM)
            container.appendChild(imageContainer);
        }
        
        // Remove automatic page reload on resize to prevent mobile refresh issues
        // The CSS media queries will handle responsive layout changes
        
        console.log('Successfully set up About Me section');
        
    } catch (error) {
        console.error('Error setting up About Me section:', error);
        // We'll create a simple fallback layout
        createFallbackAboutSection(container, folderImages[0]);
    }
}

// Fallback function to ensure the About section always appears
function createFallbackAboutSection(container, imageSrc) {
    console.log('Creating fallback About section');
    
    // Get the about section
    const aboutSection = document.getElementById('about');
    if (!aboutSection) {
        console.error('Cannot create fallback - About section not found');
        return;
    }
    
    // Get the container inside the about section
    const aboutContainer = aboutSection.querySelector('.container');
    if (!aboutContainer) {
        console.error('Cannot create fallback - Container not found in About section');
        return;
    }
    
    // Clear and recreate the container's content
    container.innerHTML = '';
    
    // Create a simple structure with image and text
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = '<h2>About Me</h2><p class="subtitle">Capturing authentic moments through a unique lens</p>';
    
    // Create text content
    const textContent = document.createElement('div');
    textContent.className = 'about-main-text';
    textContent.innerHTML = `
        <p class="featured">Welcome to my portfolio. I am Wassila Mestiri, a contemporary photographer focusing on capturing life's authentic moments and creating visual narratives that speak to the soul.</p>
        <p>Through my work, I seek to explore the boundaries between reality and artistic expression, creating images that evoke emotion and tell stories. Each photograph is a careful composition of light, moment, and emotion.</p>
        <p>My photography journey has taken me through diverse landscapes and cultures, always searching for that perfect blend of authenticity and aesthetic.</p>
    `;
    
    // Create image
    const img = document.createElement('img');
    img.src = imageSrc || 'images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg';
    img.alt = 'About Me';
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    img.style.maxHeight = isMobile ? '350px' : '500px';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.margin = isMobile ? '2rem auto' : '0 auto';
    
    // Create the containers
    container.style.display = 'flex';
    container.style.flexDirection = isMobile ? 'column' : 'row';
    container.style.alignItems = 'center';
    container.style.gap = '2rem';
    container.style.padding = '2rem';
    
    // Create text block that will contain header and text
    const textBlock = document.createElement('div');
    textBlock.className = 'about-text-block';
    textBlock.style.flex = isMobile ? '1 1 100%' : '0 1 58%';
    textBlock.style.maxWidth = isMobile ? '100%' : '58%';
    textBlock.style.textAlign = 'left';
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'about-image-block';
    imageContainer.style.flex = isMobile ? '1 1 100%' : '0 1 38%';
    imageContainer.style.maxWidth = isMobile ? '90%' : '38%';
    imageContainer.style.display = 'flex';
    imageContainer.style.justifyContent = 'center';
    imageContainer.style.alignItems = 'center';
    
    // Assemble the components
    textBlock.appendChild(header);
    textBlock.appendChild(textContent);
    imageContainer.appendChild(img);
    
    if (isMobile) {
        // Mobile order: header, image, text
        const headerOnly = document.createElement('div');
        headerOnly.className = 'about-header-block';
        headerOnly.style.width = '100%';
        headerOnly.style.marginBottom = '1.5rem';
        headerOnly.appendChild(header);
        
        const textOnly = document.createElement('div');
        textOnly.className = 'about-text-block';
        textOnly.style.width = '100%';
        textOnly.appendChild(textContent);
        
        container.appendChild(headerOnly);
        container.appendChild(imageContainer);
        container.appendChild(textOnly);
    } else {
        // Desktop: side-by-side
        container.appendChild(textBlock);
        container.appendChild(imageContainer);
    }
    
    // Style paragraphs
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.style.fontFamily = "'Cormorant Garamond', serif";
        if (p.classList.contains('featured')) {
            p.style.fontSize = isMobile ? '1.2rem' : '1.4rem';
            p.style.fontStyle = 'italic';
            p.style.color = '#111';
        } else if (p.classList.contains('subtitle')) {
            // Style for subtitle
            p.style.fontSize = '1.1rem';
            p.style.color = '#777';
            p.style.fontWeight = '400';
        } else {
            p.style.fontSize = isMobile ? '1rem' : '1.2rem';
            p.style.color = '#333';
        }
        p.style.lineHeight = isMobile ? '1.7' : '1.8';
        p.style.marginBottom = '0.75em';
    });
    
    console.log('Fallback About section created successfully');
}

// Helper function to create a gallery item (for About Me section)
function createGalleryItem(imgSrc, folder, container, category, gallery, index) {
    // Create gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    if (category) {
        galleryItem.setAttribute('data-category', category);
    }
    
    // Create image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = formatFolderName(folder);
    img.onerror = () => { img.src = placeholderImage; }; // Fallback on error
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = formatFolderName(folder);
    
    // Add caption preview if available
    const caption = getFolderCaption(folder);
    if (caption) {
        const captionPreview = document.createElement('p');
        captionPreview.textContent = caption.split('\n')[0]; // Just show the first line
        overlay.appendChild(captionPreview);
    }
    
    // Append elements
    overlay.appendChild(titleElement);
    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    
    // Add to gallery array for modal navigation
    gallery.push({ src: imgSrc, caption: folder + '/caption.txt' });
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => {
        openModal(imgSrc, folder + '/caption.txt', gallery, index);
    });
    
    // Add to container
    container.appendChild(galleryItem);
}

// Create a project or album thumbnail with link to individual page
function createProjectThumbnail(folder, container, isAlbum = false) {
    // Get first image from folder or use placeholder
    let imgSrc;
    
    // Check if this is a special folder with hardcoded paths
    if (specialFolders[folder]) {
        imgSrc = specialFolders[folder].thumbnail;
        console.log(`Using special thumbnail for ${folder}: ${imgSrc}`);
    }
    // Use imageData first image if available (from JSON file)
    else if (imageData.firstImages && imageData.firstImages[folder]) {
        imgSrc = imageData.firstImages[folder];
        console.log(`Using JSON image for ${folder}: ${imgSrc}`);
    } else {
        // Otherwise fall back to hardcoded path
        imgSrc = getFirstImageFromFolder(folder);
        console.log(`Using fallback image for ${folder}: ${imgSrc}`);
    }
    
    const title = formatFolderName(folder);
    
    // Create item
    const item = document.createElement('div');
    item.className = isAlbum ? 'album-item' : 'gallery-item';
    if (!isAlbum) {
        item.setAttribute('data-category', folder);
    }
    
    // Create image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    img.onerror = () => { 
        console.error(`Failed to load image: ${imgSrc}`);
        img.src = placeholderImage; 
    };
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = isAlbum ? 'album-item-overlay' : 'gallery-item-overlay';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    // Add caption preview if available
    const caption = getFolderCaption(folder);
    if (caption) {
        const captionPreview = document.createElement('p');
        captionPreview.textContent = caption.split('\n')[0]; // Just show the first line
        overlay.appendChild(captionPreview);
    }
    
    // Append elements
    overlay.appendChild(titleElement);
    item.appendChild(img);
    item.appendChild(overlay);
    
    // Add click event to navigate to project/album page
    item.addEventListener('click', () => {
        window.location.href = `project-template.html?project=${folder}&type=${isAlbum ? 'album' : 'project'}`;
    });
    
    // Add to container
    container.appendChild(item);
}

// Helper function to format folder names for display
function formatFolderName(folder) {
    // Special case for l'oiseau_a_sidibou
    if (folder === 'l\'oiseau_a_sidibou') {
        return 'L\'Oiseau à SidiBou';
    }
    
    // Replace underscores with spaces and capitalize first letter of each word
    return folder
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real implementation, this would submit the form to a server
        // For this example, we'll just show a success message
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }, 500);
    });
}

// Smooth scrolling for navigation links
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

// Create a special function to create the traversée album thumbnail
function createTraverseeAlbumThumbnail(container) {
    // Hardcode the correct image path for traversée
    const imgSrc = 'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg';
    const title = 'Traversée';
    
    console.log('Creating traversée thumbnail with hardcoded path:', imgSrc);
    
    // Create item
    const item = document.createElement('div');
    item.className = 'album-item';
    
    // Create image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    img.onerror = () => { 
        console.error(`Failed to load traversée image: ${imgSrc}`);
        img.src = placeholderImage; 
    };
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'album-item-overlay';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    // Add caption preview if available
    const caption = getFolderCaption('traversee') || 'Traversée';
    if (caption) {
        const captionPreview = document.createElement('p');
        captionPreview.textContent = caption.split('\n')[0]; // Just show the first line
        overlay.appendChild(captionPreview);
    }
    
    // Append elements
    overlay.appendChild(titleElement);
    item.appendChild(img);
    item.appendChild(overlay);
    
    // Add click event to navigate to project/album page
    item.addEventListener('click', () => {
        window.location.href = `project-template.html?project=traversee&type=album`;
    });
    
    // Add to container
    container.appendChild(item);
} 