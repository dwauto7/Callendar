import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

type ConsultancyRequest = {
  clinic_name: string
  contact_name: string
  email: string
  phone: string
  service_type: 'custom_integration' | 'advanced_analytics' | 'custom_voice' | 'other'
  message: string
}

// Use the same SMTP/Brevo scheme as staff invite route.
const smtpHost = process.env.EMAIL_HOST || 'smtp-relay.brevo.com'
const smtpPort = parseInt(process.env.EMAIL_PORT || '587')
const smtpSecure = process.env.EMAIL_SECURE === 'true'
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD

if (!smtpUser || !smtpPass) {
  console.warn('SMTP credentials missing: set SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASSWORD fallback).')
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
})

export async function POST(request: NextRequest) {
  try {
    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Email service not configured: missing SMTP credentials' },
        { status: 500 }
      )
    }

    const body: ConsultancyRequest = await request.json()

    // Validate required fields
    if (!body.contact_name || !body.email || !body.clinic_name || !body.phone || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email to admin
    const adminEmail = 'admin@beaconhorizons.io'

    const serviceTypeLabel = {
      custom_integration: 'Custom Integration with Existing Systems',
      advanced_analytics: 'Advanced Analytics & Dashboards',
      custom_voice: 'Custom AI Voice & Training',
      other: 'Other / Not Sure',
    }[body.service_type]

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #40E0FF;">New Consultancy Request</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Contact Name:</strong> ${body.contact_name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Phone:</strong> ${body.phone}</p>
          <p><strong>Clinic Name:</strong> ${body.clinic_name}</p>
          <p><strong>Service Interest:</strong> ${serviceTypeLabel}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #40E0FF; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #555;">${body.message}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #666;">
          This is an automated email from Callendar consultancy form.
        </p>
      </div>
    `

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@beaconhorizons.io',
      to: adminEmail,
      subject: `New Consultancy Request: ${body.clinic_name} - ${body.contact_name}`,
      html: emailHtml,
      replyTo: body.email,
    })

    // Optional: Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #40E0FF;">Thank You for Your Consultancy Request</h2>
        
        <p>Hi ${body.contact_name},</p>
        
        <p>We've received your consultancy request for <strong>${body.clinic_name}</strong>. Our team will review your details and get back to you within 24 hours.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service Interest:</strong> ${serviceTypeLabel}</p>
          <p><strong>Your Email:</strong> ${body.email}</p>
          <p><strong>Your Phone:</strong> ${body.phone}</p>
        </div>

        <p>In the meantime, feel free to reach out if you have any questions.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br/>
          <strong>Callendar Team</strong>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; margin: 0;">
          This email was sent to you because you submitted a consultancy request on the Callendar website.
        </p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@beaconhorizons.io',
      to: body.email,
      subject: 'Consultancy Request Received - Callendar',
      html: confirmationHtml,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const err = error as {
      message?: string
      code?: string
      responseCode?: number
      response?: string
      command?: string
    }

    const details = {
      message: err?.message ?? 'Unknown email error',
      code: err?.code ?? null,
      responseCode: err?.responseCode ?? null,
      response: err?.response ?? null,
      command: err?.command ?? null,
    }

    console.error('Consultancy email error:', details)
    return NextResponse.json(
      { error: 'Failed to send consultancy request', details },
      { status: 500 }
    )
  }
}
