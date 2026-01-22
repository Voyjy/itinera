/// API and Flight configuration constants
class AppConstants {
  AppConstants._();

  // ============================================
  // BACKEND API CONFIGURATION
  // ============================================
  
  /// Base URL for the API Gateway
  /// - Android Emulator: http://10.0.2.2:8080 (maps to host localhost)
  /// - Physical device: http://<your-computer-ip>:8080
  /// - Production: https://your-deployed-gateway.com
  static const String baseUrl = 'http://10.0.2.2:8080';

  /// Build full image URL from city.image path
  /// city.image is like "assets/Europe/Paris.jpg"
  static String imageUrl(String imagePath) {
    if (imagePath.startsWith('http')) return imagePath;
    return '$baseUrl/$imagePath';
  }

  // ============================================
  // LOCAL STORAGE KEYS
  // ============================================
  static const String userProfileKey = 'solea_user_profile_v1';
  static const String likedCardsKey = 'solea_liked_cards';
  static const String dislikedIdsKey = 'solea_disliked_ids';
  static const String onboardingCompleteKey = 'solea_onboarding_complete';
  static const String lastFlightSearchKey = 'solea_last_flight_search';

  // ============================================
  // FLIGHT SEARCH CONFIGURATION (OPTIONAL API)
  // ============================================
  
  /// Optional: Set your Amadeus API key here to enable in-app flight results
  /// If empty or null, the app will use redirect links (Google Flights, etc.)
  /// Get a free API key at: https://developers.amadeus.com/
  static const String? flightApiKey = null; // e.g., 'your-amadeus-api-key'
  static const String? flightApiSecret = null;
  
  /// Amadeus API base URL (only used if flightApiKey is set)
  static const String amadeusBaseUrl = 'https://test.api.amadeus.com';

  // ============================================
  // DEEP LINK TEMPLATES FOR FLIGHT SEARCH
  // ============================================
  
  /// Google Flights search URL template
  /// Format: /travel/flights/{origin}/{dest}/{date}
  static String googleFlightsUrl({
    required String origin,
    required String destination,
    required String departDate,
    String? returnDate,
    int passengers = 1,
    String cabin = 'economy',
  }) {
    final cabinCode = _cabinCode(cabin, 'google');
    final returnPart = returnDate != null ? '/$returnDate' : '';
    return 'https://www.google.com/travel/flights?q=Flights%20to%20$destination%20from%20$origin%20on%20$departDate$returnPart&curr=EUR&tfs=CBwQAhooEgoyMDI2LTAxLTI1agwIAxIIL20vMDZtXzFyBwgBEgNPUkRAAUgBcAGCARcQAhoTEgNPUkQaATASCTIwMjYtMDEtMjU';
  }

  /// Skyscanner search URL
  static String skyscannerUrl({
    required String origin,
    required String destination,
    required String departDate,
    String? returnDate,
    int passengers = 1,
    String cabin = 'economy',
  }) {
    final formattedDepart = departDate.replaceAll('-', '');
    final formattedReturn = returnDate?.replaceAll('-', '') ?? '';
    final cabinClass = _cabinCode(cabin, 'skyscanner');
    final returnPart = formattedReturn.isNotEmpty ? '/$formattedReturn' : '';
    return 'https://www.skyscanner.fr/transport/vols/$origin/$destination/$formattedDepart$returnPart/?adults=$passengers&cabinclass=$cabinClass';
  }

  /// Kayak search URL
  static String kayakUrl({
    required String origin,
    required String destination,
    required String departDate,
    String? returnDate,
    int passengers = 1,
    String cabin = 'economy',
  }) {
    final cabinClass = _cabinCode(cabin, 'kayak');
    final tripType = returnDate != null ? '$departDate/$returnDate' : '$departDate';
    return 'https://www.kayak.fr/flights/$origin-$destination/$tripType/${passengers}adults?sort=bestflight_a&fs=cabin=$cabinClass';
  }

  static String _cabinCode(String cabin, String provider) {
    switch (provider) {
      case 'google':
        switch (cabin) {
          case 'business': return '2';
          case 'premium': return '1';
          default: return '0';
        }
      case 'skyscanner':
        switch (cabin) {
          case 'business': return 'business';
          case 'premium': return 'premiumeconomy';
          default: return 'economy';
        }
      case 'kayak':
        switch (cabin) {
          case 'business': return 'b';
          case 'premium': return 'p';
          default: return 'e';
        }
      default:
        return 'economy';
    }
  }
}
