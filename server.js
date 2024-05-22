// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// Home page
app.get('/', function(req, res) {
    res.render('pages/home');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const projectID = req.body.projectID;

    try {
        // Query the database to check if the projectID exists
        const project = await prisma.Post.findUnique({
            where: { projectID: projectID }
        });
        console.log('Project data:', project);
        if (project) {
            // Render the project.ejs template with the project data
            res.render('pages/project', { project });
        } else {
            // Render the home.ejs template with an error message
            res.render('pages/home', { error: 'Project ID not found.' });
        }
    } catch (error) {
        console.error('Error querying the database:', error);
        res.render('pages/home', { error: 'An error occurred while querying the database.' });
    }
});

app.post('/submitDynamicTable', async (req, res) => {
    const { projectID, inputValue } = req.body;
  
    try {
      // Retrieve the project from the database
      const project = await prisma.Post.findUnique({
        where: { projectID: projectID }
      });
  
      if (!project) {
        return res.status(404).send('Project not found');
      }
  
      // Find the first null column
      const fields = ['ach6Mth', 'ach12Mth', 'ach18Mth', 'ach24Mth', 'ach30Mth', 'ach36Mth'];
      let updateData = {};
      for (const field of fields) {
        if (project[field] === null) {
          updateData[field] = inputValue;
          break;
        }
      }
  
      // If all fields are non-null, return an error
      if (Object.keys(updateData).length === 0) {
        return res.status(400).send('No available columns to update');
      }
  
      // Update the project in the database
      await prisma.Post.update({
        where: { projectID: projectID },
        data: updateData
      });
  
      res.send('Value submitted successfully');
    } catch (error) {
      console.error('Error processing form submission:', error);
      res.status(500).send('Internal Server Error');
    }
  });



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});