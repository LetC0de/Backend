const API_BASE_URL = 'http://localhost:3000';

async function loadPosts() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const feedGrid = document.getElementById('feedGrid');
    const postCount = document.getElementById('postCount');

    try {
        loading.style.display = 'flex';
        errorMessage.style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/posts`);

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const posts = data.posts || [];

        loading.style.display = 'none';

        if (posts.length === 0) {
            feedGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem; grid-column: 1/-1;">No posts yet. Create your first post!</p>';
            postCount.textContent = '0';
            return;
        }

        postCount.textContent = posts.length;

        feedGrid.innerHTML = posts.reverse().map(post => `
            <article class="post-card" data-post-id="${post._id}">
                <div class="post-image-container">
                    <img src="${post.image}" alt="Post image" class="post-image" loading="lazy">
                </div>
                <div class="post-content">
                    <p class="post-caption">${escapeHtml(post.caption)}</p>
                    <div class="post-actions">
                        <button onclick="editPost('${post._id}', '${escapeHtml(post.caption).replace(/'/g, "\\'")}', '${post.image}')" class="action-btn edit-btn">Edit</button>
                        <button onclick="deletePost('${post._id}')" class="action-btn delete-btn">Delete</button>
                    </div>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('Error loading posts:', error);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/delete-post/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        if (postCard) {
            postCard.remove();
        }

        const postCount = document.getElementById('postCount');
        const currentCount = parseInt(postCount.textContent) || 0;
        postCount.textContent = Math.max(0, currentCount - 1);

        const feedGrid = document.getElementById('feedGrid');
        if (feedGrid.children.length === 0) {
            feedGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem; grid-column: 1/-1;">No posts yet. Create your first post!</p>';
        }

    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
    }
}

function editPost(postId, caption, imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Post</h3>
                <button onclick="closeModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-section">
                    <label class="form-label">Caption</label>
                    <textarea id="editCaption" rows="4" maxlength="500">${caption}</textarea>
                    <div class="char-count">
                        <span id="editCharCount">${caption.length}</span> / 500
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="closeModal()" class="cancel-btn">Cancel</button>
                    <button onclick="updatePost('${postId}')" class="save-btn">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = document.getElementById('editCaption');
    const charCount = document.getElementById('editCharCount');
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });
    textarea.focus();
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

async function updatePost(postId) {
    const caption = document.getElementById('editCaption').value.trim();

    if (!caption) {
        alert('Caption cannot be empty');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/update-post/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ caption })
        });

        if (!response.ok) {
            throw new Error('Failed to update post');
        }

        const data = await response.json();

        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        if (postCard) {
            const captionElement = postCard.querySelector('.post-caption');
            if (captionElement) {
                captionElement.textContent = caption;
            }
        }

        closeModal();

    } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post. Please try again.');
    }
}

function initCreatePage() {
    const form = document.getElementById('createPostForm');
    const imageInput = document.getElementById('imageInput');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');
    const captionInput = document.getElementById('captionInput');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                imageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                uploadPlaceholder.style.display = 'none';
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', function() {
        imageInput.value = '';
        uploadPlaceholder.style.display = 'block';
        imagePreview.style.display = 'none';
        previewImg.src = '';
    });

    captionInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        const imageFile = imageInput.files[0];
        const caption = captionInput.value.trim();

        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        if (!caption) {
            alert('Please enter a caption');
            return;
        }

        formData.append('image', imageFile);
        formData.append('caption', caption);

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loader').style.display = 'inline-block';

        try {
            const response = await fetch(`${API_BASE_URL}/create-post`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const data = await response.json();
            console.log('Post created:', data);

            form.style.display = 'none';
            successMessage.style.display = 'block';

        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');

            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
}
