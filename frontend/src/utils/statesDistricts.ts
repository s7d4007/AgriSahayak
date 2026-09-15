// Indian States and Their Districts
export const STATES_DISTRICTS: Record<string, string[]> = {
  "maharashtra": ["Pune", "Nashik", "Sangli", "Kolhapur", "Satara", "Aurangabad", "Solapur", "Ahmednagar"],
  "karnataka": ["Bengaluru", "Mysuru", "Hubli", "Belagavi", "Tumkur", "Chikmagalur", "Shivamogga", "Kodagu"],
  "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Erode", "Kanyakumari", "Villupuram"],
  "uttar-pradesh": ["Agra", "Lucknow", "Kanpur", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Muzaffarnagar"],
  "punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Sangrur", "Moga"],
  "Haryana": ["Hisar", "Rohtak", "Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Karnal"],
  "madhya-pradesh": ["Indore", "Ujjain", "Bhopal", "Gwalior", "Jabalpur", "Khargone", "Mandsaur", "Sehore"],
  "bihar": ["Patna", "Bhagalpur", "Munger", "Darbhanga", "Madhubani", "Sitamarhi", "Araria", "Katihar"],
  "west-bengal": ["Kolkata", "Hooghly", "Howrah", "Darjeeling", "Jalpaiguri", "Murshidabad", "Malda", "Birbhum"],
  "telangana": ["Hyderabad", "Warangal", "Khammam", "Karimnagar", "Vikarabad", "Nizamabad", "Medchal", "Hyder"],
  "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Kurnool", "Nellore", "Kadapa", "Guntur", "Krishna"],
  "jersey": ["Darjeeling", "Jalpaiguri", "Siliguri", "Dinajpur", "Kalimpong", "Kurseong", "Mirik", "Tinchuley"],
  "odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Balasore", "Dhenkanal", "Sambalpur", "Koraput", "Sundargarh"],
  "rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Nagaur", "Hanumangarh", "Jaisalmer", "Barmer", "Bikaner"],
  "assam": ["Guwahati", "Silchar", "Dibrugarh", "Nagaon", "Tinsukia", "Sonitpur", "Kamrup", "Nalbari"],
  "himachal-pradesh": ["Shimla", "Mandi", "Kangra", "Solan", "Kullu", "Chamba", "Bilaspur", "Kinnaur"],
  "gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
  "kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Alappuzha", "Kollam", "Kannur", "Palakkad"],
  "jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh"],
  "chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur", "Rajnandgaon", "Ambikapur", "Mahasamund"],
  "uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rudrapur", "Haldwani", "Roorkee", "Kashipur", "Pithoragarh"]
};

// English names mapping
export const STATE_NAMES_EN: Record<string, string> = {
  "maharashtra": "Maharashtra",
  "karnataka": "Karnataka",
  "tamil-nadu": "Tamil Nadu",
  "uttar-pradesh": "Uttar Pradesh",
  "punjab": "Punjab",
  "haryana": "Haryana",
  "madhya-pradesh": "Madhya Pradesh",
  "bihar": "Bihar",
  "west-bengal": "West Bengal",
  "telangana": "Telangana",
  "andhra-pradesh": "Andhra Pradesh",
  "jersey": "Meghalaya",
  "odisha": "Odisha",
  "rajasthan": "Rajasthan",
  "assam": "Assam",
  "himachal-pradesh": "Himachal Pradesh",
  "gujarat": "Gujarat",
  "kerala": "Kerala",
  "jharkhand": "Jharkhand",
  "chhattisgarh": "Chhattisgarh",
  "uttarakhand": "Uttarakhand"
};

// Hindi names mapping
export const STATE_NAMES_HI: Record<string, string> = {
  "maharashtra": "महाराष्ट्र",
  "karnataka": "कर्नाटक",
  "tamil-nadu": "तमिल नाडु",
  "uttar-pradesh": "उत्तर प्रदेश",
  "punjab": "पंजाब",
  "haryana": "हरियाणा",
  "madhya-pradesh": "मध्य प्रदेश",
  "bihar": "बिहार",
  "west-bengal": "पश्चिम बंगाल",
  "telangana": "तेलंगाना",
  "andhra-pradesh": "आंध्र प्रदेश",
  "jersey": "मेघालय",
  "odisha": "ओडिशा",
  "rajasthan": "राजस्थान",
  "assam": "असम",
  "himachal-pradesh": "हिमाचल प्रदेश",
  "gujarat": "गुजरात",
  "kerala": "केरल",
  "jharkhand": "झारखंड",
  "chhattisgarh": "छत्तीसगढ़",
  "uttarakhand": "उत्तराखंड"
};

// Get all states
export const getAllStates = () => Object.keys(STATES_DISTRICTS);

// Get districts for a state
export const getDistrictsForState = (state: string): string[] => {
  return STATES_DISTRICTS[state] || [];
};
