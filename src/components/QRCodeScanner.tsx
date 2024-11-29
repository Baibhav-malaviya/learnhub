"use client";

import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScanQrCode, Loader2, Loader, Copy } from "lucide-react";
import { useToast } from "./hooks/use-toast";
import axios from "axios";
import { useRequireAuth } from "./hooks/useRequireAuth";

const QRScanner: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [scanResult, setScanResult] = useState<string | null>(null);
	const [isCameraMode, setIsCameraMode] = useState(true);
	const [isScanning, setIsScanning] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [isRedeeming, setIsRedeeming] = useState<Boolean>(false);

	const { toast } = useToast();
	const { requireAuth } = useRequireAuth();

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		let stream: MediaStream | null = null;
		let animationFrameId: number;

		const startScanner = async () => {
			setIsLoading(true);
			setCameraError(null);

			if (!navigator.mediaDevices?.getUserMedia) {
				setCameraError("Camera not supported on this device.");
				setIsLoading(false);
				return;
			}

			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				const video = videoRef.current;
				const canvas = canvasRef.current;

				if (video && stream) {
					video.srcObject = stream;
					video.setAttribute("playsinline", "true");
					await video.play();

					const scanQRCode = () => {
						if (!video || !canvas || !isScanning) return;

						const context = canvas.getContext("2d");
						if (context) {
							canvas.width = video.videoWidth;
							canvas.height = video.videoHeight;

							context.drawImage(video, 0, 0, canvas.width, canvas.height);
							const imageData = context.getImageData(
								0,
								0,
								canvas.width,
								canvas.height
							);
							const code = jsQR(imageData.data, canvas.width, canvas.height);

							if (code) {
								setScanResult(code.data);
								toast({ title: "QR Code Scanned!", description: code.data });
								setIsScanning(false);
								stopScanner();
								// Add this line to call the API
								handleApiCall(code.data);
							}
						}
						animationFrameId = requestAnimationFrame(scanQRCode);
					};

					setIsLoading(false);
					scanQRCode();
				}
			} catch (error) {
				console.error("Camera access error:", error);
				setCameraError(
					"Unable to access the camera. Please check your browser permissions."
				);
				setIsLoading(false);
			}
		};

		const stopScanner = () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};

		if (isScanning && isCameraMode) {
			startScanner();
		}

		return () => stopScanner();
	}, [isScanning, isCameraMode, toast]);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				// Create an image element to load the file
				const img = new Image();
				img.onload = () => {
					// Create a canvas to draw the image
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					// Set canvas size to match image
					canvas.width = img.width;
					canvas.height = img.height;

					// Draw the image on the canvas
					ctx?.drawImage(img, 0, 0, img.width, img.height);

					// Get the image data
					const imageData = ctx?.getImageData(
						0,
						0,
						canvas.width,
						canvas.height
					);

					// Attempt to read QR code
					if (imageData) {
						const code = jsQR(
							imageData.data,
							imageData.width,
							imageData.height
						);

						if (code) {
							// QR code successfully decoded
							toast({
								title: "QR Code Detected!",
								description: code.data,
							});

							setScanResult(code.data);

							// Add this line to call the API
							handleApiCall(code.data);
						} else {
							// No QR code found
							toast({
								title: "No QR Code",
								description: "Could not detect a QR code in the image.",
								variant: "destructive",
							});
						}
					}
				};

				// Set the image source to the uploaded file
				img.src = e.target?.result as string;
			};

			// Read the file as a data URL
			reader.readAsDataURL(file);
		}
	};

	const handleApiCall = async (qrCodeData: string) => {
		if (!requireAuth("to redeem this gifted course")) return;
		setIsRedeeming(true);
		try {
			// Replace with your API endpoint
			const { data } = await axios.post("/api/gift/redeem", {
				qrCodeData,
			});

			console.log("data: ", data);
			if (data.success) {
				toast({
					title: "QR Code Scanned!",
					description: `API Response: ${data.message}`,
				});
			} else {
				throw new Error(data.message);
			}
		} catch (error: any) {
			toast({
				title: "API Error",
				description: error.message || "Failed to send QR code data to the API.",
				variant: "destructive",
			});
		} finally {
			setIsRedeeming(false);
		}
	};

	return (
		<>
			<ScanQrCode
				onClick={() => {
					setOpen(true);
					setIsScanning(true);
					setScanResult(null);
					setCameraError(null);
				}}
				strokeWidth={1.5}
				className="text-primary h-8 w-8 cursor-pointer"
			/>

			<Dialog
				open={open}
				onOpenChange={(open) => {
					setOpen(open);
					if (!open) {
						setIsScanning(false);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Scan or Upload QR Code</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{isCameraMode ? (
							<div className="relative border rounded-md p-4">
								{isLoading && (
									<div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
									</div>
								)}
								<video ref={videoRef} className="hidden" />
								<canvas ref={canvasRef} className="w-full" />

								{cameraError && (
									<div className="text-center text-red-500 text-sm mt-2">
										{cameraError}
									</div>
								)}

								{!cameraError && !isLoading && (
									<p className="text-center text-sm mt-2">
										Point your camera at the QR code.
									</p>
								)}
							</div>
						) : (
							<div>
								<label
									htmlFor="file-upload"
									className="block text-center text-sm font-medium text-blue-600 underline cursor-pointer"
								>
									Choose an image
								</label>
								<input
									id="file-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>
							</div>
						)}

						<div className="flex justify-between mt-4">
							<Button
								variant="secondary"
								onClick={() => {
									setIsCameraMode(true);
									setIsScanning(true);
									setCameraError(null);
								}}
								disabled={isCameraMode}
							>
								Use Camera
							</Button>

							{isRedeeming && (
								<div className="flex gap-2 items-center justify-center ">
									<Loader className="animate-spin" />{" "}
									<span className="text-sm ">Wait for a second</span>
								</div>
							)}

							<Button
								variant="secondary"
								onClick={() => {
									setIsCameraMode(false);
									setIsScanning(false);
								}}
								disabled={!isCameraMode}
							>
								Upload Image
							</Button>
						</div>

						{scanResult && (
							<div className="mt-4 flex gap-4 justify-between bg-green-100 text-green-700 text-center rounded-md p-4">
								<p className="text-sm">
									{scanResult.slice(0, 55)} {scanResult.length > 55 && "..."}
								</p>{" "}
								<Copy
									onClick={() => navigator.clipboard.writeText(scanResult)}
									className="cursor-pointer"
								/>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default QRScanner;
