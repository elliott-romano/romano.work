// Portfolio Website JavaScript

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// Toggle show more functionality
function toggleShowMore(button) {
    const descriptionText = button.previousElementSibling.previousElementSibling;
    const descriptionMore = button.previousElementSibling;
    
    if (descriptionMore.classList.contains('hidden')) {
        descriptionMore.classList.remove('hidden');
        button.textContent = 'show less';
    } else {
        descriptionMore.classList.add('hidden');
        button.textContent = 'show more';
    }
}

// Hide show more buttons for content that doesn't need truncation
function hideUnnecessaryShowMoreButtons() {
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
    
    showMoreButtons.forEach(button => {
        const descriptionText = button.previousElementSibling.previousElementSibling;
        const descriptionMore = button.previousElementSibling;
        
        // Check if the text actually needs truncation
        const textHeight = descriptionText.scrollHeight;
        const lineHeight = parseFloat(getComputedStyle(descriptionText).lineHeight);
        const maxHeight = lineHeight * 3; // 3 lines
        
        if (textHeight <= maxHeight) {
            button.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Inject progressive blur stack at top of viewport
    (() => {
        const wrap = document.createElement('div');
        wrap.className = 'progressive-blur';
        for (let i = 1; i <= 4; i++) {
            const layer = document.createElement('div');
            layer.className = 'blur-layer blur-' + i;
            wrap.appendChild(layer);
        }
        document.body.appendChild(wrap);
    })();

    // ----- Lightbox for media items -----
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(node) {
        if (!lightbox || !lightboxContent) return;
        lightboxContent.innerHTML = '';
        const clone = node.cloneNode(true);
        clone.removeAttribute('style');
        clone.className = '';
        if (clone.tagName.toLowerCase() === 'video') {
            clone.removeAttribute('controls');
            clone.setAttribute('autoplay', '');
            clone.setAttribute('muted', '');
            clone.setAttribute('playsinline', '');
        }
        lightboxContent.appendChild(clone);
        lightbox.classList.remove('hidden');
        lightbox.setAttribute('aria-hidden', 'false');

        // Start playback after insertion
        if (clone.tagName && clone.tagName.toLowerCase() === 'video') {
            try { clone.muted = true; clone.play(); } catch (e) {}
        }
    }

    function closeLightbox() {
        if (!lightbox || !lightboxContent) return;
        lightbox.classList.add('hidden');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxContent.innerHTML = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });

    document.querySelectorAll('.media-item img, .media-item video').forEach(el => {
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', () => openLightbox(el));
    });

    // Optional auto-detect portrait media. Enable by adding data-auto-orient="true" on a .media-item
    function tagPortraitMedia() {
        document.querySelectorAll('.media-item[data-auto-orient="true"]').forEach(container => {
            const media = container.querySelector('img, video');
            if (!media) return;

            const markIfPortrait = (naturalWidth, naturalHeight) => {
                if (naturalWidth && naturalHeight && naturalHeight > naturalWidth) {
                    container.classList.add('portrait');
                } else {
                    container.classList.remove('portrait');
                }
            };

            if (media.tagName.toLowerCase() === 'img') {
                if (media.complete && media.naturalWidth) {
                    markIfPortrait(media.naturalWidth, media.naturalHeight);
                } else {
                    media.addEventListener('load', () => markIfPortrait(media.naturalWidth, media.naturalHeight), { once: true });
                }
            } else if (media.tagName.toLowerCase() === 'video') {
                if (media.videoWidth) {
                    markIfPortrait(media.videoWidth, media.videoHeight);
                } else {
                    media.addEventListener('loadedmetadata', () => markIfPortrait(media.videoWidth, media.videoHeight), { once: true });
                }
            }
        });
    }

    // Disabled by default; call only if attributes present
    tagPortraitMedia();
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const viewLinks = document.querySelectorAll('.view-link');
    const filterLinks = document.querySelectorAll('.filter-link');
    const projectsList = document.querySelector('.projects-list');
    const projectSections = document.querySelectorAll('.project-section');

    // Navigation link handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for links that should stay on the same page
            const href = this.getAttribute('href');
            if (href === '#' || (href === 'index.html' && window.location.pathname === '/')) {
                e.preventDefault();
            }
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // View toggle functionality
    viewLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            viewLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (this.textContent === 'GRID') {
                projectsList.classList.add('grid-view');
            } else {
                projectsList.classList.remove('grid-view');
            }
        });
    });

    // Filter functionality
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.textContent.toLowerCase();
            filterProjects(filterValue);
        });
    });

    // Filter projects based on selected tag
    function filterProjects(filterValue) {
        projectSections.forEach(section => {
            const tagsElement = section.querySelector('.project-tags-text');
            let shouldShow = false;
            
            if (filterValue === 'all') {
                shouldShow = true;
            } else if (tagsElement) {
                const tagsText = tagsElement.textContent.toLowerCase();
                if (tagsText.includes(filterValue)) {
                    shouldShow = true;
                }
            }
            
            if (shouldShow) {
                section.style.display = 'block';
                section.style.opacity = '1';
            } else {
                section.style.opacity = '0.3';
                section.style.display = 'block';
            }
        });
    }

    // Pagination functionality
    const prevButton = document.querySelector('.nav-arrow:first-child');
    const nextButton = document.querySelector('.nav-arrow:last-child');
    const pageInfo = document.querySelector('.page-info');
    
    let currentPage = 1;
    const totalPages = 30;
    
    function updatePagination() {
        if (pageInfo) {
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
        }
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
    }

    // Restart button functionality
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Reset all filters and views
            filterLinks.forEach(link => link.classList.remove('active'));
            filterLinks[0].classList.add('active'); // Reset to first filter
            
            viewLinks.forEach(link => link.classList.remove('active'));
            viewLinks[0].classList.add('active'); // Reset to LIST view
            
            projectsList.classList.remove('grid-view');
            
            // Show all projects
            projectSections.forEach(section => {
                section.style.display = 'block';
                section.style.opacity = '1';
            });
            
            // Reset pagination
            currentPage = 1;
            updatePagination();
            
            // Scroll to top
            lenis.scrollTo(0);
        });
    }

    // Initialize pagination
    updatePagination();

    // Title animation
    const titleElement = document.querySelector('.site-title');

    // Match image container height to video container height
    function matchMediaHeights() {
        const videoContainers = document.querySelectorAll('.media-container.media-right');
        const imageContainers = document.querySelectorAll('.media-container.media-left');
        
        videoContainers.forEach((videoContainer, index) => {
            const imageContainer = imageContainers[index];
            if (videoContainer && imageContainer) {
                // Wait for video to load and get its natural height
                const video = videoContainer.querySelector('video');
                if (video) {
                    const setHeight = () => {
                        // Reset height to auto first to get natural height
                        videoContainer.style.height = 'auto';
                        const videoHeight = videoContainer.offsetHeight;
                        imageContainer.style.height = videoHeight + 'px';
                    };
                    
                    if (video.readyState >= 1) {
                        // Video already loaded
                        setHeight();
                    } else {
                        // Wait for video to load
                        video.addEventListener('loadedmetadata', setHeight);
                    }
                }
            }
        });
    }

    // Handle responsive behavior
    function handleResponsiveMedia() {
        const mediaContainers = document.querySelectorAll('.media-container');
        
        if (window.innerWidth <= 768) {
            // On mobile, let containers use their natural heights
            mediaContainers.forEach(container => {
                container.style.height = 'auto';
            });
        } else {
            // On desktop, match heights
            setTimeout(matchMediaHeights, 100); // Small delay to ensure layout is ready
        }
    }

    // Run on page load and window resize
    handleResponsiveMedia();
    window.addEventListener('resize', handleResponsiveMedia);

    // Time display functionality
    function updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // Hide unnecessary show more buttons
    hideUnnecessaryShowMoreButtons();

    // Disable video controls
    const videos = document.querySelectorAll('.project-video');
    videos.forEach(video => {
        video.controls = false;
        video.setAttribute('controls', 'false');
        video.removeAttribute('controls');
    });

    // Email copy functionality
    const emailCopyButtons = document.querySelectorAll('.email-copy');
    
    emailCopyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = button.getAttribute('data-email');
            const copyText = button.querySelector('.copy-text');
            
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(function() {
                    const originalText = copyText.textContent;
                    copyText.textContent = 'Copied!';
                    setTimeout(() => {
                        copyText.textContent = originalText;
                    }, 2000);
                }).catch(function(err) {
                    fallbackCopy(email, copyText);
                });
            } else {
                fallbackCopy(email, copyText);
            }
        });
    });
    
    function fallbackCopy(text, copyTextElement) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('Email copied successfully via fallback');
                const originalText = copyTextElement.textContent;
                copyTextElement.textContent = 'Copied!';
                setTimeout(() => {
                    copyTextElement.textContent = originalText;
                }, 2000);
            } else {
                console.error('Fallback copy failed');
                alert('Copy failed. Please copy manually: ' + text);
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            alert('Copy failed. Please copy manually: ' + text);
        }
        
        document.body.removeChild(textArea);
    }

    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-option');
    const projectItems = document.querySelectorAll('.project-item');
    const filterContainer = document.querySelector('.projects-filter');

    console.log('Filter buttons found:', filterButtons.length);
    console.log('Project items found:', projectItems.length);
    console.log('Filter container found:', filterContainer);

    if (filterButtons.length > 0) {
        // Create animated pill background
        const pill = document.createElement('div');
        pill.className = 'filter-pill';
        filterContainer.appendChild(pill);

        // Function to update pill position
        function updatePillPosition(activeButton) {
            const buttonRect = activeButton.getBoundingClientRect();
            const containerRect = filterContainer.getBoundingClientRect();
            
            const left = buttonRect.left - containerRect.left;
            const width = buttonRect.width;
            const height = buttonRect.height;
            
            pill.style.left = `${left}px`;
            pill.style.width = `${width}px`;
            pill.style.height = `${height}px`;
            pill.style.top = `${buttonRect.top - containerRect.top}px`;
        }

        // Initialize pill position for active button
        const activeButton = document.querySelector('.filter-option.active');
        if (activeButton) {
            updatePillPosition(activeButton);
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Filter button clicked:', this.textContent, this.getAttribute('data-filter'));
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update pill position with animation
                updatePillPosition(this);
                
                // Get the filter data
                const filter = this.getAttribute('data-filter');
                
                console.log('Filtering by:', filter);
                projectItems.forEach((item, index) => {
                    const tags = item.getAttribute('data-tags');
                    let shouldShow = false;
                    
                    if (filter === 'all') {
                        shouldShow = true;
                    } else if (filter === 'selected') {
                        shouldShow = tags.includes('selected');
                    } else {
                        shouldShow = tags.includes(filter);
                    }
                    
                    console.log(`Project ${index}: tags="${tags}", shouldShow=${shouldShow}`);
                    setTimeout(() => {
                        if (shouldShow) {
                            item.style.display = 'block';
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            
                            // Animate in
                            requestAnimationFrame(() => {
                                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            });
                        } else {
                            // Animate out
                            item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(-10px)';
                            
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 200);
                        }
                    }, index * 50); // Staggered delay
                });
            });
        });

        // Initialize with "selected" filter on page load
        const selectedButton = document.querySelector('.filter-option.active');
        if (selectedButton && selectedButton.getAttribute('data-filter') === 'selected') {
            // Trigger the selected filter on page load
            projectItems.forEach((item, index) => {
                const tags = item.getAttribute('data-tags');
                const shouldShow = tags.includes('selected');
                
                if (!shouldShow) {
                    item.style.display = 'none';
                }
            });
        }

        // Videos are now loaded directly in HTML with src attributes
        // No need for lazy loading since videos are already loaded
    }

    // Videos are now loaded directly in HTML with src attributes
    // No lazy loading needed

    // Project description drawers
    document.querySelectorAll('.project-item .project-content').forEach(content => {
        const name = content.querySelector('.project-name');
        if (!name) return;
        name.addEventListener('click', () => {
            content.classList.toggle('is-open');
        });
    });

    // Intro text shrink-on-scroll
    const heroSection = document.querySelector('.hero-section');
    const heroCard = heroSection ? heroSection.querySelector('.intro-card') : null;
    const navEl = document.querySelector('nav');
    const titleBlend = document.querySelector('.title-blend');

    // On pages without a hero (e.g., info), nav stays visible always.
    if (!heroSection) {
        document.body.classList.add('nav-active');
        if (navEl) {
            navEl.style.opacity = '1';
            navEl.style.pointerEvents = 'auto';
        }
        if (titleBlend) {
            titleBlend.style.opacity = '1';
        }
    }

    if (heroSection && heroCard) {
        const SHRINK_DISTANCE = 500;
        let lastP = -1;
        function updateHero() {
            const rect = heroSection.getBoundingClientRect();
            const scrolled = -rect.top;
            const p = Math.max(0, Math.min(1, scrolled / SHRINK_DISTANCE));
            if (p !== lastP) {
                lastP = p;
                heroSection.style.setProperty('--p', p);
                document.documentElement.style.setProperty('--p', p);
                const show = p >= 0.95;
                document.body.classList.toggle('nav-active', show);
                if (navEl) {
                    navEl.style.opacity = show ? '1' : '0';
                    navEl.style.pointerEvents = show ? 'auto' : 'none';
                }
                if (titleBlend) {
                    titleBlend.style.opacity = show ? '1' : '0';
                }
            }
            requestAnimationFrame(updateHero);
        }
        requestAnimationFrame(updateHero);
    }

    // Hover preview for inline .underlined terms
    try {
        const hoverPreview = document.createElement('div');
        hoverPreview.className = 'hover-preview';
        document.body.appendChild(hoverPreview);

        function positionPreview(e) {
            hoverPreview.style.left = e.clientX + 'px';
            hoverPreview.style.top = e.clientY + 'px';
        }

        document.querySelectorAll('.underlined[data-preview]').forEach(el => {
            el.addEventListener('mouseenter', e => {
                const src = el.getAttribute('data-preview');
                const type = el.getAttribute('data-preview-type') || 'image';
                hoverPreview.innerHTML = '';
                if (type === 'video') {
                    const v = document.createElement('video');
                    v.src = src;
                    v.muted = true;
                    v.loop = true;
                    v.autoplay = true;
                    v.playsInline = true;
                    hoverPreview.appendChild(v);
                    v.play().catch(() => {});
                } else {
                    const img = document.createElement('img');
                    img.src = src;
                    hoverPreview.appendChild(img);
                }
                positionPreview(e);
                hoverPreview.classList.add('visible');
            });
            el.addEventListener('mousemove', positionPreview);
            el.addEventListener('mouseleave', () => {
                hoverPreview.classList.remove('visible');
            });
        });
    } catch (err) {
        console.error('hover preview init failed:', err);
    }
});

// Scroll to top function
function scrollToTop() {
    lenis.scrollTo(0);
}

// Navigate to index page function
function goToIndex() {
    window.location.href = 'index.html';
}

// Add CSS for grid view
const style = document.createElement('style');
style.textContent = `
    .projects-list.grid-view {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    
    .projects-list.grid-view .project-section {
        display: flex;
        flex-direction: column;
    }
    
    .projects-list.grid-view .project-media {
        margin-top: auto;
    }
`;
document.head.appendChild(style);