import { NextRequest, NextResponse } from "next/server";
import { getAllRequests, createRequest } from "@/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = getAllRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const contactPerson = data.contactPerson || data.contactName;
    if (!data.companyName || !contactPerson || !data.phone || !data.email || !data.eventName) {
      return NextResponse.json(
        { error: "companyName, contactPerson, phone, email, and eventName are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const companyRequest = createRequest({
      companyName: data.companyName,
      contactPerson: contactPerson,
      phone: data.phone,
      email: data.email,
      eventName: data.eventName,
      eventType: data.eventType || "",
      eventDate: data.eventDate || "",
      location: data.location || "",
      volunteersRequired: data.volunteersRequired || 1,
      requiredSkills: data.requiredSkills || [],
      additionalRequirements: data.additionalRequirements || "",
    });

    return NextResponse.json(companyRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
