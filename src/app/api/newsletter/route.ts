import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/resend";

// Interface for the request body
interface EmailRequest {
	email: string;
	name: string;
}

// Detailed error response type
interface ErrorResponse {
	success: false;
	code: string;
	message: string;
	details?: string;
}

// Successful response type
interface SuccessResponse {
	success: true;
	message: string;
	data?: any;
}

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const { email, name }: EmailRequest = await request.json();

		// Basic email validation
		if (!email || !isValidEmail(email)) {
			const validationError: ErrorResponse = {
				success: false,
				code: "INVALID_EMAIL",
				message: "Please provide a valid email address",
				details: "The email address format is incorrect",
			};
			return NextResponse.json(validationError, { status: 400 });
		}

		// Personalized HTML email template
		const html = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">Welcome to Our Newsletter</h1>
            <p style="color: #666;">Hello ${name},</p>
            <p style="color: #666;">Thank you for subscribing! We're excited to keep you updated with our latest news and insights.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              If you did not sign up for this newsletter, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

		// Send email using Resend
		const emailResponse = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>", // todo update this mail with domain mail, this mail can send mail to the registered mail only (baibhav.kr73@gmail.com)
			to: email,
			subject: `Welcome, ${name}! You're Now Subscribed`,
			html,
		});

		// Check email sending response
		if (!emailResponse || emailResponse.error) {
			const errorResponse: ErrorResponse = {
				success: false,
				code: "EMAIL_SEND_FAILED",
				message: "Failed to send welcome email",
				details: emailResponse?.error?.message || "Unknown email sending error",
			};

			return NextResponse.json(errorResponse, { status: 500 });
		}

		// Successful subscription response
		const successResponse: SuccessResponse = {
			success: true,
			message: "Subscription successful! Welcome to our newsletter.",
			data: {
				email,
				subscribedAt: new Date().toISOString(),
			},
		};

		// Log successful subscription
		console.info(
			`Newsletter subscription: ${email} - ${new Date().toISOString()}`
		);

		return NextResponse.json(successResponse, { status: 201 });
	} catch (error) {
		// Unexpected errors
		const unexpectedErrorResponse: ErrorResponse = {
			success: false,
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred during subscription",
			details: error instanceof Error ? error.message : "Unknown error",
		};

		console.error("Newsletter subscription error:", error);

		return NextResponse.json(unexpectedErrorResponse, { status: 500 });
	}
}

// Simple email validation function
function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
