// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');
const projectTitle = document.querySelector('.project-title');
const projectSubtitle = document.querySelector('.project-subtitle');
const projectDescription = document.getElementById('project-description');
const projectGallery = document.getElementById('project-gallery');
const backToAllBtn = document.getElementById('back-to-all');
const projectHero = document.querySelector('.project-hero');

// Get project folder from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const projectFolder = urlParams.get('project');
const isAlbum = urlParams.get('type') === 'album';

// Captions for each folder (will be loaded from the server in a real implementation)
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

// Project images (will be loaded from the server in a real implementation)
const projectImages = {
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
    });
});

// Initialize project page
document.addEventListener('DOMContentLoaded', () => {
    if (projectFolder) {
        initProjectPage(projectFolder);
    } else {
        // Redirect to home if no project specified
        window.location.href = 'index.html';
    }
    
    // Set back button link
    backToAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAlbum) {
            window.location.href = 'index.html#albums';
        } else {
            window.location.href = 'index.html#projects';
        }
    });
    backToAllBtn.textContent = isAlbum ? 'Back to All Albums' : 'Back to All Projects';
});

// Initialize project page
function initProjectPage(folder) {
    // Set page title and subtitle
    const formattedTitle = formatFolderName(folder);
    document.title = `${formattedTitle} | Wassila Mestiri Photography`;
    projectTitle.textContent = formattedTitle;
    
    // Extract location and date information if available in the caption
    if (folderCaptions[folder]) {
        const captionLines = folderCaptions[folder].split('\n');
        const locationLine = captionLines.find(line => 
            !line.startsWith('‎') && !line.match(/^[\u0600-\u06FF]/) && line.trim() !== ''
        );
        if (locationLine) {
            projectSubtitle.textContent = locationLine.trim();
        }
    }
    
    // Set hero background image
    if (projectImages[folder] && projectImages[folder].length > 0) {
        projectHero.style.backgroundImage = `url('${projectImages[folder][0]}')`;
    } else {
        projectHero.style.backgroundImage = `url('images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg')`;
    }
    
    // Set project description
    if (folderCaptions[folder]) {
        // Determine if caption contains Arabic text
        const hasArabic = /[\u0600-\u06FF]/.test(folderCaptions[folder]);
        if (hasArabic) {
            projectDescription.setAttribute('lang', 'ar');
        }
        
        // Format the caption with paragraphs
        const formattedCaption = folderCaptions[folder]
            .split('\n\n')
            .map(para => para.trim())
            .filter(para => para !== '')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');
        
        projectDescription.innerHTML = formattedCaption;
    } else {
        projectDescription.innerHTML = `<p>Explore this visual journey through ${formattedTitle}.</p>`;
    }
    
    // Load project images
    loadProjectImages(folder);
}

// Load project images with alternating layout
function loadProjectImages(folder) {
    const images = projectImages[folder] || [];
    
    if (images.length === 0) {
        projectGallery.innerHTML = '<p class="no-images">No images available for this project.</p>';
        return;
    }
    
    // Split caption into parts for each image
    const captionParts = splitCaptionForImages(folderCaptions[folder] || '', images.length);
    const hasArabic = /[\u0600-\u06FF]/.test(folderCaptions[folder] || '');
    
    // Create gallery HTML
    let galleryHTML = '';
    
    // First image is full width
    galleryHTML += `
        <div class="gallery-pair full-width">
            <div class="gallery-image">
                <img src="${images[0]}" alt="${formatFolderName(folder)}">
            </div>
        </div>
    `;
    
    // Rest of images alternate left/right with caption
    for (let i = 1; i < images.length; i++) {
        const isReversed = i % 2 === 0;
        const captionHTML = captionParts[i] ? 
            `<div class="gallery-text" ${hasArabic ? 'lang="ar"' : ''}>
                <p>${captionParts[i].replace(/\n/g, '<br>')}</p>
            </div>` : '';
        
        galleryHTML += `
            <div class="gallery-pair ${isReversed ? 'reversed' : ''}">
                <div class="gallery-image">
                    <img src="${images[i]}" alt="${formatFolderName(folder)} ${i+1}">
                </div>
                ${captionHTML}
            </div>
        `;
    }
    
    projectGallery.innerHTML = galleryHTML;
}

// Split captions for multiple images
function splitCaptionForImages(caption, imageCount) {
    if (!caption || imageCount <= 1) {
        return [caption];
    }
    
    // Split caption into paragraphs
    const paragraphs = caption.split('\n\n').filter(p => p.trim() !== '');
    
    // If we have fewer paragraphs than images, repeat the last paragraph
    const result = [];
    for (let i = 0; i < imageCount; i++) {
        if (i < paragraphs.length) {
            result.push(paragraphs[i]);
        } else {
            result.push(paragraphs[paragraphs.length - 1]);
        }
    }
    
    return result;
}

// Helper function to format folder names for display
function formatFolderName(folder) {
    // Replace underscores with spaces and capitalize first letter of each word
    return folder
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
} 