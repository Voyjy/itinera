import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants.dart';

/// Local storage for disliked city IDs
class DislikesStore {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('DislikesStore not initialized. Call DislikesStore.init() first.');
    }
    return _prefs!;
  }

  /// Get all disliked city IDs
  static Set<String> getDislikedIds() {
    final json = prefs.getString(AppConstants.dislikedIdsKey);
    if (json == null) return {};
    
    try {
      final list = jsonDecode(json) as List<dynamic>;
      return list.map((e) => e.toString()).toSet();
    } catch (e) {
      print('Error parsing disliked IDs: $e');
      return {};
    }
  }

  /// Add a disliked city ID
  static Future<void> addDislike(String cityId) async {
    final ids = getDislikedIds();
    ids.add(cityId);
    await _saveIds(ids);
  }

  /// Remove a disliked ID (optional - if user wants to see again)
  static Future<void> removeDislike(String cityId) async {
    final ids = getDislikedIds();
    ids.remove(cityId);
    await _saveIds(ids);
  }

  /// Check if a city is disliked
  static bool isDisliked(String cityId) {
    return getDislikedIds().contains(cityId);
  }

  /// Clear all dislikes
  static Future<void> clearAll() async {
    await prefs.remove(AppConstants.dislikedIdsKey);
  }

  static Future<void> _saveIds(Set<String> ids) async {
    final json = jsonEncode(ids.toList());
    await prefs.setString(AppConstants.dislikedIdsKey, json);
  }

  /// Get tags from disliked cards for preference adaptation
  /// Requires passing tag data since we only store IDs
  static Map<String, int> dislikedTagsFromHistory = {};

  /// Record disliked tags
  static Future<void> recordDislikedTags(List<String> tags) async {
    for (final tag in tags) {
      dislikedTagsFromHistory[tag] = (dislikedTagsFromHistory[tag] ?? 0) + 1;
    }
  }
}
