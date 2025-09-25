const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Patients API',
        description: 'Project2 API',
    },
    host: 'cse341-project2-0enf.onrender.com',
    schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);