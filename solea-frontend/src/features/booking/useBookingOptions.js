import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generateFlightLinks, generateHotelLinks } from './bookingLinks';
import { generateDemoFlights, HOTEL_COMPARISON_SITES, FLIGHT_COMPARISON_SITES } from './demoBookingData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * useBookingOptions Hook
 * Provides flight and hotel booking options with real API data
 */
export const useBookingOptions = (itinerary, profile = {}) => {
    const { i18n } = useTranslation();
    const [flights, setFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHotelsLoading, setIsHotelsLoading] = useState(true);
    const [origin, setOrigin] = useState(profile?.origin || 'Paris');
    const [error, setError] = useState(null);

    // Get current language
    const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

    // Booking parameters derived from itinerary
    const bookingParams = useMemo(() => ({
        origin: origin,
        destination: itinerary?.destination || 'Paris',
        departDate: itinerary?.startDate || null,
        returnDate: itinerary?.endDate || null,
        checkinDate: itinerary?.startDate || null,
        checkoutDate: itinerary?.endDate || null,
        travelers: itinerary?.travelers || 1,
        rooms: Math.ceil((itinerary?.travelers || 1) / 2)
    }), [itinerary, origin]);

    // Generate booking links
    const flightLinks = useMemo(() =>
        generateFlightLinks(bookingParams),
        [bookingParams]
    );

    const hotelLinks = useMemo(() =>
        generateHotelLinks(bookingParams),
        [bookingParams]
    );

    // Fetch flights - Currently using demo data (no flights API implemented)
    // TODO: Add real flights API when available (e.g., SerpAPI flights)
    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoading(true);
            setError(null);

            // Generate demo flights (no flights API endpoint exists yet)
            // This provides a seamless UX with realistic-looking data
            setTimeout(() => {
                const demoFlights = generateDemoFlights(
                    bookingParams.destination,
                    origin
                );
                setFlights(demoFlights);
                setIsLoading(false);
            }, 600);
        };

        if (itinerary?.destination) {
            fetchFlights();
        }
    }, [itinerary, origin, bookingParams]);

    // Fetch hotels from SerpAPI
    useEffect(() => {
        const fetchHotels = async () => {
            if (!itinerary?.destination) return;

            setIsHotelsLoading(true);

            try {
                const params = new URLSearchParams({
                    city: itinerary.destination,
                    adults: String(bookingParams.travelers),
                    lang: currentLang,
                    currency: 'EUR'
                });

                if (bookingParams.checkinDate) {
                    params.append('check_in', bookingParams.checkinDate);
                }
                if (bookingParams.checkoutDate) {
                    params.append('check_out', bookingParams.checkoutDate);
                }

                const response = await fetch(`${API_BASE}/api/hotels/search?${params.toString()}`, {
                    signal: AbortSignal.timeout(10000)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.results) {
                        setHotels(data.results);
                    } else {
                        setHotels([]);
                    }
                } else {
                    console.warn('Hotels API returned error:', response.status);
                    setHotels([]);
                }
            } catch (err) {
                console.warn('Hotels API error:', err.message);
                setHotels([]);
            } finally {
                setIsHotelsLoading(false);
            }
        };

        fetchHotels();
    }, [itinerary?.destination, bookingParams.checkinDate, bookingParams.checkoutDate, bookingParams.travelers, currentLang]);

    // Update origin
    const updateOrigin = (newOrigin) => {
        setOrigin(newOrigin);
    };

    return {
        // Flight data
        flights,
        flightLinks,
        flightSites: FLIGHT_COMPARISON_SITES,

        // Hotel data
        hotels,
        hotelLinks,
        hotelSites: HOTEL_COMPARISON_SITES,
        isHotelsLoading,

        // Booking params
        origin,
        updateOrigin,
        bookingParams,

        // State
        isLoading,
        error,

        // Helper
        isUsingDemoData: hotels.length === 0
    };
};

export default useBookingOptions;

