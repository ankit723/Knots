export const sidebarLinks = [
    {
      imgURL: "/assets/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/search.svg",
      route: "/search",
      label: "Search",
    },
    {
      imgURL: "/assets/heart.svg",
      route: "/activity",
      label: "Activity",
    },
    {
      imgURL: "/assets/create.svg",
      route: "/create-knot",
      label: "Create knot",
    },
    {
      imgURL: "/assets/community.svg",
      route: "/communities",
      label: "Communities",
    },
    {
      imgURL: "/assets/user.svg",
      route: "/profile",
      label: "Profile",
    },
    {
      imgURL: "/assets/tag.svg",
      route: "/connect-app",
      label: "Connect Apps",
    },
  ];
  
  export const profileTabs = [
    { value: "knots", label: "Knots", icon: "/assets/reply.svg" },
    { value: "communities", label: "Communities", icon: "/assets/community.svg" },
  ];
  
  export const communityTabs = [
    { value: "knots", label: "Knots", icon: "/assets/reply.svg" },
    { value: "members", label: "Members", icon: "/assets/members.svg" },
    { value: "requests", label: "Requests", icon: "/assets/request.svg" },
    { value: "postKnot", label: "Post Knot", icon: "/assets/reply.svg" },
  ];

  export const communityChildTabs = [
    { value: "createdCommunities", label: "Communities Created", icon: "/assets/community.svg" },
    { value: "addedCommunities", label: "Communities Added", icon: "/assets/members.svg" },
  ];