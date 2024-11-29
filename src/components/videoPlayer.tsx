import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
	src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const videoElement = videoRef.current;

		if (videoElement) {
			const hls = new Hls();

			if (Hls.isSupported()) {
				hls.loadSource(src);
				hls.attachMedia(videoElement);
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					console.log("HLS manifest parsed.");
				});

				hls.on(Hls.Events.ERROR, (event, data) => {
					console.error("HLS.js error:", data);
				});
			} else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
				videoElement.src = src;
				videoElement.addEventListener("loadedmetadata", () => {
					console.log("Video metadata loaded.");
				});
			}

			return () => {
				hls.destroy();
			};
		}
	}, [src]);

	return (
		<div className="relative aspect-[16/9] rounded-lg bg-black shadow-lg hover:shadow-xl transition-shadow duration-300">
			<video
				ref={videoRef}
				className="w-full h-full rounded-lg"
				controls
				muted
			></video>
		</div>
	);
};

export default VideoPlayer;
