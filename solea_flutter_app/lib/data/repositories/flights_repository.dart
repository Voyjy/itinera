import 'package:url_launcher/url_launcher.dart';
import '../../core/constants.dart';
import '../models/flight_search.dart';

/// Repository for flight search functionality
/// Mode 1: Redirect via deep links (always works)
/// Mode 2: API calls if FLIGHT_API_KEY is configured (optional)
class FlightsRepository {
  
  /// Check if API mode is available
  bool get isApiModeAvailable => 
      AppConstants.flightApiKey != null && 
      AppConstants.flightApiKey!.isNotEmpty;

  // ============================================
  // MODE 1: Deep Link Redirects (Default)
  // ============================================

  /// Launch Google Flights search
  Future<bool> launchGoogleFlights(FlightSearch search) async {
    final url = AppConstants.googleFlightsUrl(
      origin: search.origin,
      destination: search.destination,
      departDate: search.departDate,
      returnDate: search.returnDate,
      passengers: search.passengers,
      cabin: search.cabin,
    );
    return _launchUrl(url);
  }

  /// Launch Skyscanner search
  Future<bool> launchSkyscanner(FlightSearch search) async {
    final url = AppConstants.skyscannerUrl(
      origin: search.origin,
      destination: search.destination,
      departDate: search.departDate,
      returnDate: search.returnDate,
      passengers: search.passengers,
      cabin: search.cabin,
    );
    return _launchUrl(url);
  }

  /// Launch Kayak search
  Future<bool> launchKayak(FlightSearch search) async {
    final url = AppConstants.kayakUrl(
      origin: search.origin,
      destination: search.destination,
      departDate: search.departDate,
      returnDate: search.returnDate,
      passengers: search.passengers,
      cabin: search.cabin,
    );
    return _launchUrl(url);
  }

  /// Helper to launch URL in browser
  Future<bool> _launchUrl(String urlString) async {
    try {
      final uri = Uri.parse(urlString);
      if (await canLaunchUrl(uri)) {
        return await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
      print('Cannot launch URL: $urlString');
      return false;
    } catch (e) {
      print('Error launching URL: $e');
      return false;
    }
  }

  // ============================================
  // MODE 2: API Mode (Optional - Amadeus)
  // ============================================
  // 
  // If you want to enable in-app flight results:
  // 1. Get a free API key from https://developers.amadeus.com/
  // 2. Set FLIGHT_API_KEY in constants.dart
  // 3. Implement the methods below
  //
  // For MVP, we use redirect mode only.
  
  /// Get flight offers from API (stub - implement if API key available)
  Future<List<FlightOffer>> getFlightOffers(FlightSearch search) async {
    if (!isApiModeAvailable) {
      return [];
    }

    // TODO: Implement Amadeus API call if needed
    // This would involve:
    // 1. Get OAuth token
    // 2. Call /v2/shopping/flight-offers
    // 3. Parse response

    return [];
  }
}

/// Flight offer model (for future API integration)
class FlightOffer {
  final String id;
  final String price;
  final String currency;
  final String departureTime;
  final String arrivalTime;
  final String airline;
  final int stops;
  final String duration;

  FlightOffer({
    required this.id,
    required this.price,
    required this.currency,
    required this.departureTime,
    required this.arrivalTime,
    required this.airline,
    required this.stops,
    required this.duration,
  });
}
