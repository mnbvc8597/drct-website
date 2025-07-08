// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const nav = document.querySelector('nav ul');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('nav ul').style.display = 'none';
            }
        }
    });
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 300) {
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

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
    }
});

// Registration Form Submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        scheme: document.getElementById('scheme').value
    };
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Registration successful! We will contact you soon.');
            this.reset();
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error with your registration. Please try again later.');
    }
});

// Load dynamic content from MongoDB
async function loadDynamicContent() {
    try {
        // Load Faculty
        const facultyRes = await fetch('/api/faculty');
        const faculty = await facultyRes.json();
        const facultyGrid = document.querySelector('.faculty-grid');
        
        faculty.forEach(member => {
            facultyGrid.innerHTML += `
                <div class="faculty-card">
                    <img src="${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p>${member.position}</p>
                    <p>${member.qualification}</p>
                </div>
            `;
        });
        
        // Load Success Stories
        const storiesRes = await fetch('/api/stories');
        const stories = await storiesRes.json();
        const storiesGrid = document.querySelector('.stories-grid');
        
        stories.forEach(story => {
            storiesGrid.innerHTML += `
                <div class="story-card">
                    <h3>${story.title}</h3>
                    <p>${story.description}</p>
                    <p class="author">- ${story.author}</p>
                </div>
            `;
        });
        
        // Load Announcements
        const announcementsRes = await fetch('/api/announcements');
        const announcements = await announcementsRes.json();
        const announcementsList = document.querySelector('.announcements-list');
        
        announcements.forEach(announcement => {
            announcementsList.innerHTML += `
                <div class="announcement-item">
                    <h3>${announcement.title}</h3>
                    <p>${announcement.content}</p>
                    <small>${new Date(announcement.date).toLocaleDateString()}</small>
                </div>
            `;
        });
        
        // Load Gallery Images
        const galleryRes = await fetch('/api/gallery');
        const gallery = await galleryRes.json();
        const galleryGrid = document.querySelector('.gallery-grid');
        
        gallery.forEach(image => {
            galleryGrid.innerHTML += `
                <img src="${image.url}" alt="${image.caption}">
            `;
        });
        
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
});