import 'dart:math';
import '../models/city.dart';
import '../models/trip_card.dart';
import '../models/user_prefs.dart';
import '../remote/api_client.dart';
import '../local/likes_store.dart';
import '../local/dislikes_store.dart';
import '../local/prefs_store.dart';
import '../../core/constants.dart';

/// Repository for fetching and building trip recommendations
class RecommendationRepository {
  final ApiClient _api = ApiClient();
  
  List<City> _cachedCities = [];
  final Random _random = Random();

  /// Fetch all cities from backend
  Future<List<City>> fetchCities() async {
    try {
      final response = await _api.get('/api/cities');
      
      if (response.data is List) {
        _cachedCities = (response.data as List)
            .map((json) => City.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      
      return _cachedCities;
    } catch (e) {
      print('Error fetching cities: $e');
      // Return cached if available
      if (_cachedCities.isNotEmpty) {
        return _cachedCities;
      }
      rethrow;
    }
  }

  /// Get city details by ID
  Future<City?> fetchCityDetails(String cityId) async {
    try {
      final response = await _api.get('/api/cities/$cityId');
      return City.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      print('Error fetching city details: $e');
      // Try to find in cache
      return _cachedCities.where((c) => c.id == cityId).firstOrNull;
    }
  }

  /// Build a deck of TripCards with client-side adaptation
  Future<List<TripCard>> buildDeck({int size = 10}) async {
    // Ensure cities are loaded
    if (_cachedCities.isEmpty) {
      await fetchCities();
    }

    // Get user preferences
    final userPrefs = PrefsStore.getUserPrefs();
    
    // Get liked/disliked data
    final likedIds = LikesStore.getLikedCityIds();
    final dislikedIds = DislikesStore.getDislikedIds();
    final likedTagCounts = LikesStore.getLikedTagCounts();
    
    // Filter out already liked/disliked cities
    final availableCities = _cachedCities.where((city) {
      return !likedIds.contains(city.id) && !dislikedIds.contains(city.id);
    }).toList();

    if (availableCities.isEmpty) {
      return [];
    }

    // Score and sort cities based on preferences
    final scoredCities = availableCities.map((city) {
      double score = 0;
      
      // Score based on user preferences
      if (userPrefs != null) {
        for (final preferredTag in userPrefs.preferredTags) {
          if (city.tags.any((t) => t.toLowerCase() == preferredTag.toLowerCase())) {
            score += 2;
          }
        }
      }
      
      // Score based on liked tags (adaptation)
      for (final tag in city.tags) {
        score += (likedTagCounts[tag] ?? 0) * 1.5;
      }
      
      // Reduce score for disliked tags
      for (final tag in city.tags) {
        score -= (DislikesStore.dislikedTagsFromHistory[tag] ?? 0) * 0.5;
      }
      
      // Add some randomness to keep variety
      score += _random.nextDouble() * 3;
      
      return MapEntry(city, score);
    }).toList();

    // Sort by score (highest first)
    scoredCities.sort((a, b) => b.value.compareTo(a.value));

    // Take top candidates and shuffle a bit for variety
    final topCandidates = scoredCities.take(size * 2).toList();
    topCandidates.shuffle(_random);

    // Build TripCards
    final deck = topCandidates.take(size).map((entry) {
      final city = entry.key;
      return TripCard.fromCity(
        city,
        AppConstants.baseUrl,
        whyThisExplanation: _generatePersonalizedWhyThis(city, userPrefs),
      );
    }).toList();

    return deck;
  }

  /// Generate a personalized "Why this trip?" explanation
  String _generatePersonalizedWhyThis(City city, UserPrefs? prefs) {
    if (prefs == null) {
      return TripCard.fromCity(city, AppConstants.baseUrl).whyThis;
    }

    final matches = <String>[];

    // Check matching preferences
    if (prefs.priority.isNotEmpty) {
      if (city.tags.any((t) => t.toLowerCase() == prefs.priority.toLowerCase())) {
        matches.add('exactement ce que vous recherchez : ${prefs.priority}');
      }
    }

    if (city.tags.contains('romantic') && prefs.travelType == 'couple') {
      matches.add('une ambiance romantique parfaite pour les couples');
    }

    if (city.tags.contains('family') && (prefs.travelType == 'family' || prefs.travelType == 'kids')) {
      matches.add('idéal pour les familles');
    }

    if (city.tags.contains('relax') && prefs.pace == 'calm') {
      matches.add('un rythme relaxant');
    }

    if (matches.isEmpty) {
      // Default explanation
      final tagDescriptions = {
        'nature': 'des paysages naturels',
        'culture': 'une richesse culturelle',
        'food': 'une gastronomie unique',
        'beach': 'des plages magnifiques',
        'history': 'un patrimoine historique',
        'adventure': "l'aventure",
      };

      for (final tag in city.tags.take(2)) {
        if (tagDescriptions.containsKey(tag)) {
          matches.add(tagDescriptions[tag]!);
        }
      }
    }

    if (matches.isEmpty) {
      return 'Découvrez ${city.name}, une destination unique !';
    }

    return '${city.name} vous offre ${matches.join(' et ')}.';
  }

  /// Get cached cities (for offline access)
  List<City> get cachedCities => _cachedCities;
}
