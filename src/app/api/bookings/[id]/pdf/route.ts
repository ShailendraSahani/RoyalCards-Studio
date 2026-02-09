import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import puppeteer from 'puppeteer';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';
import CardDesign from '@/models/CardDesign';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const booking = await WeddingBooking.findOne({
      _id: id,
      userId: session.user.id
    }).populate('templateId');

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Generate HTML for the wedding card
    const htmlContent = generateWeddingCardHTML(booking);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content and wait for load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Convert buffer to base64 for storage or direct download
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
    const pdfUrl = `data:application/pdf;base64,${pdfBase64}`;

    // Update booking with PDF URL
    await WeddingBooking.findByIdAndUpdate(booking._id, {
      pdfUrl,
      status: 'completed'
    });

    return NextResponse.json({
      message: 'PDF generated successfully',
      pdfUrl
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateWeddingCardHTML(booking: any): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getThemeStyles = () => {
    const theme = booking.theme.cardTheme.toLowerCase();
    const color = booking.theme.colorTheme;

    switch (theme) {
      case 'royal':
        return {
          background: `linear-gradient(135deg, ${color}20, #1a1a2e)`,
          borderColor: color,
          textColor: '#ffffff',
          accentColor: color
        };
      case 'floral':
        return {
          background: `linear-gradient(135deg, #f8f9fa, ${color}10)`,
          borderColor: color,
          textColor: '#2d3748',
          accentColor: color
        };
      case 'modern':
        return {
          background: `linear-gradient(135deg, #ffffff, ${color}05)`,
          borderColor: color,
          textColor: '#1a202c',
          accentColor: color
        };
      case 'traditional':
        return {
          background: `linear-gradient(135deg, #fef5e7, ${color}15)`,
          borderColor: color,
          textColor: '#8b4513',
          accentColor: color
        };
      default:
        return {
          background: `linear-gradient(135deg, #f8f9fa, ${color}10)`,
          borderColor: color,
          textColor: '#2d3748',
          accentColor: color
        };
    }
  };

  const styles = getThemeStyles();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Card Invitation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: ${styles.background};
          color: ${styles.textColor};
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card {
          max-width: 800px;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 4px solid ${styles.borderColor};
          overflow: hidden;
          position: relative;
        }

        .card-header {
          background: ${styles.background};
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }

        .decorative-border {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 20px;
          height: 20px;
          border-left: 3px solid ${styles.accentColor};
          border-top: 3px solid ${styles.accentColor};
        }

        .decorative-border:nth-child(2) {
          top: 20px;
          right: 20px;
          border-right: 3px solid ${styles.accentColor};
          border-top: 3px solid ${styles.accentColor};
          border-left: none;
        }

        .decorative-border:nth-child(3) {
          bottom: 20px;
          left: 20px;
          border-left: 3px solid ${styles.accentColor};
          border-bottom: 3px solid ${styles.accentColor};
          border-top: none;
        }

        .decorative-border:nth-child(4) {
          bottom: 20px;
          right: 20px;
          border-right: 3px solid ${styles.accentColor};
          border-bottom: 3px solid ${styles.accentColor};
          border-top: none;
        }

        .wedding-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .wedding-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: ${styles.accentColor};
        }

        .couple-names {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .couple-names .and {
          margin: 0 15px;
          font-size: 1.5rem;
        }

        .invitation-text {
          font-size: 1.1rem;
          font-style: italic;
          margin-bottom: 30px;
        }

        .card-content {
          padding: 30px;
        }

        .wedding-details {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
          text-align: center;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: ${styles.accentColor};
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          font-weight: 600;
          color: ${styles.textColor};
        }

        .events-section {
          margin-bottom: 25px;
        }

        .event-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .event-name {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .event-details {
          font-size: 0.9rem;
          color: #666;
        }

        .messages-section {
          text-align: center;
          margin-bottom: 25px;
        }

        .religious-quote {
          font-style: italic;
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: ${styles.accentColor};
        }

        .special-message {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          padding: 15px;
          font-style: italic;
          margin-bottom: 15px;
        }

        .card-footer {
          background: ${styles.accentColor}20;
          padding: 20px 30px;
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }

        .host-info {
          margin-bottom: 10px;
        }

        .host-name {
          font-weight: 600;
        }

        .footer-text {
          opacity: 0.8;
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }

          .card {
            box-shadow: none;
            border: 2px solid ${styles.borderColor};
          }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="card-header">
          <div class="decorative-border"></div>
          <div class="decorative-border"></div>
          <div class="decorative-border"></div>
          <div class="decorative-border"></div>

          <div class="wedding-icon">💍</div>
          <h1 class="wedding-title">Wedding Invitation</h1>

          <div class="couple-names">
            <span>${booking.groom.fullName}</span>
            <span class="and">&</span>
            <span>${booking.bride.fullName}</span>
          </div>

          ${booking.messages.familyInvitation ? `<p class="invitation-text">${booking.messages.familyInvitation}</p>` : ''}
        </div>

        <div class="card-content">
          <div class="wedding-details">
            <h2 class="section-title">Wedding Ceremony</h2>

            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(booking.wedding.date)}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${formatTime(booking.wedding.time)}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Venue:</span>
              <span class="detail-value">${booking.wedding.venueName}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${booking.wedding.fullAddress}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${booking.wedding.city}, ${booking.wedding.state}</span>
            </div>
          </div>

          ${booking.events.length > 0 ? `
            <div class="events-section">
              <h2 class="section-title">Wedding Events</h2>
              ${booking.events.map((event: any) => `
                <div class="event-item">
                  <div class="event-name">${event.eventName}</div>
                  <div class="event-details">
                    ${formatDate(event.eventDate)} at ${formatTime(event.eventTime)}<br>
                    Venue: ${event.eventVenue}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="messages-section">
            ${booking.messages.religiousQuote ? `<p class="religious-quote">"${booking.messages.religiousQuote}"</p>` : ''}
            ${booking.messages.specialMessage ? `<p class="special-message">${booking.messages.specialMessage}</p>` : ''}
          </div>
        </div>

        <div class="card-footer">
          <div class="host-info">
            <div class="host-name">${booking.aspirant.name}</div>
            <div>(${booking.aspirant.relation})</div>
            <div>${booking.aspirant.contactNumber}</div>
          </div>
          <div class="footer-text">
            With Warm Regards
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
