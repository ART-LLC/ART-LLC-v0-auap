// Email templates and service
// In production, integrate with SendGrid via API

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function orderConfirmationEmail(
  customerName: string,
  orderNumber: string,
  items: any[],
  total: number
): EmailTemplate {
  const itemsList = items
    .map(
      (item) =>
        `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
    )
    .join('')

  return {
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for your purchase. Your order has been confirmed.</p>
      <h3>Order Details</h3>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <h3>Items</h3>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>You'll receive a shipping confirmation email when your order ships.</p>
      <p>Questions? Contact us at support@auapw.com</p>
    `,
    text: `Order Confirmation\n\nHi ${customerName},\n\nOrder Number: ${orderNumber}\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`,
  }
}

export function shipmentNotificationEmail(
  customerName: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string
): EmailTemplate {
  return {
    subject: `Your Order is Shipping - ${orderNumber}`,
    html: `
      <h2>Your Order is On the Way!</h2>
      <p>Hi ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> has shipped.</p>
      <h3>Tracking Information</h3>
      <p><strong>Carrier:</strong> ${carrier}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p><a href="https://track.${carrier.toLowerCase()}.com/?tracking=${trackingNumber}">Track Your Package</a></p>
      <p>Estimated delivery: 3-5 business days</p>
    `,
    text: `Your order is shipping!\n\nTracking: ${trackingNumber}\nCarrier: ${carrier}`,
  }
}

export function supportTicketCreatedEmail(
  customerName: string,
  ticketNumber: string,
  subject: string
): EmailTemplate {
  return {
    subject: `Support Ticket Created - ${ticketNumber}`,
    html: `
      <h2>We Received Your Request</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for contacting us. We've received your support request.</p>
      <h3>Ticket Details</h3>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>Our support team will review your request and respond within 24 hours.</p>
    `,
    text: `Support Ticket Created\n\nTicket Number: ${ticketNumber}\nSubject: ${subject}`,
  }
}

export function warrantyRegistrationEmail(
  customerName: string,
  partName: string,
  warrantyDays: number
): EmailTemplate {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + warrantyDays)

  return {
    subject: `Warranty Registration Confirmed - ${partName}`,
    html: `
      <h2>Warranty Registration Confirmed</h2>
      <p>Hi ${customerName},</p>
      <p>Your warranty registration for <strong>${partName}</strong> has been confirmed.</p>
      <h3>Warranty Details</h3>
      <p><strong>Part:</strong> ${partName}</p>
      <p><strong>Coverage Period:</strong> ${warrantyDays} days</p>
      <p><strong>Expires:</strong> ${expiryDate.toLocaleDateString()}</p>
      <p>Your warranty covers manufacturer defects and workmanship. Keep this email for warranty claims.</p>
    `,
    text: `Warranty Registered\n\nPart: ${partName}\nDuration: ${warrantyDays} days\nExpires: ${expiryDate.toLocaleDateString()}`,
  }
}

// Service to send emails (requires SendGrid API integration)
export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<{ success: boolean; messageId?: string }> {
  try {
    // In production, call SendGrid API
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     from: { email: 'noreply@auapw.com' },
    //     subject: template.subject,
    //     content: [{ type: 'text/html', value: template.html }],
    //   }),
    // })

    // For now, log the email
    console.log(`[v0] Email sent to ${to}: ${template.subject}`)

    return { success: true, messageId: `msg_${Date.now()}` }
  } catch (error) {
    console.error('[v0] Email send error:', error)
    return { success: false }
  }
}
