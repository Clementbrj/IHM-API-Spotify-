const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Définition des options Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Projet React + Node.js",
            version: "1.0.0",
            description: "Documentation de l'API avec Swagger",
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ BearerAuth: [] }],
        servers: [
            {
                url: "http://localhost:3000", // Modifie si ton backend tourne sur un autre port
            },
        ],
    },
    apis: ["./*.js", "./spotify/*.js"], // Mets le bon chemin vers tes fichiers de routes
};

// Générer la documentation Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
