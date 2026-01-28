import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Hero2 from './components/Hero2';
import Hero3 from './components/hero3';
import Hero4 from './components/hero4';
import Blog from './components/Blog';
import ContinentCarousel from './components/ContinentCrousel';
import DestinationPage from "./landing pages/DestinationPage";
import UserProfile from "./components/UserProfile";
import SelectHotelPage from "./landing pages/SelectHotelPage";
import TripSummary from "./components/TripSummary";
import ItineraryLoadingScreen from './components/itinerary/ItineraryLoadingScreen';
import ItineraryResultScreen from './components/itinerary/ItineraryResultScreen';
import EditRecommendation from './pages/EditRecommendation';


const MainPage = () => (
  <div id="home">
    <Home />
    <Hero2 />
    <Hero3 />
    <Hero4 />
    <ContinentCarousel />
    {/* Recommendation section moved to Home.jsx as SwipeDiscoveryDeck */}
    <Blog />
  </div>
);

// Conditional layout wrapper
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isItineraryPage = location.pathname.startsWith('/itinerary');
  const isCustomizePage = location.pathname === '/customize';

  // Hide navbar and footer on itinerary and customize pages for full-screen experience
  if (isItineraryPage || isCustomizePage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar isLoginPage={isLoginPage} />
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <LayoutWrapper>
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/destinations/:continent" element={<DestinationPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/hotels/:cityId" element={<SelectHotelPage />} />
            <Route path="/trip-summary/:tripId" element={<TripSummary />} />
            <Route path="/customize" element={<EditRecommendation />} />
            <Route path="/itinerary/loading" element={<ItineraryLoadingScreen />} />
            <Route path="/itinerary/result" element={<ItineraryResultScreen />} />

          </Routes>
        </main>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
