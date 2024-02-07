export const fetchTaskSchema = {
  tags: ["Offers"],
  querystring: {
    type: "object",
    properties: {
      countries: {
        type: "string",
        description:
          "Comma separated list of country codes (ISO 3166-1 alpha- 2) to filter tasks by.If not provided, all available tasks will be returned",
      },
      page_number: {
        type: "number",
        default: 1,
      },
      platform: {
        type: "string",
        description: "Comma separated list of platforms ('android', 'ios')",
      },
      featured: {
        type: "boolean",
        default: false,
      },
      network: { type: "string" },
      category: { type: "number" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "number" },
        data: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  instructions: { type: "string" },
                  id: { type: "number" },
                  network: { type: "string" },
                  offer_id: { type: "string" },
                  category_id: { type: "number" },
                  image: { type: "string" },
                  url: { type: "string" },
                  payout: { type: "string" },
                  countries: { type: "array", items: { type: "string" } },
                  platforms: { type: "array", items: { type: "string" } },
                  status: { type: "string" },
                  is_featured: { type: "number" },
                  goals_count: { type: "number" },
                  goals: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        id: { type: "string" },
                        payout: { type: "number" },
                      },
                    },
                  },
                  provider: {
                    type: "object",
                    properties: {
                      code: { type: "string" },
                      name: { type: "string" },
                      icon: { type: "string" },
                    },
                  },
                  category: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      id: { type: "number" },
                      icon: { type: ["string", "null"] },
                      bg_color: { type: "string" },
                      sort_order: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
        error: { type: "number" },
        msg: { type: ["null", "string"] },
      },
    },
  },
};
