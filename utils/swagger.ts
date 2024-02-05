export const swaggerOptions = {
  swagger: {
    info: {
      title: "FreeCash Api",
      description: "My Description.",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "Offers", description: "Offers" },
      { name: "Categories", description: "Categories" },
      { name: "Postback", description: "Postback" },
      { name: "Providers", description: "Providers" },
      { name: "Authentication", description: "Authentication" },
    ],
  },
};

export const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};
