import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "./Hero";
import TourCollection from "../components/TourCollection";

function Home() {

  return (
    <>
      <Header />
      <Hero />
      <TourCollection
        id="tours"
        title="Journeys worth remembering"
        limit={3}
        showViewAll
      />

      <Footer />
    </>
  );
}
export default Home;
