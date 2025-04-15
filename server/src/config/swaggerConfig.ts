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
        url: "http://localhost:8080/graphql",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
