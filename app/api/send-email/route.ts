import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, senderEmail, section } = await req.json();

    // Basic validation
    if (!message || !senderEmail || !section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Vienna',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Construct email using Resend
    const emailData = {
      from: 'AI Instructor <notifications@ai-instructor.me>',
      to: 'hulanraphael@gmail.com',
      subject: `New Message - ${timestamp}`,
      text: `Time: ${timestamp}\nFrom: ${senderEmail}\n\nMessage:\n${message}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Message</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Message</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px;">
                
                <!-- Time Sent -->
                <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Time Sent</div>
                  <div style="font-size: 16px; font-weight: 500; color: #1e293b;">${timestamp}</div>
                </div>
                
                <!-- Sender Email -->
                <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From</div>
                  <div style="font-size: 16px; font-weight: 500; color: #1e293b;">
                    <a href="mailto:${senderEmail}" style="color: #6366f1; text-decoration: none;">${senderEmail}</a>
                  </div>
                </div>
                
                <!-- Message Content -->
                <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message</div>
                  <div style="font-size: 16px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
                </div>
                
              </div>
              
              <!-- Footer -->
              <div style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">AI Instructor Contact Form</p>
              </div>
              
            </div>
          </body>
        </html>
      `,
    };

    // Send email using fetch to Email API (you can use any email service)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 