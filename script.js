document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });
            
            // Show selected section
            const activeSection = document.getElementById(sectionId);
            activeSection.classList.remove('hidden-section');
            activeSection.classList.add('active-section');
            
            // Scroll to section
            setTimeout(() => {
                activeSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    });
    
    // Scroll down button
    const scrollDown = document.querySelector('.scroll-down');
    scrollDown.addEventListener('click', () => {
        document.querySelector('#posts').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Parallax effect
    const parallaxBg = document.querySelector('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
    
    // Form submissions
    const forms = {
        'writing-form': 'writing',
        'poetry-form': 'poetry',
        'discussion-form': 'discussion'
    };
    
    Object.keys(forms).forEach(formId => {
        const form = document.getElementById(formId);
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = forms[formId];
            const title = this.querySelector('input[type="text"]').value;
            const content = this.querySelector('textarea').value;
            const author = this.querySelectorAll('input[type="text"]')[1].value || 'Anonymous';
            
            addPost(type, title, content, author);
            
            // Reset form
            this.reset();
            
            // Show success message
            showNotification('Post published successfully!');
            
            // Scroll to posts
            setTimeout(() => {
                document.querySelector('#posts').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        });
    });
    
    // Filter posts
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterPosts(filter);
        });
    });
    
    // Store posts
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Initialize posts display
    renderPosts();
    
    // Add new post
    function addPost(type, title, content, author) {
        const newPost = {
            id: Date.now(),
            type,
            title,
            content,
            author,
            date: new Date().toLocaleDateString()
        };
        
        posts.unshift(newPost);
        savePosts();
        renderPosts();
    }
    
    // Save posts to localStorage
    function savePosts() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    
    // Render posts
    function renderPosts() {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">No posts yet. Be the first to share!</p>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }
    
    // Create post element
    function createPostElement(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.setAttribute('data-type', post.type);
        
        // Capitalize first letter of type
        const typeDisplay = post.type.charAt(0).toUpperCase() + post.type.slice(1);
        
        postCard.innerHTML = `
            <div class="post-header">
                <span class="post-type">${typeDisplay}</span>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-author">By ${post.author} • ${post.date}</p>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        `;
        
        return postCard;
    }
    
    // Filter posts by type
    function filterPosts(filter) {
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-type') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--accent);
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .no-posts {
            text-align: center;
            grid-column: 1 / -1;
            padding: 2rem;
            color: var(--secondary);
        }
    `;
    document.head.appendChild(style);
});

// Add these functions to the script.js file

// Modify the createPostElement function to include author link
function createPostElement(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.setAttribute('data-type', post.type);
    
    // Capitalize first letter of type
    const typeDisplay = post.type.charAt(0).toUpperCase() + post.type.slice(1);
    
    postCard.innerHTML = `
        <div class="post-header">
            <span class="post-type">${typeDisplay}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-author">By <span class="author-link" data-author="${post.author}">${post.author}</span> • ${post.date}</p>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
        </div>
    `;
    
    return postCard;
}

// Add this after the renderPosts function
function renderUserPosts(author) {
    const userPostsContainer = document.getElementById('user-posts-container');
    userPostsContainer.innerHTML = '';
    
    const userPosts = posts.filter(post => post.author === author);
    
    if (userPosts.length === 0) {
        userPostsContainer.innerHTML = '<p class="no-posts">No posts found for this author.</p>';
        return;
    }
    
    userPosts.forEach(post => {
        const postElement = createPostElement(post);
        userPostsContainer.appendChild(postElement);
    });
    
    document.getElementById('author-name').textContent = author;
    

    
    // Show user posts section and hide others
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });
    
    document.getElementById('user-posts').classList.remove('hidden-section');
    document.getElementById('user-posts').classList.add('active-section');
    
    // Scroll to user posts section
    setTimeout(() => {
        document.getElementById('user-posts').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Add this event listener at the end of the DOMContentLoaded callback
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('author-link')) {
        const author = e.target.getAttribute('data-author');
        renderUserPosts(author);
    }
});

// Add back button functionality
document.getElementById('home').addEventListener('click', function() {
    // Hide user posts section and show all posts section
    document.getElementById('user-posts').classList.remove('active-section');
    document.getElementById('user-posts').classList.add('hidden-section');
    
    document.getElementById('posts').classList.remove('hidden-section');
    document.getElementById('posts').classList.add('active-section');
    
    // Scroll to posts section
    setTimeout(() => {
        document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
    }, 100);
});