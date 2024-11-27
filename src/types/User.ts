export interface Creator {
	_id: string; // MongoDB Object ID as a string
	bio: string; // Bio of the creator
	email: string; // Email address of the creator
	name: string; // Full name of the creator
	profileImage: string; // URL to the profile image of the creator
	clerkUserId: string;
}
