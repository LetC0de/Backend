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
            <article class="post-card">
                <div class="post-image-container">
                    <img src="${post.image}" alt="Post image" class="post-image" loading="lazy">
                </div>
                <p class="post-caption">${escapeHtml(post.caption)}</p>
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
