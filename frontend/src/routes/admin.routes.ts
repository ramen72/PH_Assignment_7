const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
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
        title: "Vendors",
        url: `${prefix}/vendors`,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Maintenance",
        url: `${prefix}/maintenance-records`,
      },
      {
        title: "Users",
        url: `${prefix}/users`,
      },
    ],
  },
  {
    title: "System & Logs",
    items: [
      {
        title: "Audit Logs",
        url: `${prefix}/audit-logs`,
      },
      {
        title: "Notifications",
        url: `${prefix}/notifications`,
      },
    ],
  },
];
