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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});