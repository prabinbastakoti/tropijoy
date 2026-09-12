"use server";

import { Resend } from "resend";
import type { CheckoutPayload } from "@/lib/types";

export interface CheckoutResult {
  success: boolean;
  demoMode: boolean;
  message: string;
}

function buildEmailHtml(payload: CheckoutPayload): string {
  const itemsRows = payload.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">${item.name} (${item.weight})</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;">Rs. ${item.price.toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
    <div style="background:#116530;padding:24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#FFFFFF;margin:0;font-size:22px;">🍏 New Tropijoy Order</h1>
    </div>
    <div style="padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
      <h2 style="color:#116530;font-size:16px;">Customer Details</h2>
      <p style="margin:4px 0;"><strong>Name:</strong> ${payload.shipping.fullName}</p>
      <p style="margin:4px 0;"><strong>Address:</strong> ${payload.shipping.address}, ${payload.shipping.city} ${payload.shipping.postalCode}</p>

      <h2 style="color:#116530;font-size:16px;margin-top:20px;">Preferred Contact</h2>
      <p style="margin:4px 0;"><strong>Platform:</strong> ${payload.contactPlatform}</p>
      <p style="margin:4px 0;"><strong>Handle / Number:</strong> ${payload.contactHandle}</p>

      <h2 style="color:#116530;font-size:16px;margin-top:20px;">Order Summary</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#FAF8F5;">
            <th style="padding:8px 12px;text-align:left;">Item</th>
            <th style="padding:8px 12px;text-align:center;">Qty</th>
            <th style="padding:8px 12px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <table style="width:100%;margin-top:12px;">
        <tr><td style="padding:4px 12px;">Subtotal</td><td style="padding:4px 12px;text-align:right;">Rs. ${payload.subtotal.toLocaleString("en-IN")}</td></tr>
        <tr><td style="padding:4px 12px;">Shipping</td><td style="padding:4px 12px;text-align:right;">${payload.shipping_cost === 0 ? "Free" : `Rs. ${payload.shipping_cost.toLocaleString("en-IN")}`}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border-top:2px solid #116530;">Total</td><td style="padding:8px 12px;text-align:right;font-weight:bold;border-top:2px solid #116530;">Rs. ${payload.total.toLocaleString("en-IN")}</td></tr>
      </table>
    </div>
  </div>`;
}

export async function submitOrder(payload: CheckoutPayload): Promise<CheckoutResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      demoMode: true,
      message:
        "Demo mode: order captured locally. Configure RESEND_API_KEY and ORDER_NOTIFICATION_EMAIL to send real order emails.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Tropijoy Orders <orders@tropijoynp.com>",
      to: toEmail,
      subject: `New Order from ${payload.shipping.fullName} — Rs. ${payload.total.toLocaleString("en-IN")}`,
      html: buildEmailHtml(payload),
    });

    if (error) {
      return {
        success: false,
        demoMode: false,
        message: "We couldn't send your order right now. Please try again shortly.",
      };
    }

    return {
      success: true,
      demoMode: false,
      message: "Order placed! We'll reach out via your preferred contact method shortly.",
    };
  } catch {
    return {
      success: false,
      demoMode: false,
      message: "Something went wrong submitting your order. Please try again.",
    };
  }
}

export interface LeadPayload {
  email: string;
  source: string;
}

export async function submitLead(payload: LeadPayload): Promise<CheckoutResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      demoMode: true,
      message: "Demo mode: thanks for signing up! Email sending isn't configured yet.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Tropijoy <hello@tropijoynp.com>",
      to: toEmail,
      subject: `New Lead: ${payload.email}`,
      html: `<p>New newsletter signup from <strong>${payload.email}</strong> via ${payload.source}.</p>`,
    });
    return { success: true, demoMode: false, message: "Thanks for joining the Tropijoy family!" };
  } catch {
    return { success: false, demoMode: false, message: "Couldn't sign you up right now. Try again soon." };
  }
}
