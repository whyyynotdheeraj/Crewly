// test-flows.mjs
const BASE = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING CREWLY MVP VERIFICATION SUITE ===");
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

  // FLOW 1: Homepage & Volunteer Directory Search/Filter
  console.log("\n--- FLOW 1: Homepage & Volunteer Directory Search/Filter ---");
  {
    const homeRes = await fetch(`${BASE}/`);
    assert(homeRes.status === 200, "Homepage returns HTTP 200");
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes("Find verified people for your next event"), "Homepage contains hero title");
    assert(homeHtml.includes("Crewly connects event companies"), "Homepage contains subheading");

    const volsRes = await fetch(`${BASE}/volunteers`);
    assert(volsRes.status === 200, "Volunteers page returns HTTP 200");

    const apiVolsRes = await fetch(`${BASE}/api/volunteers`);
    const vols = await apiVolsRes.json();
    assert(Array.isArray(vols) && vols.length >= 8, `Fetched ${vols.length} volunteers from API`);
    assert(vols.every(v => v.phone === undefined), "Security check: Public volunteers API does NOT expose phone numbers");

    // Search by name
    const searchRes = await fetch(`${BASE}/api/volunteers?search=Rahul`);
    const searchData = await searchRes.json();
    assert(searchData.some(v => v.name.includes("Rahul")), "Search by name 'Rahul' returns matching volunteer");

    // Filter by location
    const locRes = await fetch(`${BASE}/api/volunteers?location=Mumbai`);
    const locData = await locRes.json();
    assert(locData.every(v => v.location.includes("Mumbai")), "Filter by location 'Mumbai' works correctly");

    // Filter by skill
    const skillRes = await fetch(`${BASE}/api/volunteers?skill=Photography`);
    const skillData = await skillRes.json();
    assert(skillData.length > 0 && skillData.every(v => v.skills.some(s => s.toLowerCase().includes("photography"))), "Filter by skill 'Photography' works correctly");

    // Filter by verified
    const verifiedRes = await fetch(`${BASE}/api/volunteers?verified=true`);
    const verifiedData = await verifiedRes.json();
    assert(verifiedData.every(v => v.verified === true), "Filter by verified=true returns only verified volunteers");
  }

  // FLOW 2: Volunteer Profile & Details
  console.log("\n--- FLOW 2: Volunteer Profile, Verification & Experience ---");
  {
    const profileRes = await fetch(`${BASE}/volunteers/1`);
    assert(profileRes.status === 200, "Individual profile page /volunteers/1 returns HTTP 200");

    const apiProfileRes = await fetch(`${BASE}/api/volunteers/1`);
    const profile = await apiProfileRes.json();
    assert(profile.name === "Rahul Sharma", "Profile belongs to Rahul Sharma");
    assert(profile.verified === true, "Profile has verified status true");
    assert(profile.phone === undefined, "Security check: Public profile detail does NOT expose phone number");
    assert(Array.isArray(profile.skills) && profile.skills.length > 0, "Profile has skills listed");
    assert(Array.isArray(profile.experiences) && profile.experiences.length >= 2, `Profile has ${profile.experiences?.length} event experiences`);
    assert(profile.experiences.some(e => e.eventName.includes("Jaipur")), "Experience includes Jaipur Literature Festival");
  }

  // FLOW 3: Company Request Submission
  console.log("\n--- FLOW 3: Company Request Submission ---");
  let testRequestId;
  {
    const reqPageRes = await fetch(`${BASE}/request`);
    assert(reqPageRes.status === 200, "Request page /request returns HTTP 200");

    const postData = {
      companyName: "Apex Entertainment Solutions",
      contactPerson: "Rohan Kapoor",
      phone: "+91 9876543210",
      email: "rohan@apexevents.in",
      eventName: "Apex Tech Summit 2025",
      eventType: "Conference",
      eventDate: "2025-11-20",
      location: "Bangalore, Karnataka",
      volunteersRequired: 12,
      requiredSkills: ["Registration", "Crowd Handling", "Stage Coordination"],
      additionalRequirements: "Need punctual volunteers fluent in English and Hindi for badge scanning and speaker support."
    };

    const submitRes = await fetch(`${BASE}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    assert(submitRes.status === 201, "Company request submitted successfully (HTTP 201)");
    const createdReq = await submitRes.json();
    assert(createdReq.id !== undefined, `Created request with ID: ${createdReq.id}`);
    assert(createdReq.status === "pending", "Initial request status is 'pending'");
    testRequestId = createdReq.id;
  }

  // FLOW 4: Admin Authentication & Dashboard
  console.log("\n--- FLOW 4: Admin Authentication & Access Control ---");
  let adminCookie = "";
  {
    // Unauthorized access check
    const unauthRes = await fetch(`${BASE}/api/requests`);
    assert(unauthRes.status === 401, "Unauthorized access to /api/requests returns 401");

    // Invalid login check
    const badLoginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrongpassword" }),
    });
    assert(badLoginRes.status === 401, "Invalid credentials return HTTP 401");

    // Valid login
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "crewly2024" }),
    });
    assert(loginRes.status === 200, "Valid admin login returns HTTP 200");

    const setCookie = loginRes.headers.get("set-cookie");
    assert(setCookie && setCookie.includes("crewly-admin-token"), "Admin session cookie issued");
    adminCookie = setCookie.split(";")[0];

    // Auth check route with cookie
    const checkRes = await fetch(`${BASE}/api/auth/check`, {
      headers: { Cookie: adminCookie },
    });
    const checkData = await checkRes.json();
    assert(checkData.authenticated === true, "Session check confirms authenticated status");

    // Admin can see all requests including the one submitted in Flow 3
    const adminReqsRes = await fetch(`${BASE}/api/requests`, {
      headers: { Cookie: adminCookie },
    });
    const reqs = await adminReqsRes.json();
    assert(reqs.some(r => r.id === testRequestId), "Admin dashboard lists newly submitted company request");
  }

  // FLOW 5: Admin Volunteer CRUD (Add -> Verify -> Public Check)
  console.log("\n--- FLOW 5: Admin Add Volunteer & Experience ---");
  let createdVolunteerId;
  {
    const newVolData = {
      name: "Aditya Verma",
      phone: "+91 9123456780",
      location: "Pune, Maharashtra",
      bio: "Proactive event coordinator specializing in stage setup and VIP coordination.",
      yearsExperience: 3,
      eventsCompleted: 20,
      skills: ["Stage Coordination", "VIP Handling", "Hospitality"],
      availability: "available",
      verified: true,
      profileImage: null,
    };

    const addRes = await fetch(`${BASE}/api/volunteers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify(newVolData),
    });
    assert(addRes.status === 201, "Admin creates volunteer (HTTP 201)");
    const createdVol = await addRes.json();
    createdVolunteerId = createdVol.id;
    assert(createdVolunteerId !== undefined, `Created volunteer ID: ${createdVolunteerId}`);

    // Add experience for this volunteer
    const expData = {
      volunteerId: createdVolunteerId,
      eventName: "Pune Cultural Fest 2025",
      eventType: "Cultural Festival",
      role: "Lead Stage Assistant",
      year: 2025,
      description: "Coordinated artist hospitality and handled onstage gear changeovers for 15 musical acts.",
      images: [],
    };
    const expRes = await fetch(`${BASE}/api/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify(expData),
    });
    assert(expRes.status === 201, "Admin adds experience for volunteer (HTTP 201)");

    // Verify in public directory
    const publicVolRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`);
    const pubVol = await publicVolRes.json();
    assert(pubVol.name === "Aditya Verma", "New volunteer visible in public profile");
    assert(pubVol.verified === true, "New volunteer verified status is true");
    assert(pubVol.experiences.length === 1, "New volunteer shows 1 experience record");
  }

  // FLOW 6: Admin Edit & Verification Toggle
  console.log("\n--- FLOW 6: Admin Edit & Verification Toggle ---");
  {
    // Edit bio and name
    const editRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Aditya S. Verma",
        bio: "Updated: Experienced head of stage logistics and artist liaison.",
      }),
    });
    assert(editRes.status === 200, "Admin updates volunteer (HTTP 200)");

    const updatedPubRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`);
    const updatedPub = await updatedPubRes.json();
    assert(updatedPub.name === "Aditya S. Verma", "Public profile shows updated name");
    assert(updatedPub.bio.startsWith("Updated:"), "Public profile shows updated bio");

    // Unverify volunteer
    const unverifyRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ verified: false }),
    });
    assert(unverifyRes.status === 200, "Admin unverifies volunteer (HTTP 200)");

    const unverVol = await (await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`)).json();
    assert(unverVol.verified === false, "Public profile reflects unverified status (verified = false)");

    // Re-verify
    const reverifyRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ verified: true }),
    });
    assert(reverifyRes.status === 200, "Admin re-verifies volunteer (HTTP 200)");
  }

  // FLOW 7: Admin Delete Volunteer & Request Workflow
  console.log("\n--- FLOW 7: Admin Delete Volunteer & Request Workflow ---");
  {
    // Update company request status
    const updateReqRes = await fetch(`${BASE}/api/requests/${testRequestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ status: "reviewed" }),
    });
    assert(updateReqRes.status === 200, "Admin updates request status to 'reviewed'");

    // Delete created volunteer
    const delRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert(delRes.status === 200, "Admin deletes volunteer (HTTP 200)");

    // Confirm deleted volunteer is gone from public API
    const checkDeletedRes = await fetch(`${BASE}/api/volunteers/${createdVolunteerId}`);
    assert(checkDeletedRes.status === 404, "Deleted volunteer returns 404 on profile lookup");

    // Clean up test request
    const delReqRes = await fetch(`${BASE}/api/requests/${testRequestId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert(delReqRes.status === 200, "Cleaned up test company request");
  }

  // FLOW 8: Companies Landing Page
  console.log("\n--- FLOW 8: For Companies Page ---");
  {
    const compRes = await fetch(`${BASE}/companies`);
    assert(compRes.status === 200, "/companies page returns HTTP 200");
    const compHtml = await compRes.text();
    assert(compHtml.includes("Build your event crew"), "Companies page has appropriate headline");
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
