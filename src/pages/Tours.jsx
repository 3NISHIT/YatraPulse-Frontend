import Footer from "../components/Footer";
import Header from "../components/Header";
import TourCollection from "../components/TourCollection";

export default function Tours() {
	return (
		<>
			<Header />
			<main className="tours-page">
				<section className="tours-page-intro">
					<div>
						<p>YATRAPULSE / TRAVEL COLLECTION</p>
						<h1>Find a journey worth remembering.</h1>
						<p>
							Browse every experience currently offered by YatraPulse, each
							thoughtfully planned for the places and stories along the way.
						</p>
					</div>
				</section>
				<TourCollection
					title="All available tours"
					description="Choose a destination and discover the details of your next escape."
				/>
			</main>
			<Footer />
		</>
	);
}
