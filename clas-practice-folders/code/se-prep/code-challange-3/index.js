// API Configuration
const API_BASE_URL = 'http://localhost:3000';
const POSTS_ENDPOINT = `${API_BASE_URL}/posts`;

// DOM Elements
const postListContainer = document.querySelector('.post-list-container');
const postDetailsSection = document.querySelector('#post-details');
const emptyState = document.querySelector('.empty-state');
const postContent = document.querySelector('.post-content');
const newPostForm = document.querySelector('#post-form');
const editPostForm = document.querySelector('#post-edit-form');

// Main function that initializes the app
function main() {
  displayPosts();
  setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
  // New post form submission
  newPostForm.addEventListener('submit', handleNewPostSubmit);
  
  // Edit post form submission
  editPostForm.addEventListener('submit', handleEditPostSubmit);
  
  // Edit cancel button
  document.querySelector('.cancel-btn').addEventListener('click', hideEditForm);
}

// Display all posts
async function displayPosts() {
  try {
    showLoading(postListContainer);
    const posts = await fetchPosts();
    
    if (posts.length === 0) {
      showEmptyState(postListContainer);
      return;
    }
    
    renderPostList(posts);
  } catch (error) {
    showError(postListContainer, 'Failed to load posts');
    console.error('Error loading posts:', error);
  }
}

// Fetch all posts from API
async function fetchPosts() {
  const response = await fetch(POSTS_ENDPOINT);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
}

// Render the list of posts
function renderPostList(posts) {
  postListContainer.innerHTML = '';
  
  const fragment = document.createDocumentFragment();
  
  posts.forEach(post => {
    const postElement = createPostElement(post);
    fragment.appendChild(postElement);
  });
  
  postListContainer.appendChild(fragment);
}

// Create a single post list item
function createPostElement(post) {
  const li = document.createElement('li');
  li.className = 'post-item';
  
  const button = document.createElement('button');
  button.className = 'post-title-btn';
  button.dataset.id = post.id;
  button.innerHTML = `
    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
    <h3>${post.title}</h3>
  `;
  
  button.addEventListener('click', () => handlePostClick(post.id));
  
  li.appendChild(button);
  return li;
}

// Handle click on a post
async function handlePostClick(postId) {
  try {
    const post = await fetchPost(postId);
    displayPostDetails(post);
  } catch (error) {
    showError(postDetailsSection, 'Failed to load post details');
    console.error('Error loading post:', error);
  }
}

// Fetch single post from API
async function fetchPost(postId) {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}`);
  if (!response.ok) throw new Error('Post not found');
  return await response.json();
}

// Display post details
function displayPostDetails(post) {
  emptyState.classList.add('hidden');
  postContent.classList.add('show');
  
  postContent.querySelector('.post-title').textContent = post.title;
  postContent.querySelector('.post-author').textContent = `By ${post.author}`;
  postContent.querySelector('.post-date').textContent = `On ${post.date}`;
  postContent.querySelector('.like-count').textContent = post.likes;
  postContent.querySelector('.post-body').textContent = post.content;
  
  // Set up action buttons
  const likeBtn = postContent.querySelector('.like-btn');
  likeBtn.onclick = () => handleLikePost(post.id);
  
  const editBtn = postContent.querySelector('.edit-btn');
  editBtn.onclick = () => showEditForm(post);
  
  const deleteBtn = postContent.querySelector('.delete-btn');
  deleteBtn.onclick = () => handleDeletePost(post.id);
}

// Handle new post submission
async function handleNewPostSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(newPostForm);
  const newPost = {
    title: formData.get('title'),
    author: formData.get('author'),
    content: formData.get('content'),
    image: formData.get('image') || null,
    date: new Date().toISOString().split('T')[0],
    likes: 0
  };
  
  try {
    await createPost(newPost);
    newPostForm.reset();
    displayPosts();
  } catch (error) {
    showError(newPostForm, 'Failed to create post');
    console.error('Error creating post:', error);
  }
}

// Create new post via API
async function createPost(postData) {
  const response = await fetch(POSTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  
  if (!response.ok) throw new Error('Failed to create post');
  return await response.json();
}

// Handle edit post submission
async function handleEditPostSubmit(event) {
  event.preventDefault();
  
  const postId = document.getElementById('edit-post-id').value;
  const updatedPost = {
    title: document.getElementById('edit-post-title').value,
    author: document.getElementById('edit-post-author').value,
    content: document.getElementById('edit-post-content').value
  };
  
  try {
    await updatePost(postId, updatedPost);
    hideEditForm();
    displayPosts();
    const refreshedPost = await fetchPost(postId);
    displayPostDetails(refreshedPost);
  } catch (error) {
    showError(editPostForm, 'Failed to update post');
    console.error('Error updating post:', error);
  }
}

// Update post via API
async function updatePost(postId, postData) {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  
  if (!response.ok) throw new Error('Failed to update post');
  return await response.json();
}

// Handle post like
async function handleLikePost(postId) {
  try {
    const post = await fetchPost(postId);
    const updatedPost = await updatePost(postId, {
      likes: post.likes + 1
    });
    displayPostDetails(updatedPost);
  } catch (error) {
    showError(postDetailsSection, 'Failed to like post');
    console.error('Error liking post:', error);
  }
}

// Handle post deletion
async function handleDeletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    await deletePost(postId);
    postContent.classList.remove('show');
    emptyState.classList.remove('hidden');
    displayPosts();
  } catch (error) {
    showError(postDetailsSection, 'Failed to delete post');
    console.error('Error deleting post:', error);
  }
}

// Delete post via API
async function deletePost(postId) {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Failed to delete post');
}

// Show edit form with post data
function showEditForm(post) {
  document.getElementById('edit-post-id').value = post.id;
  document.getElementById('edit-post-title').value = post.title;
  document.getElementById('edit-post-author').value = post.author;
  document.getElementById('edit-post-content').value = post.content;
  
  document.getElementById('new-post-form').classList.add('hidden');
  document.getElementById('edit-post-form').classList.remove('hidden');
}

// Hide edit form
function hideEditForm() {
  document.getElementById('edit-post-form').classList.add('hidden');
  document.getElementById('new-post-form').classList.remove('hidden');
}

// Utility Functions
function showLoading(container) {
  container.innerHTML = '<div class="loading">Loading posts...</div>';
}

function showEmptyState(container) {
  container.innerHTML = '<div class="empty-message">No posts available</div>';
}

function showError(container, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  container.appendChild(errorElement);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', main);