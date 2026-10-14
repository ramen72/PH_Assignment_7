const prefix = "/employee";

export const employeeRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
      },
      {
        title: "Assets",
        url: `${prefix}/assets`,
      },
      {
        title: "Asset Categories",
        url: `${prefix}/asset-categories`,
      },
      {
        title: "Assignments",
        url: `${prefix}/asset-assignments`,
      },
      {
        title: "Requests",
        url: `${prefix}/asset-requests`,
      },
    ],
  },
  {
    title: "Procurement & Finance",
    items: [
      {
        title: "Purchases",
        url: `${prefix}/asset-purchases`,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
      },
    ],
  },
];
