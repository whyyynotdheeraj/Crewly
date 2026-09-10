import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const sampleData = {
  volunteers: [
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      location: "Jaipur, Rajasthan",
      bio: "Dedicated event volunteer with over 2 years of experience in managing large-scale events. Known for excellent crowd management skills and a calm demeanor under pressure. Passionate about creating seamless event experiences for attendees and organizers alike.",
      yearsExperience: 2,
      eventsCompleted: 18,
      skills: ["Event Management", "Crowd Handling", "Registration", "Hospitality", "Guest Management"],
      availability: "available",
      verified: true,
      profileImage: null,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-06-15T10:00:00.000Z",
    },
    {
      id: 2,
      name: "Priya Patel",
      phone: "9876543211",
      location: "Mumbai, Maharashtra",
      bio: "Experienced event professional specializing in guest registration and hospitality services. Fluent in Hindi, English, and Gujarati. Has worked with some of Mumbai's top event management companies and brings a warm, professional approach to every event.",
      yearsExperience: 3,
      eventsCompleted: 25,
      skills: ["Registration", "Guest Management", "Hospitality", "Sales", "Social Media"],
      availability: "available",
      verified: true,
      profileImage: null,
      createdAt: "2024-02-10T10:00:00.000Z",
      updatedAt: "2024-06-10T10:00:00.000Z",
    },
    {
      id: 3,
      name: "Arjun Mehta",
      phone: "9876543212",
      location: "Delhi",
      bio: "Creative professional with a background in stage coordination and event photography. Skilled at managing backstage operations and capturing memorable moments. Has experience with corporate conferences, cultural festivals, and live performances.",
      yearsExperience: 4,
      eventsCompleted: 32,
      skills: ["Stage Coordination", "Photography", "Event Management", "Promotion", "Crowd Management"],
      availability: "available",
      verified: true,
      profileImage: null,
      createdAt: "2024-01-20T10:00:00.000Z",
      updatedAt: "2024-05-20T10:00:00.000Z",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      phone: "9876543213",
      location: "Hyderabad, Telangana",
      bio: "Hospitality expert with a knack for promotion and social media coverage at events. Great at creating welcoming atmospheres and ensuring VIP guests receive premium attention. Experienced in both indoor and outdoor event settings.",
      yearsExperience: 2,
      eventsCompleted: 14,
      skills: ["Hospitality", "Promotion", "Social Media", "Guest Management", "Registration"],
      availability: "available",
      verified: true,
      profileImage: null,
      createdAt: "2024-03-05T10:00:00.000Z",
      updatedAt: "2024-06-05T10:00:00.000Z",
    },
    {
      id: 5,
      name: "Vikram Singh",
      phone: "9876543214",
      location: "Chandigarh, Punjab",
      bio: "Reliable crowd management specialist with experience in security coordination at major events. Former sports event coordinator with strong leadership abilities. Excellent at maintaining order during high-pressure situations while keeping the atmosphere positive.",
      yearsExperience: 5,
      eventsCompleted: 40,
      skills: ["Crowd Management", "Event Management", "Stage Coordination", "Registration", "Hospitality"],
      availability: "unavailable",
      verified: true,
      profileImage: null,
      createdAt: "2024-01-10T10:00:00.000Z",
      updatedAt: "2024-04-10T10:00:00.000Z",
    },
    {
      id: 6,
      name: "Ananya Iyer",
      phone: "9876543215",
      location: "Chennai, Tamil Nadu",
      bio: "Social media savvy event volunteer who combines photography skills with real-time social media coverage. Experienced in creating engaging content during live events. Has covered cultural festivals, tech conferences, and corporate meetups across South India.",
      yearsExperience: 1,
      eventsCompleted: 8,
      skills: ["Social Media", "Photography", "Promotion", "Registration", "Guest Management"],
      availability: "available",
      verified: false,
      profileImage: null,
      createdAt: "2024-04-01T10:00:00.000Z",
      updatedAt: "2024-06-01T10:00:00.000Z",
    },
    {
      id: 7,
      name: "Karan Gupta",
      phone: "9876543216",
      location: "Lucknow, Uttar Pradesh",
      bio: "Energetic and persuasive volunteer with strong sales and promotion skills. Great at engaging with event attendees and driving participation. Has experience with exhibitions, trade fairs, and product launch events.",
      yearsExperience: 2,
      eventsCompleted: 12,
      skills: ["Sales", "Promotion", "Crowd Handling", "Event Management", "Hospitality"],
      availability: "available",
      verified: false,
      profileImage: null,
      createdAt: "2024-03-15T10:00:00.000Z",
      updatedAt: "2024-05-15T10:00:00.000Z",
    },
    {
      id: 8,
      name: "Meera Nair",
      phone: "9876543217",
      location: "Kochi, Kerala",
      bio: "Organized and detail-oriented event volunteer specializing in registration and event management. Known for meticulous planning and execution. Has extensive experience with international conferences and cultural festivals in Kerala.",
      yearsExperience: 3,
      eventsCompleted: 22,
      skills: ["Event Management", "Registration", "Guest Management", "Hospitality", "Stage Coordination"],
      availability: "available",
      verified: true,
      profileImage: null,
      createdAt: "2024-02-20T10:00:00.000Z",
      updatedAt: "2024-06-20T10:00:00.000Z",
    },
  ],
  experiences: [
    // Rahul's experiences
    { id: 1, volunteerId: 1, eventName: "Jaipur Literature Festival", eventType: "Festival", role: "Event Volunteer", year: 2025, description: "Managed crowd flow at entry points, assisted with attendee registration, and coordinated with the security team. Handled over 500 registrations per day and received commendation for efficiency.", images: [] },
    { id: 2, volunteerId: 1, eventName: "Rajasthan International Folk Festival", eventType: "Cultural Festival", role: "Crowd Management Lead", year: 2024, description: "Led a team of 5 volunteers for crowd management during the main stage performances. Ensured smooth transitions between acts and managed VIP seating areas.", images: [] },
    { id: 3, volunteerId: 1, eventName: "TEDx Jaipur", eventType: "Conference", role: "Registration Coordinator", year: 2024, description: "Handled check-in process for 300+ attendees. Set up and managed the registration desk, distributed event materials, and guided attendees to their seats.", images: [] },
    // Priya's experiences
    { id: 4, volunteerId: 2, eventName: "Lakme Fashion Week", eventType: "Fashion Show", role: "Guest Management Executive", year: 2025, description: "Managed VIP guest list and seating arrangements for multiple shows. Coordinated backstage hospitality and ensured seamless guest experiences throughout the 5-day event.", images: [] },
    { id: 5, volunteerId: 2, eventName: "Mumbai International Film Festival", eventType: "Festival", role: "Registration Lead", year: 2024, description: "Led the registration team for the film festival, processing credentials for filmmakers, media, and attendees. Managed a team of 8 registration volunteers.", images: [] },
    // Arjun's experiences
    { id: 6, volunteerId: 3, eventName: "India International Trade Fair", eventType: "Exhibition", role: "Stage Coordinator", year: 2025, description: "Coordinated all stage activities including sound checks, performer schedules, and audience management for the cultural program pavilion. Managed 20+ performances over 14 days.", images: [] },
    { id: 7, volunteerId: 3, eventName: "Delhi Comic Con", eventType: "Convention", role: "Event Photographer & Coordinator", year: 2024, description: "Served dual role as event photographer and floor coordinator. Captured over 2000 photos of cosplayers, panels, and event highlights. Managed crowd flow at popular photo zones.", images: [] },
    // Sneha's experiences
    { id: 8, volunteerId: 4, eventName: "Hyderabad Comic Con", eventType: "Convention", role: "Hospitality Coordinator", year: 2025, description: "Managed the hospitality desk and coordinated food and beverage services for VIP guests and exhibitors. Ensured all special dietary requirements were accommodated.", images: [] },
    { id: 9, volunteerId: 4, eventName: "Global Entrepreneurship Summit", eventType: "Conference", role: "Social Media Volunteer", year: 2024, description: "Provided real-time social media coverage of the summit. Created Instagram stories, live-tweeted key sessions, and generated over 50K impressions during the 3-day event.", images: [] },
    // Vikram's experiences
    { id: 10, volunteerId: 5, eventName: "Pro Kabaddi League - Chandigarh", eventType: "Sports Event", role: "Crowd Management Head", year: 2025, description: "Led crowd management for matches with 5000+ spectators. Coordinated with security personnel, managed entry/exit points, and handled emergency evacuation drills.", images: [] },
    { id: 11, volunteerId: 5, eventName: "Chandigarh International Film Festival", eventType: "Festival", role: "Event Management Lead", year: 2024, description: "Served as the lead volunteer managing event logistics, venue coordination, and celebrity escort services. Coordinated schedules for 50+ film screenings.", images: [] },
    { id: 12, volunteerId: 5, eventName: "NH7 Weekender - Chandigarh", eventType: "Music Festival", role: "Stage Coordination & Security", year: 2024, description: "Managed backstage access and artist coordination for the main stage. Coordinated with 30+ volunteers for crowd safety during headline performances.", images: [] },
    // Ananya's experiences
    { id: 13, volunteerId: 6, eventName: "Chennai International Book Fair", eventType: "Exhibition", role: "Social Media Coordinator", year: 2025, description: "Managed social media accounts during the 10-day book fair. Created engaging content, conducted author interviews for Instagram, and grew the event's social following by 25%.", images: [] },
    { id: 14, volunteerId: 6, eventName: "Pongal Festival Celebration", eventType: "Cultural Festival", role: "Photography Volunteer", year: 2025, description: "Captured traditional dance performances, cooking competitions, and cultural activities. Photos were used in the city's official tourism brochure.", images: [] },
    // Karan's experiences
    { id: 15, volunteerId: 7, eventName: "UP International Trade Show", eventType: "Exhibition", role: "Sales & Promotion Executive", year: 2025, description: "Managed a promotional booth and engaged with 200+ visitors daily. Generated leads for exhibitors and achieved the highest visitor engagement score among all volunteer teams.", images: [] },
    { id: 16, volunteerId: 7, eventName: "Lucknow Mahotsav", eventType: "Cultural Festival", role: "Event Volunteer", year: 2024, description: "Assisted in event promotion, crowd handling during live performances, and managed food court operations. Worked 12-hour shifts during the 10-day festival.", images: [] },
    // Meera's experiences
    { id: 17, volunteerId: 8, eventName: "Kerala International Film Festival", eventType: "Festival", role: "Registration Head", year: 2025, description: "Led the delegate registration process for the 7-day film festival. Managed credentials for 3000+ delegates, filmmakers, and media personnel from 60+ countries.", images: [] },
    { id: 18, volunteerId: 8, eventName: "Kochi-Muziris Biennale", eventType: "Art Exhibition", role: "Guest Management Volunteer", year: 2024, description: "Managed guided tours for international art enthusiasts and VIP guests. Provided detailed information about installations and coordinated with artists for interactive sessions.", images: [] },
    { id: 19, volunteerId: 8, eventName: "TechSummit Kochi", eventType: "Conference", role: "Event Coordinator", year: 2024, description: "Coordinated logistics for a 2-day tech conference with 1500 attendees. Managed session schedules, speaker coordination, and attendee support across 5 parallel tracks.", images: [] },
  ],
  companyRequests: [
    {
      id: 1,
      companyName: "EventPro India",
      contactPerson: "Amit Khanna",
      phone: "9898989898",
      email: "amit@eventproindia.com",
      eventName: "Annual Corporate Gala 2025",
      eventType: "Corporate Event",
      eventDate: "2025-03-15",
      location: "Mumbai, Maharashtra",
      volunteersRequired: 15,
      requiredSkills: ["Event Management", "Guest Management", "Hospitality"],
      additionalRequirements: "Need volunteers experienced with formal corporate events. Dress code: formal attire. Event runs from 6 PM to midnight.",
      status: "pending",
      createdAt: "2024-06-20T10:00:00.000Z",
    },
    {
      id: 2,
      companyName: "Festive Moments Pvt Ltd",
      contactPerson: "Deepika Rao",
      phone: "9797979797",
      email: "deepika@festivemoments.in",
      eventName: "Rajasthan Heritage Wedding",
      eventType: "Wedding",
      eventDate: "2025-02-20",
      location: "Udaipur, Rajasthan",
      volunteersRequired: 25,
      requiredSkills: ["Hospitality", "Guest Management", "Crowd Handling", "Photography"],
      additionalRequirements: "3-day destination wedding event. Accommodation will be provided for volunteers. Need people who can work in outdoor settings.",
      status: "reviewed",
      createdAt: "2024-06-18T10:00:00.000Z",
    },
  ],
  nextIds: {
    volunteers: 9,
    experiences: 20,
    companyRequests: 3,
  },
};

// Seed the database
function seed() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(sampleData, null, 2));
  console.log("Database seeded successfully with sample data!");
  console.log(`  - ${sampleData.volunteers.length} volunteers`);
  console.log(`  - ${sampleData.experiences.length} experiences`);
  console.log(`  - ${sampleData.companyRequests.length} company requests`);
}

seed();
