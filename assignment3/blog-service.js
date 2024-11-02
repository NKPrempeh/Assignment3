// In-memory array to store blog posts
let posts = [];

// Add a new post to the in-memory array
function addPost(postData) {
  return new Promise((resolve, reject) => {
    postData.published = postData.published !== undefined;
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
}

// Retrieve all posts
function getAllPosts() {
  return new Promise((resolve, reject) => {
    posts.length > 0 ? resolve(posts) : reject("no results returned");
  });
}

// Retrieve posts by category
function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.category == category);
    filteredPosts.length > 0 ? resolve(filteredPosts) : reject("no results returned");
  });
}

// Retrieve posts by minimum date
function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const filteredPosts = posts.filter(post => new Date(post.postDate) >= minDate);
    filteredPosts.length > 0 ? resolve(filteredPosts) : reject("no results returned");
  });
}

// Retrieve post by ID
function getPostById(id) {
  return new Promise((resolve, reject) => {
    const post = posts.find(post => post.id == id);
    post ? resolve(post) : reject("no result returned");
  });
}

// Export the functions
module.exports = { addPost, getAllPosts, getPostsByCategory, getPostsByMinDate, getPostById };
