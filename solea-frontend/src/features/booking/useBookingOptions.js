import { useState, useEffect, useMemo } from 'react';
import { generateFlightLinks, generateHotelLinks } from './bookingLinks';
import { generateDemoFlights, HOTEL_COMPARISON_SITES, FLIGHT_COMPARISON_SITES } from './demoBookingData';

/**
 * useBookingOptions Hook
 * Provides flight and hotel booking options with fallback to demo data
 */
export const useBookingOptions = (itinerary, profile = {}) => {
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [origin, setOrigin] = useState(profile?.origin || 'Paris');
    const [error, setError] = useState(null);

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

    // Try to fetch from API, fallback to demo data
    useEffect(() => {
        const fetchBookingOptions = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Try API call (optional - will likely fail if endpoint doesn't exist)
                const apiUrl = `/api/booking/flights?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(bookingParams.destination)}&depart=${bookingParams.departDate}&return=${bookingParams.returnDate}&adults=${bookingParams.travelers}`;

                const response = await fetch(apiUrl, {
                    signal: AbortSignal.timeout(3000) // 3s timeout
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.flights && data.flights.length > 0) {
                        setFlights(data.flights);
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (err) {
                // API not available - use fallback
                console.log('Booking API not available, using demo data');
            }

            // Fallback: Generate demo flights
            setTimeout(() => {
                const demoFlights = generateDemoFlights(
                    bookingParams.destination,
                    origin
                );
                setFlights(demoFlights);
                setIsLoading(false);
            }, 800); // Simulate loading delay
        };

        if (itinerary?.destination) {
            fetchBookingOptions();
        }
    }, [itinerary, origin, bookingParams]);

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
        hotelLinks,
        hotelSites: HOTEL_COMPARISON_SITES,

        // Booking params
        origin,
        updateOrigin,
        bookingParams,

        // State
        isLoading,
        error,

        // Helper
        isUsingDemoData: true // Always true for now since no backend
    };
};

export default useBookingOptions;
