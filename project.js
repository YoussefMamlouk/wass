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

// Image data will be loaded from JSON
let imageData = {
    folders: {},
    firstImages: {},
    captions: {}
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
    'traversée': `‎لا تسرف في التواضع ، فهو يفقد الناس القدرة على رؤية الحدود.

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
‎الصورة ليست عن اللعب، بل عن الحلم، عن الشباب الذين ما زالوا يحاولون الطيران رغم الصعوبات`
};

// Function to get caption for a folder
const getFolderCaption = (folder) => {
    if (imageData.captions && imageData.captions[folder]) {
        return imageData.captions[folder];
    }
    return fallbackCaptions[folder] || '';
};

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
    }
};

// Fallback project images (used if image-data.json can't be loaded)
const fallbackProjectImages = {
    'about_me': [
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
    'al_ziyara': [
        'images/al_ziyara/32da94df-18d2-4ef2-aa8e-9ee834cc8253.jpeg',
        'images/al_ziyara/0d715e67-2738-4b79-81f0-c10db9a032cc.jpeg',
        'images/al_ziyara/56bd4b38-754d-445d-9d54-7cc85c656026.jpeg',
        'images/al_ziyara/82cb21e5-07f4-405a-b75e-278ddd2088f5.jpeg',
        'images/al_ziyara/a4e22fe8-0d07-4841-8d9a-2c738c093d04.jpeg',
        'images/al_ziyara/cca31891-7c49-4639-a0e4-3aea14e7ea85.jpeg'
    ],
    'jmc': [
        'images/jmc/f860521e-6d57-40a7-a381-1580ea80e5f7.jpeg',
        'images/jmc/2ec600d9-93f1-4ca4-b6d6-baa03f206ffe.jpeg'
    ],
    'traversee': [
        'images/traversee/61cbfbda-4f04-437d-a5c4-b191d1f80649.jpeg',
        'images/traversee/a34f9509-a80d-4886-ad36-e0a34eeacf24.jpeg',
        'images/traversee/e906b09d-02b4-4e3e-a8d8-3e6b0cc08be9.jpeg'
    ],
    'kairouan': [
        'images/kairouan/d532f891-1979-4077-b55a-77deacdf7cc8.jpeg',
        'images/kairouan/dcc378a3-3dac-48bb-9d51-aeb301b89dbf.jpeg'
    ],
    'bab_bhar': [
        'images/bab_bhar/e4990f37-30f0-436d-8d11-ac1e12f78ffd.jpeg',
        'images/bab_bhar/17273adc-3a08-4b1b-913d-cabd6016b5a5.jpeg',
        'images/bab_bhar/19321704-063f-408d-b616-e8469b23a70f.jpeg',
        'images/bab_bhar/31d31106-55db-49da-8c43-2181463cd0d1.jpeg',
        'images/bab_bhar/8c6d07b6-b612-4613-a1ca-11aa7d56bd4f.jpeg',
        'images/bab_bhar/94d82856-e170-4b4d-a711-4230181b64c3.jpeg',
        'images/bab_bhar/e072abcd-d110-45d1-8dd4-e8d4e895d553.jpeg',
        'images/bab_bhar/e1fe240f-d0d6-4d69-a46f-78036107ac38.jpeg'
    ],
    'bab_el_falla': [
        'images/bab_el_falla/e86571d5-3cca-4fbd-8ea3-2855aac56229.jpeg'
    ],
    'mouhit': [
        'images/mouhit/a7046275-b722-417a-9a20-2b29d8496a0f.jpeg'
    ],
    'cathedrale': [
        'images/cathedrale/60d5d1d6-395d-435b-83e7-9fe37dcfd675.jpeg',
        'images/cathedrale/d04624a6-6136-4c1b-9505-31ee2b953a4e.jpeg',
        'images/cathedrale/e5574915-cb16-446c-bbb0-0890d870fafc.jpeg'
    ],
    'home': [
        'images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'
    ]
};

// Function to get images for a folder
const getFolderImages = (folder) => {
    // First check special folders
    if (specialFolders[folder]) {
        return specialFolders[folder].images;
    }
    
    // Then check imageData
    if (imageData.folders && imageData.folders[folder]) {
        return imageData.folders[folder];
    }
    
    // Finally fallback to hardcoded values
    return fallbackProjectImages[folder] || [];
};

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

// Header scroll effect (throttled)
let headerScrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', () => {
    // Skip scroll effects when menu is open (but don't prevent the event)
    if (document.body.classList.contains('menu-open')) {
        return;
    }
    
    // Prevent multiple scroll events from firing simultaneously
    if (isScrolling) return;
    
    if (headerScrollTimeout) {
        clearTimeout(headerScrollTimeout);
    }
    
    isScrolling = true;
    
    headerScrollTimeout = setTimeout(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        isScrolling = false;
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

// Initialize project page
document.addEventListener('DOMContentLoaded', () => {
    // First load image data, then initialize the page
    loadImageData().then(() => {
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
});

// Initialize project page
function initProjectPage(folder) {
    console.log(`Initializing project page for: ${folder}`);
    
    // Set page title and subtitle
    const formattedTitle = formatFolderName(folder);
    document.title = `${formattedTitle} | Wassila Mestiri Photography`;
    projectTitle.textContent = formattedTitle;
    
    // Extract location and date information if available in the caption
    const caption = getFolderCaption(folder);
    if (caption) {
        let subtitle = '';
        
        // Special handling for different projects
        if (folder === 'bizerte') {
            // For Bizerte, extract the location and date from the first line
            const firstLine = caption.split('\n')[0];
            // Extract the part after the dash which contains location and date
            const match = firstLine.match(/- (.+)$/);
            if (match) {
                subtitle = match[1].trim(); // "بنزرت 12 ماي 2025"
            }
        } else {
            // For other projects, find the first non-Arabic line
            const captionLines = caption.split('\n');
            const locationLine = captionLines.find(line => 
                !line.startsWith('‎') && !line.match(/^[\u0600-\u06FF]/) && line.trim() !== ''
            );
            if (locationLine) {
                subtitle = locationLine.trim();
            }
        }
        
        if (subtitle) {
            projectSubtitle.textContent = subtitle;
        }
    }
    
    // Set hero background image - first check special folders, then dynamic images
    if (specialFolders[folder]) {
        projectHero.style.backgroundImage = `url('${specialFolders[folder].thumbnail}')`;
        console.log(`Set hero image from special folder: ${specialFolders[folder].thumbnail}`);
    } else {
        const images = getFolderImages(folder);
        if (images && images.length > 0) {
            projectHero.style.backgroundImage = `url('${images[0]}')`;
            console.log(`Set hero image: ${images[0]}`);
        } else {
            projectHero.style.backgroundImage = `url('images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg')`;
            console.log('Using default hero image');
        }
    }
    
    // Hide the project description section since we'll show caption with images
    projectDescription.style.display = 'none';
    
    // Load project images
    loadProjectImages(folder);
}

// Load project images with alternating layout
function loadProjectImages(folder) {
    const images = getFolderImages(folder);
    console.log(`Loading project images for ${folder}. Found ${images.length} images:`, images);
    
    if (images.length === 0) {
        // If we don't have images for this folder, provide a fallback message and image
        projectGallery.innerHTML = `
            <div class="gallery-pair">
                <div class="gallery-image">
                    <img src="images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg" alt="${formatFolderName(folder)}">
                </div>
                <div class="gallery-text">
                    <p>Images for this ${isAlbum ? 'album' : 'project'} will be available soon.</p>
                </div>
            </div>
        `;
        console.log(`No images found for ${folder}, using fallback message`);
        return;
    }
    
    renderGallery(folder, images);
}

// Helper function to render the gallery with images and captions
function renderGallery(folder, images) {
    const caption = getFolderCaption(folder);
    const hasArabic = /[\u0600-\u06FF]/.test(caption || '');
    
    if (images.length === 0) {
        projectGallery.innerHTML = '<div class="anna-inspired-layout"><p>No images available for this project.</p></div>';
        return;
    }
    
    if (images.length === 1 || images.length === 2) {
        // Use single/simple layout for 1-2 images
        let galleryHTML = '<div class="single-image-layout">';
        
        images.forEach((image, index) => {
            galleryHTML += `
                <div class="image-container">
                    <img src="${image}" alt="${formatFolderName(folder)} ${index+1}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'" onclick="openLightbox('${image}', '${formatFolderName(folder)} ${index+1}')">
                </div>
            `;
        });
        
        if (caption) {
            const formattedCaption = caption
                .split('\n\n')
                .map(para => para.trim())
                .filter(para => para !== '')
                .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                .join('');
            
            galleryHTML += `
                <div class="caption-container" ${hasArabic ? 'lang="ar"' : ''}>
                    ${formattedCaption}
                </div>
            `;
        }
        
        galleryHTML += '</div>';
        projectGallery.innerHTML = galleryHTML;
        return;
    }
    
    // For 3+ images, use grid layout but limit to first 8 images to prevent overlap
    const displayImages = images.slice(0, 8);
    const positions = ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'];
    const sizes = ['large', 'medium', 'small'];
    
    let galleryHTML = '<div class="anna-inspired-layout">';
    
    // Add images with grid positioning
    displayImages.forEach((image, index) => {
        const position = positions[index];
        const size = sizes[index % sizes.length];
        
        galleryHTML += `
            <div class="image-item ${size} ${position}">
                <img src="${image}" alt="${formatFolderName(folder)} ${index+1}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'" onclick="openLightbox('${image}', '${formatFolderName(folder)} ${index+1}')">
            </div>
        `;
    });
    
    // Central caption
    if (caption) {
        const formattedCaption = caption
            .split('\n\n')
            .map(para => para.trim())
            .filter(para => para !== '')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');
        
        galleryHTML += `
            <div class="central-caption" ${hasArabic ? 'lang="ar"' : ''}>
                ${formattedCaption}
            </div>
        `;
    }
    
    galleryHTML += '</div>';
    
    // If there are more than 8 images, add remaining images in a simple grid below
    if (images.length > 8) {
        const remainingImages = images.slice(8);
        galleryHTML += '<div class="additional-images">';
        galleryHTML += '<div class="additional-images-grid">';
        
        remainingImages.forEach((image, index) => {
            galleryHTML += `
                <div class="additional-image-item">
                    <img src="${image}" alt="${formatFolderName(folder)} ${index+9}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'" onclick="openLightbox('${image}', '${formatFolderName(folder)} ${index+9}')">
                </div>
            `;
        });
        
        galleryHTML += '</div></div>';
    }
    
    projectGallery.innerHTML = galleryHTML;
    console.log(`Gallery rendered with ${images.length} images for ${folder} (${displayImages.length} in main layout, ${images.length - displayImages.length} additional)`);
}



// Helper function to format folder names for display
function formatFolderName(folder) {
    // Replace underscores with spaces and capitalize first letter of each word
    return folder
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Lightbox functionality
function openLightbox(imageSrc, altText) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add event listeners
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // Set image and show lightbox
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = altText;
    lightboxCaption.textContent = altText;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}