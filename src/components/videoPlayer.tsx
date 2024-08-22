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
					videoElement?.play();
				});
			} else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
				videoElement.src = src;
				videoElement.addEventListener("loadedmetadata", () => {
					videoElement?.play();
				});
			}

			return () => {
				if (hls) {
					hls.destroy();
				}
			};
		}
	}, [src]);

	return (
		<div className="video-container w-full h-auto">
			<video ref={videoRef} className="video-js" controls></video>
		</div>
	);
};

export default VideoPlayer;
