export async function POST(request: Request) {
  try {
    const { email, company, industry, brief } = await request.json();

    if (!email || !company || !industry || !brief) {
      return Response.json(
        { error: "Missing required fields: email, company, industry, brief" },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin
    const payload = {
      clinic_name: company,
      contact_name: email.split('@')[0] || 'Website Lead',
      email,
      phone: 'N/A',
      service_type: 'other',
      message: `Industry: ${industry}\n\nAutomation Brief:\n${brief}`,
    }

    const relayResponse = await fetch(`${origin}/api/send-consultancy-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!relayResponse.ok) {
      const relayError = await relayResponse.json().catch(() => ({}))
      return Response.json(
        { error: relayError?.error || 'Failed to relay consultancy request' },
        { status: relayResponse.status || 500 }
      )
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Consultation request error:", error);
    return Response.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
