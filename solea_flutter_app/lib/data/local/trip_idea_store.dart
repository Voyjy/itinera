import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants.dart';
import '../models/trip_idea.dart';

/// Local storage for liked TripIdeas with tag weighting
class TripIdeaLikesStore {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('TripIdeaLikesStore not initialized');
    }
    return _prefs!;
  }

  // ============================================
  // LIKED TRIP IDEAS
  // ============================================

  /// Get all liked TripIdeas
  static List<TripIdea> getLikedIdeas() {
    final json = prefs.getString(AppConstants.likedTripIdeasKey);
    if (json == null) return [];

    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list
          .map((e) => TripIdea.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('Error parsing liked TripIdeas: $e');
      return [];
    }
  }

  /// Get liked TripIdea IDs only
  static Set<String> getLikedIds() {
    return getLikedIdeas().map((i) => i.id).toSet();
  }

  /// Add a liked TripIdea
  static Future<void> addLike(TripIdea idea) async {
    final ideas = getLikedIdeas();

    // Avoid duplicates
    if (ideas.any((i) => i.id == idea.id)) return;

    ideas.add(idea);
    await _saveIdeas(ideas);

    // Update tag weights
    await _updateTagWeights(idea.tags, increment: true);
  }

  /// Remove a liked TripIdea
  static Future<void> removeLike(String ideaId) async {
    final ideas = getLikedIdeas();
    final removed = ideas.where((i) => i.id == ideaId).firstOrNull;
    ideas.removeWhere((i) => i.id == ideaId);
    await _saveIdeas(ideas);

    // Update tag weights
    if (removed != null) {
      await _updateTagWeights(removed.tags, increment: false);
    }
  }

  /// Check if a TripIdea is liked
  static bool isLiked(String ideaId) {
    return getLikedIds().contains(ideaId);
  }

  /// Clear all likes
  static Future<void> clearAll() async {
    await prefs.remove(AppConstants.likedTripIdeasKey);
    await prefs.remove(AppConstants.tagWeightsKey);
  }

  static Future<void> _saveIdeas(List<TripIdea> ideas) async {
    final json = jsonEncode(ideas.map((i) => i.toJson()).toList());
    await prefs.setString(AppConstants.likedTripIdeasKey, json);
  }

  // ============================================
  // DISLIKED TRIP IDEAS
  // ============================================

  /// Get all disliked TripIdea IDs
  static Set<String> getDislikedIds() {
    final json = prefs.getString(AppConstants.dislikedTripIdeasKey);
    if (json == null) return {};

    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => e.toString()).toSet();
    } catch (e) {
      print('Error parsing disliked IDs: $e');
      return {};
    }
  }

  /// Add a disliked TripIdea
  static Future<void> addDislike(String ideaId, List<String> tags) async {
    final ids = getDislikedIds();
    ids.add(ideaId);

    final json = jsonEncode(ids.toList());
    await prefs.setString(AppConstants.dislikedTripIdeasKey, json);

    // Reduce tag weights
    await _updateTagWeights(tags, increment: false, weight: 0.5);
  }

  /// Check if a TripIdea is disliked
  static bool isDisliked(String ideaId) {
    return getDislikedIds().contains(ideaId);
  }

  // ============================================
  // TAG WEIGHTS (for preference adaptation)
  // ============================================

  /// Get current tag weights
  static Map<String, double> getTagWeights() {
    final json = prefs.getString(AppConstants.tagWeightsKey);
    if (json == null) return {};

    try {
      final map = jsonDecode(json) as Map<String, dynamic>;
      return map.map((key, value) => MapEntry(key, (value as num).toDouble()));
    } catch (e) {
      print('Error parsing tag weights: $e');
      return {};
    }
  }

  /// Update tag weights (called after like/dislike)
  static Future<void> _updateTagWeights(
    List<String> tags, {
    required bool increment,
    double weight = 1.0,
  }) async {
    final weights = getTagWeights();

    for (final tag in tags) {
      final current = weights[tag] ?? 0.0;
      if (increment) {
        weights[tag] = current + weight;
      } else {
        weights[tag] = (current - weight).clamp(-5.0, 10.0);
      }
    }

    final json = jsonEncode(weights);
    await prefs.setString(AppConstants.tagWeightsKey, json);
  }

  // ============================================
  // RECENTLY SHOWN (to avoid repeats)
  // ============================================

  /// Get recently shown TripIdea IDs (last 20)
  static List<String> getRecentlyShown() {
    final json = prefs.getString(AppConstants.recentlyShownKey);
    if (json == null) return [];

    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => e.toString()).toList();
    } catch (e) {
      return [];
    }
  }

  /// Add to recently shown list
  static Future<void> markAsShown(String ideaId) async {
    final recent = getRecentlyShown();

    // Remove if already present
    recent.remove(ideaId);

    // Add to front
    recent.insert(0, ideaId);

    // Keep only last 20
    final trimmed = recent.take(20).toList();

    final json = jsonEncode(trimmed);
    await prefs.setString(AppConstants.recentlyShownKey, json);
  }

  /// Check if was recently shown
  static bool wasRecentlyShown(String ideaId) {
    return getRecentlyShown().contains(ideaId);
  }

  /// Clear recently shown
  static Future<void> clearRecentlyShown() async {
    await prefs.remove(AppConstants.recentlyShownKey);
  }
}
