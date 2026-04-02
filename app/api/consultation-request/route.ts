import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email, company, industry, brief } = await request.json();

    if (!email || !company || !industry || !brief) {
      return Response.json(
        { error: "Missing required fields: email, company, industry, brief" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "AI Blizzard <noreply@beaconhorizons.io>",
      to: "admin@beaconhorizons.io",
      replyTo: email,
      subject: `Automation Audit Request — ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
          <h2>New Automation Audit Request</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Industry:</strong> ${industry}</p>
          <p><strong>Automation Brief:</strong></p>
          <p style="white-space: pre-line;">${brief}</p>
        </div>
      `,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Consultation request error:", error);
    return Response.json(
      { error: "Unable to send request" },
      { status: 500 }
    );
  }
}
