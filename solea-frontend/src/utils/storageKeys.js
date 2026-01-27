/**
 * Storage keys for trip planning flow
 * Separate from existing user profile keys
 */

// NEW keys for edit recommendation flow
export const SELECTED_TRIP_IDEA_KEY = 'solea_selected_trip_idea';
export const TRIP_REQUEST_KEY = 'solea_trip_request';

/**
 * Save the selected trip idea from swipe deck
 */
export const saveSelectedTripIdea = (card) => {
    try {
        const tripIdea = {
            id: card.id,
            city: card.city,
            country: card.country,
            image: card.image,
            tags: card.tags || [],
            activities: card.activities || [],
            why: card.why || '',
            savedAt: Date.now()
        };
        localStorage.setItem(SELECTED_TRIP_IDEA_KEY, JSON.stringify(tripIdea));
        return tripIdea;
    } catch (error) {
        console.error('Error saving selected trip idea:', error);
        return null;
    }
};

/**
 * Load the selected trip idea
 */
export const loadSelectedTripIdea = () => {
    try {
        const stored = localStorage.getItem(SELECTED_TRIP_IDEA_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading selected trip idea:', error);
        return null;
    }
};

/**
 * Save the complete trip request for itinerary generation
 */
export const saveTripRequest = (request) => {
    try {
        const tripRequest = {
            ...request,
            createdAt: Date.now()
        };
        localStorage.setItem(TRIP_REQUEST_KEY, JSON.stringify(tripRequest));
        return tripRequest;
    } catch (error) {
        console.error('Error saving trip request:', error);
        return null;
    }
};

/**
 * Load the trip request
 */
export const loadTripRequest = () => {
    try {
        const stored = localStorage.getItem(TRIP_REQUEST_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading trip request:', error);
        return null;
    }
};

/**
 * Clear trip planning data (optional cleanup)
 */
export const clearTripPlanningData = () => {
    localStorage.removeItem(SELECTED_TRIP_IDEA_KEY);
    localStorage.removeItem(TRIP_REQUEST_KEY);
};
