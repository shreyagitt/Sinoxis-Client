export const PERMISSIONS_CONFIG = [
  {
    key: "dashboard",
    label: "Dashboard",
  },
  {
    key: "release",
    label: "Releases",
  },
  {
    key: "artists",
    label: "Artists",
  },
  {
    key: "labels",
    label: "Labels",
  },
  {
    key: "revenueReports",
    label: "Revenue Reports",
    children: [
      { key: "revenueReportList", label: "Revenue Report List" },
      { key: "totalRevenue", label: "Total Revenue" },
      { key: "requestPayment", label: "Request Payment" },
    ],
  },
  {
    key: "services",
    label: "Services",
    children: [
      { key: "youtubeOACRequest", label: "YouTube OAC Request" },
      { key: "youtubeClaimRelease", label: "YouTube Claim Release" },
      { key: "socialMediaLinks", label: "Social Media Links" },
      { key: "facebookClaimRelease", label: "Facebook Claim Release" },
      { key: "metadataUpdateRequest", label: "Metadata Update Request" },
    ],
  },
  {
    key: "requests",
    label: "Requests",
    children: [
      { key: "copyrightClaim", label: "Copyright Claim" },
      { key: "officialArtistChannel", label: "Official Artist Channel" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    children: [
      { key: "passwordChange", label: "Password Change" },
      { key: "bankDetails", label: "Bank Details" },
    ],
  },
];