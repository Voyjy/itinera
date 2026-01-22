import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants.dart';
import '../models/user_prefs.dart';

/// SharedPreferences wrapper for user preferences
class PrefsStore {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('PrefsStore not initialized. Call PrefsStore.init() first.');
    }
    return _prefs!;
  }

  /// Check if onboarding is complete
  static bool get isOnboardingComplete {
    return prefs.getBool(AppConstants.onboardingCompleteKey) ?? false;
  }

  /// Set onboarding complete
  static Future<void> setOnboardingComplete(bool value) async {
    await prefs.setBool(AppConstants.onboardingCompleteKey, value);
  }

  /// Get user preferences
  static UserPrefs? getUserPrefs() {
    final json = prefs.getString(AppConstants.userProfileKey);
    if (json == null) return null;
    return UserPrefs.fromJsonString(json);
  }

  /// Save user preferences
  static Future<void> saveUserPrefs(UserPrefs userPrefs) async {
    await prefs.setString(AppConstants.userProfileKey, userPrefs.toJsonString());
  }

  /// Clear all preferences
  static Future<void> clearAll() async {
    await prefs.remove(AppConstants.userProfileKey);
    await prefs.remove(AppConstants.onboardingCompleteKey);
  }

  /// Get last flight search params
  static String? getLastFlightSearch() {
    return prefs.getString(AppConstants.lastFlightSearchKey);
  }

  /// Save last flight search params
  static Future<void> saveLastFlightSearch(String json) async {
    await prefs.setString(AppConstants.lastFlightSearchKey, json);
  }
}
