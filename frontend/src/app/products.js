// =====================================================
// ZONE360 PRODUCT DATA
// =====================================================
//
// IMPORTANT:
// If you want to change a product later,
// edit the values in THIS FILE.
//
// Example:
//
// price: 2500
//
// Change it to:
//
// price: 3000
//
// The price will automatically update
// throughout the frontend.
// =====================================================


export const products = [

  // ===================================================
  // 1. GPS TRACKING
  // ===================================================

  {
    id: "gps",

    name: "GPS Tracking Devices",

    shortName: "GPS Tracking",

    category: "Vehicle Tracking",

    image: "/src/assets/gps-tracker.png",

    // ================================
    // EDIT PRICE HERE
    // ================================

    price: 2500,

    description:
      "Smart GPS tracking solutions for cars, bikes, lorries, trucks and commercial fleets.",

    features: [
      "Real-time vehicle tracking",
      "Location monitoring",
      "Vehicle movement tracking",
      "Fleet monitoring",
      "Easy installation",
    ],
  },


  // ===================================================
  // 2. EMPLOYEE TRACKING
  // ===================================================

  {
    id: "employee",

    name: "Employee Tracking App",

    shortName: "Employee Tracking",

    category: "Employee Management",

    image: "/src/assets/employee-tracking.png",

    // ================================
    // EDIT PRICE HERE
    // ================================

    price: 5000,

    description:
      "A smart employee tracking solution designed to help businesses monitor field employees and work activities.",

    features: [
      "Employee location tracking",
      "Field employee monitoring",
      "Attendance support",
      "Activity monitoring",
      "Easy-to-use application",
    ],
  },


  // ===================================================
  // 3. CCTV
  // ===================================================

  {
    id: "cctv",

    name: "CCTV Security Systems",

    shortName: "CCTV Systems",

    category: "Security",

    image: "/src/assets/cctv.png",

    // ================================
    // EDIT PRICE HERE
    // ================================

    price: 5000,

    description:
      "Reliable CCTV and security solutions for homes, offices, shops and commercial environments.",

    features: [
      "Security monitoring",
      "Indoor and outdoor solutions",
      "Remote monitoring support",
      "Professional installation",
      "Reliable surveillance",
    ],
  },


  // ===================================================
  // 4. WATER TANK CONTROLLER
  // ===================================================

  {
    id: "water",

    name: "Water Tank Controller",

    shortName: "Water Tank Controller",

    category: "Smart Automation",

    // We don't have the real HD water controller
    // image yet.
    image: null,

    // ================================
    // EDIT PRICE HERE
    // ================================

    price: 5000,

    description:
      "Smart water tank automation designed to simplify water level monitoring and motor control.",

    features: [
      "Automatic water level control",
      "Motor control automation",
      "Water level monitoring",
      "Overflow protection support",
      "Smart home and business automation",
    ],
  },
];


// =====================================================
// PRICE FORMATTER
// =====================================================

export const formatPrice = (price) => {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

};