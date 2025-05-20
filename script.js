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
const projectFolders = ['kerkennah', 'al_ziyara', 'jmc'];
// All other folders except home, logo, and about_me will be albums
const albumFolders = ['traversee', 'kairouan', 'inde', 'bab_bhar', 'bab_el_falla', 'mouhit', 'cathedrale'];

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
        'traversee': 'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
        'kairouan': 'images/kairouan/d532f891-1979-4077-b55a-77deacdf7cc8.jpeg',
        'inde': 'images/inde/b51ca394-5fd8-4184-b7ba-60ae4de0f0d8.jpeg',
        'bab_bhar': 'images/bab_bhar/e4990f37-30f0-436d-8d11-ac1e12f78ffd.jpeg',
        'bab_el_falla': 'images/bab_el_falla/e86571d5-3cca-4fbd-8ea3-2855aac56229.jpeg',
        'mouhit': 'images/mouhit/a7046275-b722-417a-9a20-2b29d8496a0f.jpeg',
        'cathedrale': 'images/cathedrale/60d5d1d6-395d-435b-83e7-9fe37dcfd675.jpeg',
        'home': 'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'
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

SPECTACLE DE L'AMOUR ET LA PAIX`
};

// Function to get caption for a folder
const getFolderCaption = (folder) => {
    if (imageData.captions && imageData.captions[folder]) {
        return imageData.captions[folder];
    }
    return fallbackCaptions[folder] || '';
};

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    // Prevent body scrolling when menu is open
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        
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
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Update active link on scroll
window.addEventListener('scroll', () => {
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
});

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
    if (folderImages.length > 0) {
        // Style the main container (.about-gallery)
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.gap = '2rem'; 
        container.style.padding = '2rem'; 
        container.style.background = 'none';
        
        // Use media queries to make layout responsive
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            // Mobile layout
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
        } else {
            // Desktop layout
            container.style.flexDirection = 'row';
            container.style.alignItems = 'center';
        }

        // Style the text block (assuming it's the first child of container)
        const textBlock = container.children[0];
        if (textBlock && textBlock.classList.contains('about-text-block')) {
            if (isMobile) {
                // Mobile text block styling
                textBlock.style.flex = '1 1 100%';
                textBlock.style.maxWidth = '100%';
                textBlock.style.order = '1'; // Text first on mobile
                textBlock.style.marginBottom = '2rem';
            } else {
                // Desktop text block styling
                textBlock.style.flex = '0 1 58%'; 
                textBlock.style.maxWidth = '58%';
                textBlock.style.order = '0';
                textBlock.style.marginBottom = '0';
            }
            textBlock.style.textAlign = 'left';
        } else {
            console.warn('Could not find .about-text-block as the first child of .about-gallery');
        }

        // Remove any previous image container to avoid duplicates
        const oldImageBlock = container.querySelector('.about-image-block');
        if (oldImageBlock) oldImageBlock.remove();

        // Create image container block
        const imageContainer = document.createElement('div');
        imageContainer.className = 'about-image-block';
        
        if (isMobile) {
            // Mobile image container styling
            imageContainer.style.flex = '1 1 100%';
            imageContainer.style.maxWidth = '90%';
            imageContainer.style.order = '0'; // Image first on mobile
        } else {
            // Desktop image container styling
            imageContainer.style.flex = '0 1 38%'; 
            imageContainer.style.maxWidth = '38%';
            imageContainer.style.order = '1';
        }
        
        imageContainer.style.display = 'flex';
        imageContainer.style.justifyContent = 'center'; 
        imageContainer.style.alignItems = 'center';

        // Create and style the image
        const aboutImageSrc = folderImages[0];
        const img = document.createElement('img');
        img.src = aboutImageSrc;
        img.alt = 'About Me';
        img.style.maxWidth = '100%'; 
        img.style.maxHeight = isMobile ? '350px' : '500px'; 
        img.style.width = 'auto';   
        img.style.height = 'auto';   
        img.style.display = 'block';
        img.style.borderRadius = '0'; 
        img.style.boxShadow = 'none';

        imageContainer.appendChild(img);
        container.appendChild(imageContainer);

        // Add resize event listener to handle orientation changes
        window.addEventListener('resize', function() {
            const isNowMobile = window.matchMedia('(max-width: 768px)').matches;
            
            if (isNowMobile) {
                // Update to mobile layout
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                
                textBlock.style.flex = '1 1 100%';
                textBlock.style.maxWidth = '100%';
                textBlock.style.order = '1';
                textBlock.style.marginBottom = '2rem';
                
                imageContainer.style.flex = '1 1 100%';
                imageContainer.style.maxWidth = '90%';
                imageContainer.style.order = '0';
                
                img.style.maxHeight = '350px';
            } else {
                // Update to desktop layout
                container.style.flexDirection = 'row';
                container.style.alignItems = 'center';
                
                textBlock.style.flex = '0 1 58%';
                textBlock.style.maxWidth = '58%';
                textBlock.style.order = '0';
                textBlock.style.marginBottom = '0';
                
                imageContainer.style.flex = '0 1 38%';
                imageContainer.style.maxWidth = '38%';
                imageContainer.style.order = '1';
                
                img.style.maxHeight = '500px';
            }
        });

        console.log(`Created About Me layout with image: ${aboutImageSrc}`);
    } else {
        // Fallback for no images
        const img = document.createElement('img');
        img.src = placeholderImage;
        img.alt = 'About Me';
        img.style.width = '50%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        container.appendChild(img);
        console.log(`No images found for About Me, using placeholder`);
    }
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