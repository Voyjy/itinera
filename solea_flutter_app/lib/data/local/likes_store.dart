import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants.dart';
import '../models/trip_card.dart';

/// Local storage for liked TripCards
class LikesStore {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('LikesStore not initialized. Call LikesStore.init() first.');
    }
    return _prefs!;
  }

  /// Get all liked TripCards
  static List<TripCard> getLikedCards() {
    final json = prefs.getString(AppConstants.likedCardsKey);
    if (json == null) return [];
    
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => TripCard.fromJson(e as Map<String, dynamic>)).toList();
    } catch (e) {
      print('Error parsing liked cards: $e');
      return [];
    }
  }

  /// Get liked city IDs only
  static Set<String> getLikedCityIds() {
    return getLikedCards().map((c) => c.cityId).toSet();
  }

  /// Add a liked card
  static Future<void> addLike(TripCard card) async {
    final cards = getLikedCards();
    
    // Avoid duplicates
    if (cards.any((c) => c.cityId == card.cityId)) return;
    
    cards.add(card);
    await _saveCards(cards);
  }

  /// Remove a liked card
  static Future<void> removeLike(String cityId) async {
    final cards = getLikedCards();
    cards.removeWhere((c) => c.cityId == cityId);
    await _saveCards(cards);
  }

  /// Check if a city is liked
  static bool isLiked(String cityId) {
    return getLikedCityIds().contains(cityId);
  }

  /// Clear all likes
  static Future<void> clearAll() async {
    await prefs.remove(AppConstants.likedCardsKey);
  }

  static Future<void> _saveCards(List<TripCard> cards) async {
    final json = jsonEncode(cards.map((c) => c.toJson()).toList());
    await prefs.setString(AppConstants.likedCardsKey, json);
  }

  /// Get tags from liked cards for preference adaptation
  static Map<String, int> getLikedTagCounts() {
    final tagCounts = <String, int>{};
    for (final card in getLikedCards()) {
      for (final tag in card.tags) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
    return tagCounts;
  }
}
