import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import User from "@/model/user.model";
import connectToDB from "@/lib/connectDB"; // Assume this function connects to MongoDB

function isUserData(data: any): data is UserData {
	return (
		"id" in data &&
		"email_addresses" in data &&
		"first_name" in data &&
		"last_name" in data &&
		"image_url" in data
	);
}

interface EmailAddress {
	email_address: string;
}

interface UserData {
	id: string;
	email_addresses: EmailAddress[];
	first_name: string;
	last_name: string;
	image_url: string;
}

export async function POST(req: Request) {
	try {
		const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
		if (!WEBHOOK_SECRET) {
			throw new Error("Missing WEBHOOK_SECRET");
		}

		const headerPayload = headers();
		const svix_id = headerPayload.get("svix-id");
		const svix_timestamp = headerPayload.get("svix-timestamp");
		const svix_signature = headerPayload.get("svix-signature");

		if (!svix_id || !svix_timestamp || !svix_signature) {
			return new Response("Error occurred -- missing svix headers", {
				status: 400,
			});
		}

		const payload = await req.json();
		const body = JSON.stringify(payload);

		const wh = new Webhook(WEBHOOK_SECRET);
		let evt: WebhookEvent;

		try {
			evt = wh.verify(body, {
				"svix-id": svix_id,
				"svix-timestamp": svix_timestamp,
				"svix-signature": svix_signature,
			}) as WebhookEvent;
		} catch (err) {
			console.error("Error verifying webhook:", err);
			return new Response(
				`Error occurred in verification ${err} ${WEBHOOK_SECRET}`,
				{
					status: 400,
				}
			);
		}

		const eventType = evt.type;

		// Connect to the database
		await connectToDB();

		switch (eventType) {
			case "user.created": {
				if (!isUserData(evt.data)) {
					throw new Error("Invalid user data received");
				}
				const { id, email_addresses, first_name, last_name, image_url } =
					evt.data;

				const newUser = await User.create({
					clerkUserId: id,
					email: email_addresses[0]?.email_address,
					name: `${first_name} ${last_name}`,
					profileImage: image_url,
					enrolledCourses: [], // Initialize with empty array
					createdCourses: [], // Initialize with empty array
				});

				console.log(`New user created: ${newUser.id}`);
				break;
			}
			case "user.updated": {
				if (!isUserData(evt.data)) {
					throw new Error("Invalid user data received");
				}
				const { id, email_addresses, first_name, last_name, image_url } =
					evt.data;

				const updatedUser = await User.findOneAndUpdate(
					{ clerkUserId: id },
					{
						email: email_addresses[0]?.email_address,
						name: `${first_name} ${last_name}`,
						profileImage: image_url,
					},
					{ new: true }
				);

				if (!updatedUser) {
					console.log(`User not found for update: ${id}`);
					// Optionally, you could create the user here if they don't exist
				} else {
					console.log(`User updated: ${updatedUser.id}`);
				}
				break;
			}
			case "user.deleted": {
				if (typeof evt.data.id !== "string") {
					throw new Error("Invalid user id for deletion");
				}
				const deletedUser = await User.findOneAndDelete({
					clerkUserId: evt.data.id,
				});
				if (deletedUser) {
					console.log(`User deleted: ${deletedUser.id}`);
				} else {
					console.log(`User not found for deletion: ${evt.data.id}`);
				}
				break;
			}
			default:
				console.log(`Unhandled event type: ${eventType}`);
		}

		console.log(`Webhook processed successfully. Type: ${eventType}`);
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error processing webhook:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: ` Internal Server Error ${error}`,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
