export default function TopVignetteOverlay() {
	// Fixed, transparent overlay that standardizes the top luminance site-wide.
	// Uses CSS variables for easy tuning without touching individual pages:
	// --top-vignette-opacity: overall opacity multiplier (default matches homepage look)
	// --top-vignette-height: height of the overlay region (e.g., 22vh)
	// --top-vignette-tint: color tint applied to the top fade (defaults to black)
	return (
			<div
				aria-hidden
				className="pointer-events-none fixed inset-x-0 top-0 z-0"
			style={{
				height: 'var(--top-vignette-height, 22vh)',
				// Blend a soft top fade matching the homepage luminance profile.
				background:
					'linear-gradient(to bottom, rgba(0,0,0, calc(var(--top-vignette-opacity, 0.22) * 1)) 0%, rgba(0,0,0, calc(var(--top-vignette-opacity, 0.22) * 0.75)) 40%, rgba(0,0,0, 0) 100%)',
				// Allow optional hue tint (kept transparent by default)
				WebkitMaskImage:
					'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
				mixBlendMode: 'normal',
			}}
		/>
	);
}
