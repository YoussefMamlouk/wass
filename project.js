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
    'cathé́drale': `‎عندما تلج دائرة الحب، تكون اللغة التي نعرفها قد عفى عليها الزمن، فالشيء الذي لا يمكن التعبير عنه بكلمات، لا يمكن إدراكه إلا بالصمت.

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
        const captionLines = caption.split('\n');
        const locationLine = captionLines.find(line => 
            !line.startsWith('‎') && !line.match(/^[\u0600-\u06FF]/) && line.trim() !== ''
        );
        if (locationLine) {
            projectSubtitle.textContent = locationLine.trim();
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
    
    // Set project description
    if (caption) {
        // Determine if caption contains Arabic text
        const hasArabic = /[\u0600-\u06FF]/.test(caption);
        if (hasArabic) {
            projectDescription.setAttribute('lang', 'ar');
        }
        
        // Format the caption with paragraphs
        const formattedCaption = caption
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
    // Split caption into parts for each image
    const captionParts = splitCaptionForImages(getFolderCaption(folder), images.length);
    const hasArabic = /[\u0600-\u06FF]/.test(getFolderCaption(folder) || '');
    
    // Create gallery HTML
    let galleryHTML = '';
    
    // All images have the same size, including the first one
    for (let i = 0; i < images.length; i++) {
        const isReversed = i % 2 !== 0; // Alternate layout
        const captionHTML = captionParts[i] ? 
            `<div class="gallery-text" ${hasArabic ? 'lang="ar"' : ''}>
                <p>${captionParts[i].replace(/\n/g, '<br>')}</p>
            </div>` : '';
        
        galleryHTML += `
            <div class="gallery-pair ${isReversed ? 'reversed' : ''}">
                <div class="gallery-image">
                    <img src="${images[i]}" alt="${formatFolderName(folder)} ${i+1}" onerror="this.src='images/home/c6f275d1-d11c-47d6-9225-5fd9781386df.jpeg'">
                </div>
                ${captionHTML}
            </div>
        `;
    }
    
    projectGallery.innerHTML = galleryHTML;
    console.log(`Gallery rendered with ${images.length} images for ${folder}`);
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