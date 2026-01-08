import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

// Lazy-loaded transporter singleton
let transporter: Transporter | null = null;

export function getEmailConfig() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const mailFrom = process.env.MAIL_FROM;
  const mailTo = process.env.MAIL_TO;

  const isConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPass && mailFrom);

  return { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, mailFrom, mailTo, isConfigured };
}

export function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, isConfigured } = getEmailConfig();

  if (!isConfigured) {
    throw new Error('Email transport is not configured');
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

// Generic email sending function
export async function sendEmail(options: Mail.Options): Promise<void> {
  const transport = getTransporter();
  const { mailFrom } = getEmailConfig();
  
  await transport.sendMail({
    from: mailFrom,
    ...options,
  });
}

// Send email to admin (MAIL_TO)
export async function sendEmailToAdmin(options: Omit<Mail.Options, 'to'>): Promise<void> {
  const { mailTo } = getEmailConfig();
  
  if (!mailTo) {
    throw new Error('MAIL_TO is not configured');
  }

  await sendEmail({ ...options, to: mailTo });
}

// ============================================
// Specific email templates
// ============================================

type BookingConfirmationParams = {
  customerEmail: string;
  customerName: string;
  service: string;
  amount: number;
  currency: string;
  confirmationId: string;
};

export async function sendBookingConfirmation({
  customerEmail,
  customerName,
  service,
  amount,
  currency,
  confirmationId,
}: BookingConfirmationParams) {
  const formattedAmount = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(145deg, #252525, #1f1f1f); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 16px; padding: 40px; text-align: center;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="color: #ffc107; font-size: 28px; margin: 0;">⚠️ Warning Machines</h1>
          </div>
          
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #34d399, #10b981); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 40px; line-height: 80px;">✓</span>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">Payment Confirmed!</h2>
          <p style="color: #888888; margin: 0 0 30px;">Thank you for your booking, ${customerName}.</p>
          
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; text-align: left; margin-bottom: 30px;">
            <h3 style="color: #ffc107; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px;">Booking Details</h3>
            
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 0;">
              <span style="color: #888888;">Service</span>
              <span style="color: #ffffff; float: right;">${service}</span>
            </div>
            
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 0;">
              <span style="color: #888888;">Confirmation ID</span>
              <span style="color: #ffc107; float: right; font-family: monospace;">${confirmationId}</span>
            </div>
            
            <div style="padding: 16px 0 0;">
              <span style="color: #ffffff; font-size: 18px; font-weight: bold;">Total Paid</span>
              <span style="color: #34d399; float: right; font-size: 24px; font-weight: bold;">${formattedAmount}</span>
            </div>
          </div>
          
          <div style="text-align: left; margin-bottom: 30px;">
            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 12px;">What happens next?</h3>
            <p style="color: #888888; margin: 0; line-height: 1.6;">
              Our team will review your request and contact you within <strong style="color: #ffffff;">24 hours</strong> to schedule your consultation meeting.
            </p>
          </div>
          
          <a href="https://warning-machines.com" style="display: inline-block; background: linear-gradient(120deg, #ffc107, #ffda5b); color: #1a1a1a; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Visit Our Website
          </a>
          
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              Questions? Reply to this email or contact us at<br>
              <a href="mailto:info@warning-machines.com" style="color: #ffc107;">info@warning-machines.com</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Payment Confirmed!

Thank you for your booking, ${customerName}.

BOOKING DETAILS
---------------
Service: ${service}
Confirmation ID: ${confirmationId}
Total Paid: ${formattedAmount}

WHAT HAPPENS NEXT?
Our team will review your request and contact you within 24 hours to schedule your consultation meeting.

Questions? Reply to this email or contact us at info@warning-machines.com

Warning Machines
https://warning-machines.com
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Booking Confirmed - ${service} | Warning Machines`,
    text,
    html,
  });
}

type PaidBookingNotificationParams = {
  customerEmail: string;
  customerName: string;
  service: string;
  message: string;
  amount: number;
  currency: string;
  confirmationId: string;
};

export async function sendPaidBookingNotification({
  customerEmail,
  customerName,
  service,
  message,
  amount,
  currency,
  confirmationId,
}: PaidBookingNotificationParams) {
  const formattedAmount = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  await sendEmailToAdmin({
    replyTo: customerEmail,
    subject: `💰 New Paid Booking - ${customerName} (${formattedAmount})`,
    text: `
New paid booking received!

CUSTOMER DETAILS
----------------
Name: ${customerName}
Email: ${customerEmail}
Service: ${service}

PAYMENT
-------
Amount: ${formattedAmount}
Confirmation ID: ${confirmationId}

MESSAGE
-------
${message || 'No message provided'}

---
This booking has been paid via Stripe.
    `,
    html: `
      <h2>💰 New Paid Booking</h2>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Amount:</strong> ${formattedAmount}</p>
      <p><strong>Confirmation ID:</strong> ${confirmationId}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
    `,
  });
}

// ============================================
// Order Confirmation (Product Purchase)
// ============================================

type OrderConfirmationParams = {
  customerEmail: string;
  productNames: string;
  amount: number;
  currency: string;
  orderId: string;
};

export async function sendOrderConfirmation({
  customerEmail,
  productNames,
  amount,
  currency,
  orderId,
}: OrderConfirmationParams) {
  const formattedAmount = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(145deg, #252525, #1f1f1f); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 16px; padding: 40px; text-align: center;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="color: #ffc107; font-size: 28px; margin: 0;">⚠️ Warning Machines</h1>
          </div>
          
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #34d399, #10b981); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 40px; line-height: 80px;">✓</span>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">Order Confirmed!</h2>
          <p style="color: #888888; margin: 0 0 30px;">Thank you for buying our products.</p>
          
          <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; text-align: left; margin-bottom: 30px;">
            <h3 style="color: #ffc107; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px;">Order Details</h3>
            
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 0;">
              <span style="color: #888888;">Products</span>
              <span style="color: #ffffff; float: right;">${productNames}</span>
            </div>
            
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 0;">
              <span style="color: #888888;">Order ID</span>
              <span style="color: #ffc107; float: right; font-family: monospace;">${orderId}</span>
            </div>
            
            <div style="padding: 16px 0 0;">
              <span style="color: #ffffff; font-size: 18px; font-weight: bold;">Total Paid</span>
              <span style="color: #34d399; float: right; font-size: 24px; font-weight: bold;">${formattedAmount}</span>
            </div>
          </div>
          
          <div style="text-align: left; margin-bottom: 30px;">
            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 12px;">What happens next?</h3>
            <p style="color: #888888; margin: 0; line-height: 1.6;">
              We&apos;ll process your order and ship it as soon as possible. You&apos;ll receive a shipping confirmation email with tracking information once your order is on its way.
            </p>
          </div>
          
          <a href="https://warning-machines.com/products" style="display: inline-block; background: linear-gradient(120deg, #ffc107, #ffda5b); color: #1a1a1a; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Continue Shopping
          </a>
          
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              Questions about your order? Reply to this email or contact us at<br>
              <a href="mailto:info@warning-machines.com" style="color: #ffc107;">info@warning-machines.com</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmed!

Thank you for buying our products.

ORDER DETAILS
-------------
Products: ${productNames}
Order ID: ${orderId}
Total Paid: ${formattedAmount}

WHAT HAPPENS NEXT?
We'll process your order and ship it as soon as possible. You'll receive a shipping confirmation email with tracking information once your order is on its way.

Questions about your order? Reply to this email or contact us at info@warning-machines.com

Warning Machines
https://warning-machines.com
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Order Confirmed - ${orderId} | Warning Machines`,
    text,
    html,
  });
}

type OrderNotificationParams = {
  customerEmail: string;
  productNames: string;
  amount: number;
  currency: string;
  orderId: string;
};

export async function sendOrderNotification({
  customerEmail,
  productNames,
  amount,
  currency,
  orderId,
}: OrderNotificationParams) {
  const formattedAmount = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  await sendEmailToAdmin({
    replyTo: customerEmail,
    subject: `📦 New Order - ${orderId} (${formattedAmount})`,
    text: `
New product order received!

CUSTOMER
--------
Email: ${customerEmail}

ORDER DETAILS
-------------
Products: ${productNames}
Order ID: ${orderId}
Amount: ${formattedAmount}

---
This order has been paid via Stripe.
    `,
    html: `
      <h2>📦 New Product Order</h2>
      <p><strong>Customer Email:</strong> ${customerEmail}</p>
      <p><strong>Products:</strong> ${productNames}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount:</strong> ${formattedAmount}</p>
    `,
  });
}
