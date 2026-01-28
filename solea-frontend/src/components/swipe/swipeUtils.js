/**
 * Swipe utilities for preference learning and deck management
 * Stores swipe signals in localStorage separate from user profile
 */

// Separate localStorage keys (does NOT touch solea_user_profile_v1)
export const SWIPE_SIGNALS_KEY = 'solea_swipe_signals_v1';
export const LAST_LIKED_KEY = 'solea_last_liked_v1';

/**
 * Default swipe signals structure
 */
const getDefaultSignals = () => ({
    liked: [],
    disliked: [],
    tagScores: {}
});

/**
 * Load swipe signals from localStorage
 */
export const loadSwipeSignals = () => {
    try {
        const stored = localStorage.getItem(SWIPE_SIGNALS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading swipe signals:', error);
    }
    return getDefaultSignals();
};

/**
 * Save swipe signals to localStorage
 */
export const saveSwipeSignals = (signals) => {
    try {
        localStorage.setItem(SWIPE_SIGNALS_KEY, JSON.stringify(signals));
        return true;
    } catch (error) {
        console.error('Error saving swipe signals:', error);
        return false;
    }
};

/**
 * Save last liked card for potential prefill
 */
export const saveLastLiked = (card) => {
    try {
        localStorage.setItem(LAST_LIKED_KEY, JSON.stringify({
            cardId: card.id,
            city: card.city,
            country: card.country,
            tags: card.tags,
            ts: Date.now()
        }));
    } catch (error) {
        console.error('Error saving last liked:', error);
    }
};

/**
 * Load last liked card
 */
export const loadLastLiked = () => {
    try {
        const stored = localStorage.getItem(LAST_LIKED_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
};

/**
 * Record a swipe interaction
 * @param {Object} card - The swiped card
 * @param {'right' | 'left'} direction - Swipe direction
 */
export const recordSwipe = (card, direction) => {
    const signals = loadSwipeSignals();
    const entry = {
        cardId: card.id,
        city: card.city,
        tags: card.tags,
        ts: Date.now()
    };

    if (direction === 'right') {
        // Add to liked, update tag scores positively
        signals.liked.push(entry);
        card.tags.forEach(tag => {
            signals.tagScores[tag] = (signals.tagScores[tag] || 0) + 1;
        });
        // Save last liked for potential prefill
        saveLastLiked(card);
    } else {
        // Add to disliked, update tag scores negatively
        signals.disliked.push(entry);
        card.tags.forEach(tag => {
            signals.tagScores[tag] = (signals.tagScores[tag] || 0) - 1;
        });
    }

    // Cap arrays at 50 entries
    if (signals.liked.length > 50) {
        signals.liked = signals.liked.slice(-50);
    }
    if (signals.disliked.length > 50) {
        signals.disliked = signals.disliked.slice(-50);
    }

    saveSwipeSignals(signals);
    return signals;
};

/**
 * Compute preference score for a card based on tag scores
 */
export const computeCardScore = (card, tagScores) => {
    if (!tagScores || Object.keys(tagScores).length === 0) {
        return 0;
    }
    return card.tags.reduce((score, tag) => {
        return score + (tagScores[tag] || 0);
    }, 0);
};

/**
 * Shuffle array (Fisher-Yates)
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Sort deck by preference scores
 * - Prioritize cards with positive tag matches
 * - Avoid cards with strongly negative tags
 * - Shuffle within same score bands for variety
 */
export const sortDeckByPreference = (cards, tagScores) => {
    if (!tagScores || Object.keys(tagScores).length === 0) {
        return shuffleArray(cards);
    }

    // Score each card
    const scoredCards = cards.map(card => ({
        ...card,
        score: computeCardScore(card, tagScores)
    }));

    // Group by score bands
    const bands = {};
    scoredCards.forEach(card => {
        const band = Math.floor(card.score / 2); // Group scores in bands of 2
        if (!bands[band]) bands[band] = [];
        bands[band].push(card);
    });

    // Sort bands descending, shuffle within each band
    const sortedBands = Object.keys(bands)
        .map(Number)
        .sort((a, b) => b - a);

    const result = [];
    sortedBands.forEach(band => {
        result.push(...shuffleArray(bands[band]));
    });

    return result;
};

/**
 * Filter out already swiped cards and sort by preference
 */
export const prepareDeck = (allCards, signals) => {
    const swipedIds = new Set([
        ...signals.liked.map(s => s.cardId),
        ...signals.disliked.map(s => s.cardId)
    ]);

    // Filter out swiped cards
    let availableCards = allCards.filter(card => !swipedIds.has(card.id));

    // If all cards swiped, reset and use all cards
    if (availableCards.length === 0) {
        availableCards = [...allCards];
    }

    // Sort by preference
    return sortDeckByPreference(availableCards, signals.tagScores);
};

/**
 * Get French label for a tag
 */
export const getTagLabel = (tag) => {
    const labelMap = {
        family: 'Famille',
        couple: 'Couple',
        solo: 'Solo',
        kids: 'Enfants',
        elder_friendly: 'Senior',
        low_walking: 'Peu de marche',
        comfort: 'Confort',
        relaxation: 'Détente',
        culture: 'Culture',
        food: 'Gastronomie',
        nature: 'Nature',
        relaxed: 'Calme',
        short_distances: 'Courtes distances',
        balanced: 'Équilibré',
        light_walking: 'Marche légère',
        group: 'Groupe',
        friends: 'Entre amis',
        business: 'Business',
        budget_conscious: 'Budget',
        mid_range: 'Modéré',
        luxury: 'Luxe',
        active: 'Actif',
        history: 'Histoire',
        shopping: 'Shopping',
        photography: 'Photo',
        nightlife: 'Vie nocturne',
        wellness: 'Bien-être',
        art: 'Art',
        wheelchair_access: 'Accès PMR'
    };
    return labelMap[tag] || tag;
};
