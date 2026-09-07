/**
 * Project: Video Learning Platform
 * Author: Janhavi Mayekar
 * Role: DevOps & Cloud Engineer
 * Description: Node.js/Express app deployed via CI/CD using GitHub Actions
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// About route - project & author info
app.get('/api/about', (req, res) => {
  res.json({
    author: 'Janhavi Mayekar',
    role: 'DevOps & Cloud Engineer',
    pipeline: 'CI/CD with GitHub Actions'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Maintained by Janhavi Mayekar (DevOps & Cloud Engineer)`);
});