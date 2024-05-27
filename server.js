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

  if (!projectID || projectID.trim() === '') {
    // Render the home.ejs template with an error message
    return res.render('pages/home', { error: 'Project ID cannot be blank.' });
  }

  try {
    // Query the database to check if the projectID exists
    const project = await prisma.Post.findUnique({
      where: { projectID: projectID }
    });

    console.log('Project data:', project);

    if (!project) {
      // Render the home.ejs template with an error message
      return res.render('pages/home', { error: 'Project ID not found.' });
    }

    // Check if hasSubmitted field is true
    if (project.hasSubmitted) {
      // Render the thanks.ejs template with an error message
      return res.render('pages/thanks', { project, submitRoute: false, completedRoute:false });
    } else {
      // Check if all fields are null
      const fields = ['ach6Mth', 'ach12Mth', 'ach18Mth', 'ach24Mth', 'ach30Mth', 'ach36Mth'];
      const allFieldsNotNull = fields.every(field => project[field] !== null);

      if (allFieldsNotNull) {
        // Render the thanks.ejs template with a message
        return res.render('pages/thanks', { project, submitRoute: false, completedRoute: true });
      } else {
        // Render the project.ejs template with the project data
        return res.render('pages/project', { project });
      }
    }
  } catch (error) {
    console.error('Error querying the database:', error);
    return res.render('pages/home', { error: 'An error occurred while querying the database.' });
  }
});



app.post('/submitDynamicTable', async (req, res) => {
    const { projectID, inputValue } = req.body;


    try {

      // Retrieve the project from the database
      const project = await prisma.Post.findUnique({
        where: { projectID: projectID }
      });
  
  
      // Find the first null column
      const fields = ['ach6Mth', 'ach12Mth', 'ach18Mth', 'ach24Mth', 'ach30Mth', 'ach36Mth'];
      let updateData = {};
      for (const field of fields) {
        if (project[field] === null) {
          updateData[field] = inputValue;
          break;
        }
      }
  
  
      // Update the project in the database
      await prisma.Post.update({
        where: { projectID: projectID },
        data: {
          ...updateData,
          hasSubmitted: true // Set hasSubmitted to TRUE
      }
  });
  
    // Retrieve the updated project data
    const updatedProject = await prisma.Post.findUnique({
      where: { projectID: projectID }
    });

    // Render the thanks page with the updated project data
    console.log('Rendering thanks page with updated project data:', updatedProject);
    res.render('pages/thanks', { project: updatedProject, submitRoute: true, completedRoute: false });
  } catch (error) {
    console.error('Error processing form submission:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
});

app.get('/thanks', async (req, res) => {
  const projectID = req.query.projectID;
  try {
    // Retrieve the updated project data
    const updatedProject = await prisma.Post.findUnique({
      where: { projectID: projectID }
    });

    if (!updatedProject) {
      return res.status(404).send('Project not found');
    }

    res.render('pages/thanks', { project: updatedProject, submitRoute: true, completedRoute:false });
  } catch (error) {
    console.error('Error retrieving updated project data:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});