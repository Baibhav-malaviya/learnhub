"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "./hooks/use-toast";
import { ImageDown, Loader2, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import mongoose from "mongoose";
import { useRequireAuth } from "./hooks/useRequireAuth";

interface GiftCourseModalProps {
	courseId: mongoose.Types.ObjectId;
	onClose: (e: any) => void;
}

const GiftCourseModal: React.FC<GiftCourseModalProps> = ({
	courseId,
	onClose,
}) => {
	const [copies, setCopies] = useState(1);
	const [qrData, setQrData] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const qrRef = useRef<HTMLCanvasElement>(null);
	const { requireAuth } = useRequireAuth();

	// Generate QR Code
	const generateQRCode = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		if (!requireAuth("to gift this course")) {
			setLoading(false);
			return;
		}
		try {
			const response = await fetch("/api/gift", {
				method: "POST",
				body: JSON.stringify({ courseId, copies }),
				headers: { "Content-Type": "application/json" },
			});
			const data = await response.json();
			if (data.error) throw new Error(data.error);

			setQrData(data.qrData);
			toast({
				title: "QR Code Generated!",
				description: "Share this QR code with the recipient.",
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	// Download QR Code
	const downloadQRCode = () => {
		const canvas = qrRef.current;
		if (canvas) {
			const image = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = image;
			link.download = `gift-course-${courseId}.png`;
			link.click();
		}
	};

	// Share QR Code on Social Media
	const shareQRCode = async () => {
		try {
			if (!navigator.share) {
				toast({
					title: "Unsupported",
					description: "Your browser does not support social sharing.",
					variant: "destructive",
				});
				return;
			}

			const canvas = qrRef.current;
			if (canvas) {
				const image = canvas.toDataURL("image/png");
				const blob = await (await fetch(image)).blob();
				const file = new File([blob], `gift-course-${courseId}.png`, {
					type: "image/png",
				});

				await navigator.share({
					title: "Gift Course QR Code",
					text: "Scan this QR code to claim your gift course!",
					files: [file],
				});

				toast({
					title: "Shared!",
					description: "The QR code has been shared successfully.",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to share the QR code.",
				variant: "destructive",
			});
		}
	};

	return (
		<div>
			{!qrData ? (
				<>
					<div className="space-y-4">
						<label className="block text-sm font-medium">
							Number of Copies
						</label>
						<Input
							type="number"
							min={1}
							value={copies}
							onChange={(e) => setCopies(Number(e.target.value))}
						/>
					</div>
					<div className="mt-4 flex justify-end">
						<Button onClick={generateQRCode} disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Generate QR Code
						</Button>
					</div>
				</>
			) : (
				<div className="space-y-4 text-center">
					<p className="text-sm">
						Scan or Share this QR code to claim the gift.
					</p>
					<div className="flex justify-center">
						<QRCodeCanvas
							value={qrData}
							size={200}
							fgColor="#f43f5e"
							ref={qrRef} // Required for download and sharing
							imageSettings={{
								src: "/images/logo.png", // Ensure this image exists in the public folder
								x: undefined, // Centered by default
								y: undefined,
								opacity: 0.8,
								height: 40,
								width: 40,
								excavate: true,
							}}
						/>
					</div>
					<div className="mt-4 flex justify-center gap-4">
						<Button variant="secondary" size={"icon"} onClick={downloadQRCode}>
							<ImageDown />
						</Button>
						<Button variant="secondary" size={"icon"} onClick={shareQRCode}>
							<Share2 />
						</Button>
					</div>
					<div className="mt-4">
						<Button variant="secondary" onClick={onClose}>
							Done
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default GiftCourseModal;
