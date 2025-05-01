const scroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true
});

// Mouse follower variables
let xscale = 1;
let yscale = 1;
let xprev = 0;
let yprev = 0;
let timeout;

// Update mouse follower with position and optional scaling
function updateMouseFollower(clientX, clientY, scaleX = 1, scaleY = 1) {
    const mouse = document.querySelector("#mouse");
    if (mouse) {
        mouse.style.transform = `translate(${clientX}px, ${clientY}px) scale(${scaleX}, ${scaleY})`;
    }
}

// Mouse follower initialization
function initMouseFollower() {
    // Add the main mousemove event listener
    window.addEventListener("mousemove", function(dets) {
        updateMouseFollower(dets.clientX, dets.clientY);
    });
}

// Flat circle effect with dynamic scaling
function initFlatCircle() {
    window.addEventListener("mousemove", function(dets) {
        clearTimeout(timeout);

        // Calculate movement to create stretching effect
        const movementX = dets.clientX - xprev;
        const movementY = dets.clientY - yprev;
        
        // Update scale values with clamping
        xscale = gsap.utils.clamp(0.8, 1.2, 1 + movementX * 0.01);
        yscale = gsap.utils.clamp(0.8, 1.2, 1 + movementY * 0.01);
        
        // Store current position for next calculation
        xprev = dets.clientX;
        yprev = dets.clientY;
        
        // Update mouse follower with new scales
        updateMouseFollower(dets.clientX, dets.clientY, xscale, yscale);
        
        // Reset the scale after a short delay
        timeout = setTimeout(function() {
            updateMouseFollower(dets.clientX, dets.clientY, 1, 1);
        }, 100);
    });
}

// Initial setup for hero elements
function initializeHeroElements() {
    gsap.set("#heading .hidehide h1", { y: 100, opacity: 0 });
    gsap.set("#heading .block1 h1", { y: 100, opacity: 0 });
    gsap.set("#heading .block1 h5", { y: 30, opacity: 0 });
    gsap.set("#smallheading h5", { y: 30, opacity: 0 });
    gsap.set("#herofoot a, #herofoot .iconset", { y: 30, opacity: 0 });
    gsap.set("#nav", { y: -20, opacity: 0 });
}

// Hero text animation function
function animateHeroText() {
    // Create a timeline for coordinated animations
    const tl = gsap.timeline();
    
    // Animate the navigation
    tl.to("#nav", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Animate the "Graphic" text
    tl.to("#heading .hidehide h1", {
        y: 0,
        opacity: 0.6,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.4");
    
    // Animate the "Designer" text
    tl.to("#heading .block1 h1", {
        y: 0,
        opacity: 0.6,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.8");
    
    // Animate the "Based in Germany" text
    tl.to("#heading .block1 h5", {
        y: 0,
        opacity: 0.8,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");
    
    // Animate the small heading text
    tl.to("#smallheading h5", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4");
    
    // Animate the hero footer elements
    tl.to("#herofoot a, #herofoot .iconset", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.2");
}

// Initialize portfolio item hover effects with contained image movement
function initPortfolioItems() {
    // First, make sure all images start hidden
    document.querySelectorAll("#elem .img-container").forEach(container => {
        gsap.set(container, { opacity: 0, zIndex: 1 });
    });
    
    // Set up each portfolio item
    document.querySelectorAll("#elem").forEach(function(elem) {
        const imgContainer = elem.querySelector(".img-container");
        const img = elem.querySelector("img");
        
        if (!imgContainer || !img) return;
        
        // Add pointer-events: none to prevent image from interfering with mouse events
        imgContainer.style.pointerEvents = "none";
        
        // Set up a specific zIndex for this element when active
        let currentZIndex = 1;
        
        elem.addEventListener("mouseenter", function() {
            // Raise z-index on hover to appear above other elements
            currentZIndex = 10;
            imgContainer.style.zIndex = currentZIndex;
            
            // Show the image with a fade-in
            gsap.to(imgContainer, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        elem.addEventListener("mouseleave", function() {
            // Hide the image when mouse leaves
            gsap.to(imgContainer, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    // Reset z-index after fade out
                    imgContainer.style.zIndex = 1;
                }
            });
        });
        
        elem.addEventListener("mousemove", function(dets) {
            // Get element dimensions and position
            const rect = elem.getBoundingClientRect();
            
            // Calculate boundaries to contain the image within the element
            // Adding padding to keep it comfortably within the element
            const padding = 20;
            const minX = padding;
            const maxX = rect.width - padding;
            const minY = padding;
            const maxY = rect.height - padding;
            
            // Calculate mouse position relative to the element
            let mouseX = dets.clientX - rect.left;
            let mouseY = dets.clientY - rect.top;
            
            // Constrain the position within the element's boundaries
            mouseX = Math.max(minX, Math.min(maxX, mouseX));
            mouseY = Math.max(minY, Math.min(maxY, mouseY));
            
            // Calculate a slight rotation based on mouse position
            const rotateX = gsap.utils.mapRange(0, rect.width, -5, 5, mouseX);
            const rotateY = gsap.utils.mapRange(0, rect.height, 5, -5, mouseY);
            
            // Animate the image container to follow the mouse while staying within bounds
            gsap.to(imgContainer, {
                left: mouseX,
                top: mouseY,
                xPercent: -50,
                yPercent: -50,
                rotateX: rotateY, // Inverted for natural tilt
                rotateY: rotateX,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
}

// Wait for page to load before running animations
window.addEventListener("load", function() {
    try {
        // Initialize all components
        initMouseFollower();
        initFlatCircle();
        initializeHeroElements();
        initPortfolioItems();
        
        // Start hero animations with small delay
        setTimeout(function() {
            animateHeroText();
        }, 300);
    } catch (error) {
        console.error("Error initializing animations:", error);
    }
});



