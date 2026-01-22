import 'dart:math';
import '../models/trip_idea.dart';
import '../models/city.dart';
import '../demo/demo_trip_ideas.dart';
import '../local/trip_idea_store.dart';
import '../local/prefs_store.dart';
import '../remote/api_client.dart';
import '../../core/constants.dart';

/// Repository for building TripIdea recommendation deck
class TripIdeaRepository {
  final ApiClient _api = ApiClient();
  final Random _random = Random();

  List<City> _cachedCities = [];
  bool _isOffline = false;

  /// Check if we're in demo/offline mode
  bool get isOffline => _isOffline;

  /// Fetch cities from backend (for image URLs)
  Future<void> fetchCities() async {
    try {
      final response = await _api.get('/api/cities');

      if (response.data is List) {
        _cachedCities = (response.data as List)
            .map((json) => City.fromJson(json as Map<String, dynamic>))
            .toList();
        _isOffline = false;
        AppConstants.isDemoMode = false;
      }
    } catch (e) {
      print('Error fetching cities (offline mode): $e');
      _isOffline = true;
      AppConstants.isDemoMode = true;
    }
  }

  /// Get city image URL for a TripIdea
  String? getCityImageUrl(String cityId) {
    final city = _cachedCities
        .where((c) =>
            c.id.toLowerCase() == cityId.toLowerCase() ||
            c.name.toLowerCase().contains(cityId.toLowerCase()))
        .firstOrNull;

    if (city != null && city.image.isNotEmpty) {
      return AppConstants.imageUrl(city.image);
    }
    return null;
  }

  /// Get popular spots for a city
  List<String> getCityPopularSpots(String cityId) {
    final city = _cachedCities
        .where((c) =>
            c.id.toLowerCase() == cityId.toLowerCase() ||
            c.name.toLowerCase().contains(cityId.toLowerCase()))
        .firstOrNull;

    return city?.popularSpots ?? [];
  }

  /// Build a deck of TripIdea cards with smart weighting
  Future<List<TripIdea>> buildDeck({int size = 15}) async {
    // Try to fetch cities for images
    if (_cachedCities.isEmpty) {
      await fetchCities();
    }

    // Get user preferences
    final userPrefs = PrefsStore.getUserPrefs();

    // Get liked/disliked data
    final likedIds = TripIdeaLikesStore.getLikedIds();
    final dislikedIds = TripIdeaLikesStore.getDislikedIds();
    final tagWeights = TripIdeaLikesStore.getTagWeights();
    final recentlyShown = TripIdeaLikesStore.getRecentlyShown();

    // Start with all demo ideas
    List<TripIdea> availableIdeas = DemoTripIdeas.ideas.where((idea) {
      // Filter out already liked/disliked/recently shown
      if (likedIds.contains(idea.id)) return false;
      if (dislikedIds.contains(idea.id)) return false;
      if (recentlyShown.contains(idea.id)) return false;
      return true;
    }).toList();

    if (availableIdeas.isEmpty) {
      // Reset if all cards have been seen
      await TripIdeaLikesStore.clearRecentlyShown();
      availableIdeas = DemoTripIdeas.ideas
          .where((idea) =>
              !likedIds.contains(idea.id) && !dislikedIds.contains(idea.id))
          .toList();
    }

    if (availableIdeas.isEmpty) {
      // If everything is liked/disliked, return shuffled full list
      return DemoTripIdeas.getRandomIdeas(size);
    }

    // Score and sort ideas based on preferences
    final scoredIdeas = availableIdeas.map((idea) {
      double score = 0;

      // Score based on user onboarding preferences
      if (userPrefs != null) {
        for (final preferredTag in userPrefs.preferredTags) {
          if (idea.tags
              .any((t) => t.toLowerCase() == preferredTag.toLowerCase())) {
            score += 3;
          }
        }

        // Match priority
        if (idea.tags
            .any((t) => t.toLowerCase() == userPrefs.priority.toLowerCase())) {
          score += 2;
        }

        // Match intensity with pace
        if (userPrefs.pace == 'calm' && idea.intensity == 'calm') score += 1;
        if (userPrefs.pace == 'balanced' && idea.intensity == 'balanced')
          score += 1;
        if (userPrefs.pace == 'active' && idea.intensity == 'active')
          score += 1;
      }

      // Score based on tag weights from swipe history
      for (final tag in idea.tags) {
        score += (tagWeights[tag] ?? 0) * 1.5;
      }

      // Add randomness for variety
      score += _random.nextDouble() * 4;

      return MapEntry(idea, score);
    }).toList();

    // Sort by score (highest first)
    scoredIdeas.sort((a, b) => b.value.compareTo(a.value));

    // Take top candidates and shuffle a bit for variety
    final topCandidates = scoredIdeas.take(size * 2).toList();
    topCandidates.shuffle(_random);

    // Build final deck with enhanced data
    final deck = topCandidates.take(size).map((entry) {
      final idea = entry.key;

      // Try to get city image from backend
      final cityImage = getCityImageUrl(idea.cityId);

      return TripIdea(
        id: idea.id,
        cityId: idea.cityId,
        cityName: idea.cityName,
        country: idea.country,
        continent: idea.continent,
        activityTitle: idea.activityTitle,
        shortDescription: idea.shortDescription,
        whyThis: idea.whyThis,
        tags: idea.tags,
        duration: idea.duration,
        intensity: idea.intensity,
        imageUrl: idea.imageUrl,
        cityImageUrl: cityImage,
      );
    }).toList();

    return deck;
  }

  /// Get similar ideas for a given TripIdea (for TripVibeScreen)
  List<TripIdea> getSimilarIdeas(TripIdea currentIdea, {int limit = 5}) {
    final results = <TripIdea>[];

    // Get ideas from same city
    final sameCity = DemoTripIdeas.ideas
        .where((idea) =>
            idea.cityId == currentIdea.cityId && idea.id != currentIdea.id)
        .toList();

    // Get ideas with similar tags
    final similarTags = DemoTripIdeas.ideas.where((idea) {
      if (idea.id == currentIdea.id) return false;
      if (idea.cityId == currentIdea.cityId) return false;

      // Count matching tags
      int matches = 0;
      for (final tag in currentIdea.tags) {
        if (idea.tags.contains(tag)) matches++;
      }
      return matches >= 2;
    }).toList();

    // Prioritize same city
    results.addAll(sameCity.take(3));

    // Add similar tagged ideas from other cities
    similarTags.shuffle(_random);
    for (final idea in similarTags) {
      if (results.length >= limit) break;
      if (!results.any((r) => r.id == idea.id)) {
        results.add(idea);
      }
    }

    // Fill remaining with same city if available
    for (final idea in sameCity) {
      if (results.length >= limit) break;
      if (!results.any((r) => r.id == idea.id)) {
        results.add(idea);
      }
    }

    return results.take(limit).toList();
  }

  /// Get all ideas for a specific city
  List<TripIdea> getIdeasForCity(String cityId) {
    return DemoTripIdeas.getIdeasForCity(cityId);
  }
}
