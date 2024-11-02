/*********************************************************************************
* BTI325 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:NANA KOFI AGYEMAN-PREMPEH Student ID:152656237 Date:10/25/2024
*
* Online (Vercel) Link:https://vercel.com/nkprempehs-projects/assignment3-rhto/CT8CYj7j21Y8byoZKxwzEygm2UR7
*
********************************************************************************/

// Import modules
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const blogService = require('./blog-service');

// Initialize app
const app = express();
const upload = multer(); // No disk storage

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dvb5q5g34',
  api_key: '569391134771446',
  api_secret: 'ANIqgXcbADAgDheg9rFWIqgOVAA',
  secure: true
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST route for adding a new post
app.post('/posts/add', upload.single('featureImage'), async (req, res) => {
  // Helper function for uploading images to Cloudinary
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    // Upload image to Cloudinary
    const uploaded = await streamUpload(req);
    req.body.featureImage = uploaded.url;

    // Add post using blogService
    const postData = await blogService.addPost(req.body);
    res.redirect('/posts');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});

// GET route for retrieving posts with optional filters
app.get('/posts', (req, res) => {
  if (req.query.category) {
    blogService.getPostsByCategory(req.query.category)
      .then(posts => res.json(posts))
      .catch(err => res.status(404).send(err));
  } else if (req.query.minDate) {
    blogService.getPostsByMinDate(req.query.minDate)
      .then(posts => res.json(posts))
      .catch(err => res.status(404).send(err));
  } else {
    blogService.getAllPosts()
      .then(posts => res.json(posts))
      .catch(err => res.status(404).send(err));
  }
});

// GET route for retrieving a post by ID
app.get('/posts/:id', (req, res) => {
  blogService.getPostById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).send(err));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
