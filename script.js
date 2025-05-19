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
const albumFolders = ['traversée', 'kairouan', 'inde', 'bab_bhar', 'bab_el_falla', 'mouhit', 'cathédrale'];

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

// Function to get the first image from a folder
const getFirstImageFromFolder = (folder) => {
    if (imageData.firstImages && imageData.firstImages[folder]) {
        return imageData.firstImages[folder];
    }
    
    // Fallback to hardcoded values if data not available
    const folderImages = {
        'about_me': ['images/about_me/d4334420-4f6f-4d92-b930-12f804d88e9b.jpeg'],
        'kerkennah': ['images/kerkennah/2e35b71e-0194-4a6a-bed9-aa76d319a115.jpeg'],
        'al_ziyara': ['images/al_ziyara/32da94df-18d2-4ef2-aa8e-9ee834cc8253.jpeg'],
        'jmc': ['images/jmc/f860521e-6d57-40a7-a381-1580ea80e5f7.jpeg'],
        'traversée': ['images/traversée/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'],
        'kairouan': ['images/kairouan/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'],
        'inde': ['images/inde/b51ca394-5fd8-4184-b7ba-60ae4de0f0d8.jpeg'],
        'bab_bhar': ['images/bab_bhar/e4990f37-30f0-436d-8d11-ac1e12f78ffd.jpeg'],
        'bab_el_falla': ['images/bab_el_falla/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'],
        'mouhit': ['images/mouhit/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'],
        'cathédrale': ['images/cathédrale/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'],
        'home': ['images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg']
    };
    
    // Ensure every folder has a defined image
    if (!folderImages[folder] || folderImages[folder].length === 0) {
        // Define default images for any missing folders
        if (folder === 'traversée') {
            return 'images/traversée/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
        } else if (folder === 'kairouan') {
            return 'images/kairouan/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
        } else if (folder === 'inde') {
            return 'images/inde/b51ca394-5fd8-4184-b7ba-60ae4de0f0d8.jpeg';
        } else if (folder === 'bab_bhar') {
            return 'images/bab_bhar/e4990f37-30f0-436d-8d11-ac1e12f78ffd.jpeg';
        } else if (folder === 'bab_el_falla') {
            return 'images/bab_el_falla/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
        } else if (folder === 'mouhit') {
            return 'images/mouhit/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
        } else if (folder === 'cathédrale') {
            return 'images/cathédrale/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';
        } else if (folder === 'al_ziyara') {
            return 'images/al_ziyara/32da94df-18d2-4ef2-aa8e-9ee834cc8253.jpeg';
        } else if (folder === 'jmc') {
            return 'images/jmc/f860521e-6d57-40a7-a381-1580ea80e5f7.jpeg';
        } else if (folder === 'kerkennah') {
            return 'images/kerkennah/2e35b71e-0194-4a6a-bed9-aa76d319a115.jpeg';
        }
        
        return placeholderImage;
    }
    
    return folderImages[folder][0];
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
    'jmc': `JMC Project

A visual exploration of contemporary spaces.
2025`,
    'al_ziyara': `The Pilgrimage

A journey through sacred spaces and spiritual moments.
2025`,
    'bab_bhar': `Bab Bhar

The ancient gateway to the Mediterranean.
2025`,
    'traversée': `Traversée

A journey across waters and cultures.
2024`,
    'kairouan': `Kairouan

The holy city's texture and light.
2024`,
    'bab_el_falla': `Bab El Falla

Exploring the historic gateway and its surroundings.
2025`,
    'mouhit': `Mouhit

The ocean's endless horizon and rhythms.
2025`,
    'cathédrale': `Cathédrale Saint Vincent de Tunis

Light and shadows in a sacred space.
2025`
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
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        
        // Update active link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
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
    return fetch('image-data.json')
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
        featureSection.style.backgroundImage = `url('${getFirstImageFromFolder('about_me')}')`;
        
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

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation for modal
window.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Helper function to load gallery images (for About Me section only)
function loadGalleryImages(folder, container, category = null) {
    // Only used for the About Me section now
    if (folder !== 'about_me') return;
    
    // Get image paths for this folder from imageData or fallback
    const folderImages = (imageData.folders && imageData.folders[folder]) ? 
        imageData.folders[folder] : 
        ['images/about_me/d4334420-4f6f-4d92-b930-12f804d88e9b.jpeg', 'images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg'];
    
    const gallery = [];
    
    // If no images found in the folder, use placeholder
    if (folderImages.length === 0) {
        // Create a single item with placeholder image
        createGalleryItem(placeholderImage, folder, container, category, gallery, 0);
        return;
    }
    
    // Load actual images from the folder
    folderImages.forEach((imgSrc, index) => {
        createGalleryItem(imgSrc, folder, container, category, gallery, index);
    });
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
    const imgSrc = getFirstImageFromFolder(folder);
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
    img.onerror = () => { img.src = placeholderImage; }; // Fallback on error
    
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