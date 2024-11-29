"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import GiftCourseModal from "./GiftCourseModel";
import mongoose from "mongoose";
import { Gift } from "lucide-react";

interface BuyCourseButtonProps {
	courseId: mongoose.Types.ObjectId;
}

const BuyCourseButton: React.FC<BuyCourseButtonProps> = ({ courseId }) => {
	const [open, setOpen] = useState(false);

	return (
		<div
			onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the Link
		>
			<Button
				variant={"link"}
				size={"icon"}
				onClick={(e: any) => {
					e.preventDefault();
					setOpen(true);
				}}
			>
				<Gift className="animate-bounce" />
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Gift This Course</DialogTitle>
					</DialogHeader>
					<GiftCourseModal
						courseId={courseId}
						onClose={(e: any) => {
							e.preventDefault();
							setOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BuyCourseButton;
