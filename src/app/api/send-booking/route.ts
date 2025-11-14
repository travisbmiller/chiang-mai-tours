import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Validate environment variable
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const bookingData = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Chiang Mai Tours <bookings@resend.dev>', // Using Resend's test domain for now
      to: 'travisbmiller@outlook.com',
      subject: `New Booking Request: ${bookingData.tourName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #433D3F; border-bottom: 3px solid #EAB308; padding-bottom: 10px; }
              .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
              .label { font-weight: bold; color: #433D3F; }
              .value { color: #666; }
              .highlight { background: #FEF3C7; padding: 10px; border-left: 4px solid #EAB308; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚗 New Booking Request</h1>

              <div class="section">
                <h2>Guest Information</h2>
                <p><span class="label">Name:</span> <span class="value">${bookingData.fullName}</span></p>
                <p><span class="label">Email:</span> <span class="value">${bookingData.email}</span></p>
                <p><span class="label">Phone:</span> <span class="value">${bookingData.countryCode} ${bookingData.phone}</span></p>
              </div>

              <div class="section">
                <h2>Tour Details</h2>
                <p><span class="label">Tour:</span> <span class="value">${bookingData.tourName}</span></p>
                <p><span class="label">Date:</span> <span class="value">${bookingData.date}</span></p>
                <p><span class="label">Guests:</span> <span class="value">${bookingData.guests}</span></p>
                ${bookingData.includeMorningAlms ? '<div class="highlight">✨ <strong>Morning Monk Alms</strong> requested</div>' : ''}
              </div>

              <div class="section">
                <h2>Preferences</h2>
                <p><span class="label">Licensed Guide:</span> <span class="value">${bookingData.needsGuide === null ? 'Not specified' : bookingData.needsGuide ? 'Yes' : 'No'}</span></p>
                <p><span class="label">WhatsApp:</span> <span class="value">${bookingData.usesWhatsApp === null ? 'Not specified' : bookingData.usesWhatsApp ? 'Yes' : 'No'}</span></p>
                <p><span class="label">LINE:</span> <span class="value">${bookingData.usesLine === null ? 'Not specified' : bookingData.usesLine ? 'Yes' : 'No'}</span></p>
              </div>

              ${bookingData.selectedOtherTours && bookingData.selectedOtherTours.length > 0 ? `
                <div class="section">
                  <h2>Also Interested In</h2>
                  <ul>
                    ${bookingData.selectedOtherTours.map((tour: string) => `<li>${tour}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${bookingData.additionalInfo ? `
                <div class="section">
                  <h2>Additional Information</h2>
                  <p>${bookingData.additionalInfo}</p>
                </div>
              ` : ''}

              <div class="section" style="background: #433D3F; color: white;">
                <p style="margin: 0; text-align: center;">
                  <strong>Total Price:</strong> ${bookingData.totalPrice} Baht
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending booking email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
