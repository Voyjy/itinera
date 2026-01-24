import { useState, useEffect } from 'react';

const STORAGE_KEY = 'solea_user_profile_v1';

// Extended tag mapping configuration
// Supports both old fields (backward compat) and new fields
const TAG_MAPPING = {
  // Old format (preserved for backward compatibility)
  travelType: {
    'En famille': ['family'],
    'En couple': ['couple'],
    'Solo': ['solo'],
    'Avec enfants': ['kids'],
    'Senior / facile': ['elder_friendly', 'low_walking']
  },
  priority: {
    'Confort': ['comfort'],
    'Détente': ['relaxation'],
    'Culture': ['culture'],
    'Nourriture': ['food'],
    'Nature': ['nature']
  },
  pace: {
    'Calme (peu de marche)': ['relaxed', 'low_walking', 'short_distances'],
    'Équilibré': ['balanced'],
    'Marche légère': ['light_walking']
  },

  // New format mappings (from Step 1)
  tripTypeNew: {
    'famille': ['family', 'kids'],
    'romantique': ['couple'],
    'solo': ['solo'],
    'amis': ['group', 'friends'],
    'senior': ['elder_friendly', 'low_walking', 'comfort'],
    'business': ['business', 'comfort']
  },

  // Budget mappings (from Step 4)
  budget: {
    'budget': ['budget_conscious'],
    'moderate': ['mid_range'],
    'luxury': ['luxury', 'comfort']
  },

  // Pace mappings (from Step 4) - new format
  paceNew: {
    'relaxed': ['relaxed', 'low_walking', 'short_distances'],
    'moderate': ['balanced'],
    'active': ['light_walking', 'active']
  },

  // Interest mappings (from Step 4)
  interests: {
    'food': ['food'],
    'history': ['culture', 'history'],
    'nature': ['nature'],
    'shopping': ['shopping'],
    'photography': ['photography'],
    'nightlife': ['nightlife'],
    'wellness': ['wellness', 'relaxation'],
    'art': ['culture', 'art']
  },

  // Accessibility mappings (from Step 4)
  accessibility: {
    'wheelchair': ['wheelchair_access', 'elder_friendly'],
    'limited_walking': ['low_walking', 'short_distances', 'elder_friendly'],
    'child_friendly': ['kids', 'family']
  }
};

// Convert new tripType id to old format for backward compat in storage
const TRIP_TYPE_CONVERSION = {
  'famille': 'En famille',
  'romantique': 'En couple',
  'solo': 'Solo',
  'amis': 'Avec enfants',
  'senior': 'Senior / facile',
  'business': 'Business'
};

// Convert new pace id to old format
const PACE_CONVERSION = {
  'relaxed': 'Calme (peu de marche)',
  'moderate': 'Équilibré',
  'active': 'Marche légère'
};

export const usePersonalization = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile to localStorage (supports both old and new format)
  const saveProfile = (formData) => {
    // Handle both old format (3 fields) and new format (full wizard)
    const isNewFormat = formData.tripType && typeof formData.tripType === 'string' &&
      formData.tripType.length < 20; // New format uses short IDs

    let tags = [];
    let profileData = {};

    if (isNewFormat) {
      // New 4-step wizard format
      const {
        tripType, destination, startDate, endDate, travelers,
        budget, pace, interests, accessibility
      } = formData;

      // Collect tags from all selections
      // Trip type tags
      if (tripType && TAG_MAPPING.tripTypeNew[tripType]) {
        tags.push(...TAG_MAPPING.tripTypeNew[tripType]);
      }

      // Budget tags
      if (budget && TAG_MAPPING.budget[budget]) {
        tags.push(...TAG_MAPPING.budget[budget]);
      }

      // Pace tags
      if (pace && TAG_MAPPING.paceNew[pace]) {
        tags.push(...TAG_MAPPING.paceNew[pace]);
      }

      // Interest tags (multi-select)
      if (interests && Array.isArray(interests)) {
        interests.forEach(interest => {
          if (TAG_MAPPING.interests[interest]) {
            tags.push(...TAG_MAPPING.interests[interest]);
          }
        });
      }

      // Accessibility tags (multi-select)
      if (accessibility && Array.isArray(accessibility)) {
        accessibility.forEach(acc => {
          if (TAG_MAPPING.accessibility[acc]) {
            tags.push(...TAG_MAPPING.accessibility[acc]);
          }
        });
      }

      // Remove duplicates
      tags = [...new Set(tags)];

      // Build profile with backward-compatible fields + new fields
      profileData = {
        // Backward compatible fields (using old format strings)
        travelType: TRIP_TYPE_CONVERSION[tripType] || tripType,
        priority: interests && interests.length > 0
          ? (interests.includes('nature') ? 'Nature' :
            interests.includes('food') ? 'Nourriture' :
              interests.includes('history') ? 'Culture' : 'Détente')
          : 'Détente',
        pace: PACE_CONVERSION[pace] || pace || 'Équilibré',
        tags,
        createdAt: new Date().toISOString(),

        // New fields (for enhanced features)
        destination: destination || '',
        startDate: startDate || '',
        endDate: endDate || '',
        travelers: travelers || 1,
        budgetLevel: budget || '',
        paceLevel: pace || '',
        interests: interests || [],
        accessibility: accessibility || [],
        wizardVersion: 2 // Version marker for future migrations
      };
    } else {
      // Old format (3-step wizard) - for backward compatibility
      const { travelType, priority, pace } = formData;

      tags = [
        ...(TAG_MAPPING.travelType[travelType] || []),
        ...(TAG_MAPPING.priority[priority] || []),
        ...(TAG_MAPPING.pace[pace] || [])
      ];

      profileData = {
        travelType,
        priority,
        pace,
        tags,
        createdAt: new Date().toISOString()
      };
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      setProfile(profileData);
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

  // Clear profile
  const clearProfile = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
      return true;
    } catch (error) {
      console.error('Error clearing profile:', error);
      return false;
    }
  };

  // Get French label for a tag
  const getTagLabel = (tag) => {
    const labelMap = {
      // Original labels
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

      // New labels
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

  return {
    profile,
    isLoading,
    saveProfile,
    clearProfile,
    getTagLabel,
    hasProfile: !!profile
  };
};

export default usePersonalization;
