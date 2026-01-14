import { useState, useEffect } from 'react';

const STORAGE_KEY = 'solea_user_profile_v1';

// Tag mapping configuration
const TAG_MAPPING = {
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
  }
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

  // Save profile to localStorage
  const saveProfile = (answers) => {
    const { travelType, priority, pace } = answers;

    // Collect all tags from answers
    const tags = [
      ...(TAG_MAPPING.travelType[travelType] || []),
      ...(TAG_MAPPING.priority[priority] || []),
      ...(TAG_MAPPING.pace[pace] || [])
    ];

    const newProfile = {
      travelType,
      priority,
      pace,
      tags,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
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
      light_walking: 'Marche légère'
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
