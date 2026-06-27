document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Effect
    // ==========================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load


    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navMenu) navMenu.classList.remove('active');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) icon.className = 'fas fa-bars';

            // Active Link Highlighting
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 3. Portfolio Filtering & Lightbox Setup
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let activeItems = Array.from(portfolioItems); // Stores current visible items for Lightbox navigation

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Highlight active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            activeItems = []; // Reset active items array

            portfolioItems.forEach(item => {
                // If "all" is selected or item has the category class
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    activeItems.push(item);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // ==========================================
    // 4. Custom Photo Lightbox
    // ==========================================
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentPhotoIndex = 0;

    const openLightbox = (index) => {
        currentPhotoIndex = index;
        const currentItem = activeItems[currentPhotoIndex];
        const imgSrc = currentItem.getAttribute('data-src');
        const imgAlt = currentItem.querySelector('img').getAttribute('alt');
        const imgTitle = currentItem.querySelector('h3').innerText;

        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightboxCaption.innerHTML = `<span class="gold-text">${imgTitle}</span><br><small style="font-size:0.8rem; color:#888;">${imgAlt}</small>`;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    };

    const showPrevPhoto = (e) => {
        if (e) e.stopPropagation();
        let index = currentPhotoIndex - 1;
        if (index < 0) {
            index = activeItems.length - 1; // Loop back to last item
        }
        openLightbox(index);
    };

    const showNextPhoto = (e) => {
        if (e) e.stopPropagation();
        let index = currentPhotoIndex + 1;
        if (index >= activeItems.length) {
            index = 0; // Loop back to first item
        }
        openLightbox(index);
    };

    // Attach click listener to portfolio item layouts
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            // Find index in activeItems array
            const index = activeItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
    
    // Close on clicking overlay background
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard controls for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevPhoto();
            if (e.key === 'ArrowRight') showNextPhoto();
        }
    });


    // ==========================================
    // 5. Testimonials Slider
    // ==========================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    let currentSlideIndex = 0;
    let slideTimer;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlideIndex = index;
        if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
        if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

        slides[currentSlideIndex].classList.add('active');
        if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlideIndex + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlideIndex - 1);
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        slideTimer = setInterval(nextSlide, 6000); // Shift every 6 seconds
    };

    const stopAutoSlide = () => {
        if (slideTimer) clearInterval(slideTimer);
    };

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // Reset timer on interaction
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            showSlide(index);
            startAutoSlide();
        });
    });

    // Start auto slider on load
    startAutoSlide();


    // ==========================================
    // 6. Booking Form Validation & Submission
    // ==========================================
    const bookingForm = document.getElementById('bookingForm');
    const successMsgPanel = document.getElementById('successMessage');

    // Input elements
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const dateInput = document.getElementById('eventDate');
    const typeInput = document.getElementById('eventType');

    // Helper functions to show/hide invalid states
    const setInvalid = (inputEl, errorElId) => {
        inputEl.parentElement.classList.add('invalid');
    };

    const setValid = (inputEl) => {
        inputEl.parentElement.classList.remove('invalid');
    };

    // Validation patterns
    const validateForm = () => {
        let isValid = true;

        // Name Validation
        if (!nameInput.value.trim()) {
            setInvalid(nameInput);
            isValid = false;
        } else {
            setValid(nameInput);
        }

        // Phone Validation (Indian Phone format - 10 digits starting with 6-9)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
            setInvalid(phoneInput);
            isValid = false;
        } else {
            setValid(phoneInput);
        }

        // Email Validation (Optional, check format if filled)
        const emailValue = emailInput.value.trim();
        if (emailValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                setInvalid(emailInput);
                isValid = false;
            } else {
                setValid(emailInput);
            }
        } else {
            setValid(emailInput); // Empty email is acceptable since optional
        }

        // Date Validation (Must not be blank)
        if (!dateInput.value) {
            setInvalid(dateInput);
            isValid = false;
        } else {
            // Check if date is today or in the future
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            if (selectedDate < today) {
                document.getElementById('dateError').innerText = "તારીખ ભૂતકાળની ન હોવી જોઈએ";
                setInvalid(dateInput);
                isValid = false;
            } else {
                setValid(dateInput);
            }
        }

        // Event Type Selection
        if (!typeInput.value) {
            setInvalid(typeInput);
            isValid = false;
        } else {
            setValid(typeInput);
        }

        return isValid;
    };

    // Clear validation error borders instantly on inputs
    const inputs = [nameInput, phoneInput, emailInput, dateInput, typeInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    setValid(input);
                }
            });
            input.addEventListener('change', () => {
                if (input.value) {
                    setValid(input);
                }
            });
        }
    });

    // Form Submit Event Handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Show success panel inside the form box
                if (successMsgPanel) {
                    successMsgPanel.classList.add('show');
                }
            }
        });
    }

    // Export closeSuccessMessage to global window so button inline onclick works
    window.closeSuccessMessage = () => {
        if (successMsgPanel) {
            successMsgPanel.classList.remove('show');
        }
        if (bookingForm) {
            bookingForm.reset();
            // Reset placeholders-active class styling
            inputs.forEach(input => {
                if (input) setValid(input);
            });
        }
    };

    // Package auto-selector helper function
    window.selectPackage = (packageName) => {
        const selectBox = document.getElementById('package');
        if (selectBox) {
            // Map inputs to match select option values
            if (packageName.includes('Silver')) {
                selectBox.value = 'silver';
            } else if (packageName.includes('Gold')) {
                selectBox.value = 'gold';
            } else if (packageName.includes('Platinum')) {
                selectBox.value = 'platinum';
            }
            
            // Trigger change event to ensure float labels update correctly
            selectBox.dispatchEvent(new Event('change'));
            
            // Smooth scroll down to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
});
