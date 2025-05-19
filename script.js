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

// Actual image paths from the directories
const imagePaths = {
    'about_me': [
        'images/about_me/d4334420-4f6f-4d92-b930-12f804d88e9b.jpeg',
        'images/about_me/fa4f3caa-1226-47d4-8e5b-51d49104fa0d.jpeg'
    ],
    'kerkennah': [
        'images/kerkennah/2e35b71e-0194-4a6a-bed9-aa76d319a115.jpeg',
        'images/kerkennah/c91b8969-d913-467a-8a28-41f8141780c6.jpeg',
        'images/kerkennah/bab24639-2215-4637-b774-bbd9d442031b.jpeg',
        'images/kerkennah/ea809cbc-867c-4cd7-9ca7-206f036b2abc.jpeg',
        'images/kerkennah/fced7c47-2ab1-4d28-9964-2add7e3f7721.jpeg'
    ],
    'inde': [
        'images/inde/b51ca394-5fd8-4184-b7ba-60ae4de0f0d8.jpeg',
        'images/inde/fbcd7b66-c2d3-4600-a429-6b24cd25107b.jpeg',
        'images/inde/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'
    ],
    'home': [
        'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'
    ]
};

// Captions for each folder
const folderCaptions = {
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

SPECTACLE DE L'AMOUR ET LA PAIX`
};

// For folders without actual images, we'll reuse the home image for display purposes
const placeholderImage = 'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg';

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

// Fetch and display images from folders
document.addEventListener('DOMContentLoaded', () => {
    // Set the hero background image
    const heroSection = document.querySelector('.hero');
    if (imagePaths.home && imagePaths.home.length > 0) {
        heroSection.style.backgroundImage = `url('${imagePaths.home[0]}')`;
    }
    
    // Set the full-width feature background image (using one of the about_me images if available)
    const featureSection = document.querySelector('.full-width-feature');
    if (imagePaths.about_me && imagePaths.about_me.length > 0) {
        featureSection.style.backgroundImage = `url('${imagePaths.about_me[0]}')`;
    } else {
        featureSection.style.backgroundImage = `url('${placeholderImage}')`;
    }
    
    // Load About Me images
    loadGalleryImages('about_me', document.querySelector('.about-gallery'));
    
    // Load Project images
    const projectsGallery = document.querySelector('.projects-gallery');
    projectFolders.forEach(folder => {
        loadGalleryImages(folder, projectsGallery, folder);
    });
    
    // Load Album thumbnails
    const albumsGrid = document.querySelector('.albums-grid');
    albumFolders.forEach(folder => {
        createAlbumThumbnail(folder, albumsGrid);
    });
});

// Filter project images
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

// Modal functionality
function openModal(imgSrc, caption, gallery, index) {
    modal.style.display = 'block';
    modalImg.src = imgSrc;
    
    // Use folder caption if available
    if (caption.includes('caption.txt')) {
        const folder = imgSrc.split('/')[1]; // Get folder name from path
        modalCaption.innerHTML = folderCaptions[folder] ? folderCaptions[folder].replace(/\n/g, '<br>') : caption;
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
            modalCaption.innerHTML = folderCaptions[folder] ? folderCaptions[folder].replace(/\n/g, '<br>') : caption;
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
            modalCaption.innerHTML = folderCaptions[folder] ? folderCaptions[folder].replace(/\n/g, '<br>') : caption;
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

// Helper function to load gallery images
function loadGalleryImages(folder, container, category = null) {
    // Get image paths for this folder, or use placeholder
    const folderImages = imagePaths[folder] || [];
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

// Helper function to create a gallery item
function createGalleryItem(imgSrc, folder, container, category, gallery, index) {
    // Use caption from caption.txt if available
    const captionFile = `${folder}/caption.txt`;
    
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
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = formatFolderName(folder);
    
    // Add caption preview if available
    if (folderCaptions[folder]) {
        const captionPreview = document.createElement('p');
        captionPreview.textContent = folderCaptions[folder].split('\n')[0]; // Just show the first line
        overlay.appendChild(captionPreview);
    }
    
    // Append elements
    overlay.appendChild(titleElement);
    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    
    // Add to gallery array for modal navigation
    gallery.push({ src: imgSrc, caption: captionFile });
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => {
        openModal(imgSrc, captionFile, gallery, index);
    });
    
    // Add to container
    container.appendChild(galleryItem);
}

// Helper function to create album thumbnails
function createAlbumThumbnail(folder, container) {
    // Get first image from folder or use placeholder
    const imgSrc = (imagePaths[folder] && imagePaths[folder][0]) || placeholderImage;
    const title = formatFolderName(folder);
    
    // Create album item
    const albumItem = document.createElement('div');
    albumItem.className = 'album-item';
    
    // Create image
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'album-item-overlay';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    // Add caption preview if available
    if (folderCaptions[folder]) {
        const captionPreview = document.createElement('p');
        captionPreview.textContent = folderCaptions[folder].split('\n')[0]; // Just show the first line
        overlay.appendChild(captionPreview);
    }
    
    // Append elements
    overlay.appendChild(titleElement);
    albumItem.appendChild(img);
    albumItem.appendChild(overlay);
    
    // Add click event to open album
    albumItem.addEventListener('click', () => {
        openAlbum(folder);
    });
    
    // Add to container
    container.appendChild(albumItem);
}

// Function to open an album
function openAlbum(folder) {
    // Hide the projects filter
    document.querySelector('.projects-filters').style.display = 'none';
    
    // Clear projects gallery
    const projectsGallery = document.querySelector('.projects-gallery');
    projectsGallery.innerHTML = '';
    
    // Load album images
    loadGalleryImages(folder, projectsGallery);
    
    // Scroll to projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    
    // Update section title
    document.querySelector('.projects h2').textContent = formatFolderName(folder);
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