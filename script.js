// Portfolio Website JavaScript

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
            const tags = section.querySelectorAll('.tag');
            let shouldShow = false;
            
            if (filterValue === 'all') {
                shouldShow = true;
            } else {
                tags.forEach(tag => {
                    if (tag.textContent.toLowerCase().includes(filterValue)) {
                        shouldShow = true;
                    }
                });
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
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
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
    const titles = ['ELLIOTT ROMANO', 'GRAPHIC, PRODUCT, & MOTION DESIGN'];
    let currentIndex = 0;
    
    function animateTitle() {
        currentIndex = (currentIndex + 1) % titles.length;
        titleElement.textContent = titles[currentIndex];
    }
    
    // Start animation after 5 seconds, then repeat every 5 seconds
    setTimeout(() => {
        animateTitle();
        setInterval(animateTitle, 5000);
    }, 5000);

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
});

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