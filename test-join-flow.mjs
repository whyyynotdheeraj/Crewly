// test-join-flow.mjs
const BASE = "http://localhost:3000";

async function runJoinTests() {
  console.log("=== VERIFYING VOLUNTEER REGISTRATION ('JOIN AS A VOLUNTEER') FLOW ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Check Navigation Links
  console.log("\n--- 1. Checking Navigation & Homepage Links ---");
  {
    const homeRes = await fetch(`${BASE}/`);
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('href="/join"'), "Homepage has CTA button linking to /join for 'Join as a Volunteer'");

    const navCheck = homeHtml.includes('href="/join"') && homeHtml.includes('Join as Volunteer');
    assert(navCheck, "Navbar correctly links 'Join as Volunteer' to /join (NOT /request)");

    assert(homeHtml.includes('Join Crewly'), "Footer has 'Join Crewly' link for volunteers");
  }

  // 2. Check /join Page Content & Structure
  console.log("\n--- 2. Checking /join Page UI & Fields ---");
  {
    const joinRes = await fetch(`${BASE}/join`);
    assert(joinRes.status === 200, "GET /join returns HTTP 200");
    const joinHtml = await joinRes.text();

    // Verify it is a VOLUNTEER registration form and NOT a company form
    assert(!joinHtml.includes("Tell us what your event needs"), "Confirmation: /join does NOT ask 'Tell us what your event needs'");
    assert(!joinHtml.includes("Company Name"), "Confirmation: /join does NOT ask for 'Company Name'");

    // Verify volunteer fields are present
    assert(joinHtml.includes("Join Crewly as an Event Volunteer"), "Page title is 'Join Crewly as an Event Volunteer'");
    assert(joinHtml.includes("Personal Information"), "Section 1: Personal Information present");
    assert(joinHtml.includes("Full Name"), "Field: Full Name present");
    assert(joinHtml.includes("Profile Photo"), "Field: Profile Photo upload present");
    assert(joinHtml.includes("Phone Number"), "Field: Phone Number present");
    assert(joinHtml.includes("Email Address"), "Field: Email Address present");
    assert(joinHtml.includes("Current Location"), "Field: Location present");
    assert(joinHtml.includes("Age"), "Field: Age present");
    assert(joinHtml.includes("Skills &amp; Expertise") || joinHtml.includes("Skills & Expertise"), "Section 2: Skills & Expertise present");
    assert(joinHtml.includes("Experience Overview"), "Section 3: Experience Overview present");
    assert(joinHtml.includes("Years of Event Experience"), "Field: Years of Experience present");
    assert(joinHtml.includes("Number of Events Worked At"), "Field: Number of Events Worked At present");
    assert(joinHtml.includes("Previous Events Worked At"), "Section 4: Previous Events Worked At present");
    assert(joinHtml.includes("Your Role / Title"), "Field: Role / Title at previous events present");
    assert(joinHtml.includes("Responsibilities &amp; What You Did") || joinHtml.includes("Responsibilities & What You Did"), "Field: Responsibilities / Description present");
    assert(joinHtml.includes("Event Photograph"), "Field: Event Photograph upload present");
    assert(joinHtml.includes("Availability &amp; Additional Information") || joinHtml.includes("Availability & Additional Information"), "Section 5: Availability present");
  }

  // 3. Register a New Volunteer with Experience & Event Photos
  console.log("\n--- 3. Submitting Volunteer Registration ---");
  let registeredId;
  {
    const registrationPayload = {
      name: "Simran Kaur",
      phone: "+91 9811223344",
      email: "simran.kaur@example.com",
      location: "Chandigarh, Punjab",
      age: 23,
      bio: "Energetic and detail-oriented event coordinator with 2 years of on-ground event management experience. Skilled at crowd handling and VIP hospitality.",
      yearsExperience: 2,
      eventsCompleted: 12,
      skills: ["Crowd Handling", "Registration", "Hospitality", "VIP Liaison"],
      availability: "available",
      verified: true,
      profileImage: null,
      experiences: [
        {
          eventName: "Chandigarh Music Carnival 2024",
          eventType: "Festival",
          role: "Crowd Control Lead",
          year: 2024,
          description: "Managed front row crowd safety and entry barricades for 4,000+ festival attendees.",
          images: ["/uploads/experiences/carnival.jpg"],
        },
        {
          eventName: "Punjab Startup Conclave",
          eventType: "Conference",
          role: "VIP Registration Coordinator",
          year: 2024,
          description: "Welcomed government dignitaries and keynote speakers at the VIP lounge.",
          images: [],
        },
      ],
    };

    const regRes = await fetch(`${BASE}/api/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationPayload),
    });

    assert(regRes.status === 201, "Volunteer registration submitted successfully (HTTP 201)");
    const registeredVol = await regRes.json();
    registeredId = registeredVol.id;
    assert(registeredId !== undefined, `Registered volunteer assigned ID: ${registeredId}`);
    assert(registeredVol.name === "Simran Kaur", "Volunteer name saved accurately");
    assert(registeredVol.verified === true, "Registered volunteer profile is verified (shows verified badge)");
    assert(Array.isArray(registeredVol.experiences) && registeredVol.experiences.length === 2, "Registered volunteer past events saved (2 events)");
  }

  // 4. Verify Volunteer appears in Directory Searches and Filters
  console.log("\n--- 4. Verifying Volunteer Search & Filters in Directory ---");
  {
    // Search by Name
    const nameSearch = await (await fetch(`${BASE}/api/volunteers?search=Simran`)).json();
    assert(nameSearch.some(v => v.id === registeredId), "Search by name 'Simran' finds the new volunteer");

    // Filter by Location
    const locSearch = await (await fetch(`${BASE}/api/volunteers?location=Chandigarh`)).json();
    assert(locSearch.some(v => v.id === registeredId), "Filter by location 'Chandigarh' includes the new volunteer");

    // Filter by Skill
    const skillSearch = await (await fetch(`${BASE}/api/volunteers?skill=VIP Liaison`)).json();
    assert(skillSearch.some(v => v.id === registeredId), "Filter by skill 'VIP Liaison' includes the new volunteer");

    // Filter by Availability
    const availSearch = await (await fetch(`${BASE}/api/volunteers?availability=available`)).json();
    assert(availSearch.some(v => v.id === registeredId), "Filter by availability 'available' includes the new volunteer");

    // Filter by Min Experience
    const expSearch = await (await fetch(`${BASE}/api/volunteers?minExperience=2`)).json();
    assert(expSearch.some(v => v.id === registeredId), "Filter by minExperience=2 includes the new volunteer");

    // Filter by Verified
    const verSearch = await (await fetch(`${BASE}/api/volunteers?verified=true`)).json();
    assert(verSearch.some(v => v.id === registeredId), "Filter by verified=true includes the new volunteer");
  }

  // 5. Verify Public Volunteer Profile Page
  console.log("\n--- 5. Checking Public Volunteer Profile Page ---");
  {
    const profilePageRes = await fetch(`${BASE}/volunteers/${registeredId}`);
    assert(profilePageRes.status === 200, `Public profile /volunteers/${registeredId} returns HTTP 200`);

    const apiProfile = await (await fetch(`${BASE}/api/volunteers/${registeredId}`)).json();
    assert(apiProfile.name === "Simran Kaur", "Profile belongs to Simran Kaur");
    assert(apiProfile.verified === true, "Profile has verified status true");
    assert(apiProfile.phone === undefined, "Security: Volunteer phone number is NOT exposed publicly");
    assert(apiProfile.experiences.length === 2, "Profile displays both past event experience records");
    assert(apiProfile.experiences.some(e => e.eventName.includes("Music Carnival")), "Experience displays 'Chandigarh Music Carnival 2024'");
  }

  // 6. Verify Admin Access to Newly Registered Volunteer
  console.log("\n--- 6. Verifying Admin View of Registered Volunteer ---");
  {
    // Login as admin
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "crewly2024" }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    const cookie = setCookie.split(";")[0];

    // Fetch volunteer with admin auth -> phone number is visible
    const adminVolRes = await fetch(`${BASE}/api/volunteers/${registeredId}`, {
      headers: { Cookie: cookie },
    });
    const adminVol = await adminVolRes.json();
    assert(adminVol.phone === "+91 9811223344", "Admin can see volunteer contact phone number for hiring coordination");
  }

  // 7. Verify Company Request Form still intact at /request
  console.log("\n--- 7. Verifying Company Request Form at /request is intact ---");
  {
    const reqRes = await fetch(`${BASE}/request`);
    assert(reqRes.status === 200, "/request page returns HTTP 200");
    const reqHtml = await reqRes.text();
    assert(reqHtml.includes("Tell us what your event needs"), "/request is the Company Request Form ('Tell us what your event needs')");
    assert(reqHtml.includes("Company Name"), "/request includes Company Name field");
  }

  console.log("\n=======================================================");
  console.log(`VOLUNTEER REGISTRATION TEST RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================");

  if (failed > 0) process.exit(1);
}

runJoinTests().catch(err => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
