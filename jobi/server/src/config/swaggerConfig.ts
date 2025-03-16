const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "jobi",
      version: "1.0.0",
      description: "API documentation for the jobi",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
