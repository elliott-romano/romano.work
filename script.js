// Portfolio Website JavaScript

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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

    // Project toggle functionality
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const selectedProjects = document.getElementById('selected-projects');
    const coolerProjects = document.getElementById('cooler-projects');

    if (toggleOptions.length > 0) {
        toggleOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Show/hide appropriate content
                const tab = this.getAttribute('data-tab');
                if (tab === 'selected') {
                    selectedProjects.classList.remove('hidden');
                    coolerProjects.classList.add('hidden');
                } else if (tab === 'cooler') {
                    selectedProjects.classList.add('hidden');
                    coolerProjects.classList.remove('hidden');
                }
            });
        });
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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