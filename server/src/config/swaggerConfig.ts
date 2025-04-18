const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "job",
      version: "1.0.0",
      description: "API documentation for the job",
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1",
      },
      {
        url: "http://localhost:8080/graphql",
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/routes/profiles/*.ts",
    "./src/routes/auth/*.ts",
    "./src/routes/post/*.ts",
  ]
};

export default swaggerOptions;
