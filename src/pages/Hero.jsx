export default function Hero() {
	return (
		<section className="travel-hero" aria-labelledby="travel-hero-title">
			<div className="travel-hero-shade" aria-hidden="true" />
			<div className="hero-copy">
				<p className="hero-eyebrow">CURATED JOURNEYS, MADE PERSONAL</p>
				<h1 id="travel-hero-title">
					Find your way to <em>wonder.</em>
				</h1>
				<p className="hero-description">
					Thoughtful escapes, local stories, and room to wander. Find the
					journey that feels like yours.
				</p>
				<a className="hero-cta" href="#tours">
					Explore journeys <span aria-hidden="true">&#8599;</span>
				</a>
				<p className="hero-note">Small groups. Lasting memories.</p>
			</div>

			<a className="hero-scroll-link" href="#tours">
				<span>Discover your next journey</span>
				<span aria-hidden="true">&#8595;</span>
			</a>
		</section>
	);
}