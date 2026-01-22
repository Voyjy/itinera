import 'package:dio/dio.dart';
import '../../core/constants.dart';
import '../models/flight_search.dart';

/// Amadeus API service for flight search
/// Only works if FLIGHT_API_KEY is configured in constants.dart
class AmadeusService {
  static Dio? _dio;
  static String? _accessToken;
  static DateTime? _tokenExpiry;

  /// Check if API is available
  static bool get isAvailable =>
      AppConstants.flightApiKey != null &&
      AppConstants.flightApiKey!.isNotEmpty &&
      AppConstants.flightApiSecret != null &&
      AppConstants.flightApiSecret!.isNotEmpty;

  /// Initialize Dio client
  static Dio get dio {
    _dio ??= Dio(BaseOptions(
      baseUrl: AppConstants.amadeusBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    ));
    return _dio!;
  }

  /// Get OAuth2 access token
  static Future<String?> _getAccessToken() async {
    // Return cached token if still valid
    if (_accessToken != null &&
        _tokenExpiry != null &&
        DateTime.now().isBefore(_tokenExpiry!)) {
      return _accessToken;
    }

    if (!isAvailable) {
      print('Amadeus API not configured');
      return null;
    }

    try {
      final response = await dio.post(
        '/v1/security/oauth2/token',
        data: {
          'grant_type': 'client_credentials',
          'client_id': AppConstants.flightApiKey,
          'client_secret': AppConstants.flightApiSecret,
        },
        options: Options(
          contentType: Headers.formUrlEncodedContentType,
        ),
      );

      if (response.statusCode == 200) {
        _accessToken = response.data['access_token'];
        final expiresIn = response.data['expires_in'] ?? 1799;
        _tokenExpiry = DateTime.now().add(Duration(seconds: expiresIn - 60));
        return _accessToken;
      }
    } catch (e) {
      print('Error getting Amadeus token: $e');
    }

    return null;
  }

  /// Search for flight offers
  /// Returns empty list if API is not configured or fails
  static Future<List<FlightOffer>> searchFlights(FlightSearch search) async {
    if (!isAvailable) {
      print('Amadeus API not available, fallback to redirect mode');
      return [];
    }

    final token = await _getAccessToken();
    if (token == null) {
      print('Failed to get Amadeus token');
      return [];
    }

    try {
      final response = await dio.get(
        '/v2/shopping/flight-offers',
        queryParameters: {
          'originLocationCode': search.origin.toUpperCase(),
          'destinationLocationCode': search.destination.toUpperCase(),
          'departureDate': search.departDate,
          if (search.returnDate != null) 'returnDate': search.returnDate,
          'adults': search.passengers,
          'travelClass': _mapCabinClass(search.cabin),
          'max': 10,
          'currencyCode': 'EUR',
        },
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
        ),
      );

      if (response.statusCode == 200 && response.data['data'] != null) {
        return (response.data['data'] as List).map((json) {
          return FlightOffer.fromAmadeusJson(json);
        }).toList();
      }
    } catch (e) {
      print('Error searching flights: $e');
    }

    return [];
  }

  static String _mapCabinClass(String cabin) {
    switch (cabin.toLowerCase()) {
      case 'business':
        return 'BUSINESS';
      case 'premium':
        return 'PREMIUM_ECONOMY';
      case 'first':
        return 'FIRST';
      default:
        return 'ECONOMY';
    }
  }
}

/// Flight offer from Amadeus API
class FlightOffer {
  final String id;
  final String price;
  final String currency;
  final String departureTime;
  final String arrivalTime;
  final String airline;
  final int stops;
  final String duration;
  final bool isDirectFlight;
  final String origin;
  final String destination;

  FlightOffer({
    required this.id,
    required this.price,
    required this.currency,
    required this.departureTime,
    required this.arrivalTime,
    required this.airline,
    required this.stops,
    required this.duration,
    this.isDirectFlight = false,
    this.origin = '',
    this.destination = '',
  });

  factory FlightOffer.fromAmadeusJson(Map<String, dynamic> json) {
    final itinerary = json['itineraries']?[0];
    final segments = itinerary?['segments'] as List?;
    final firstSegment = segments?.first;
    final lastSegment = segments?.last;
    final price = json['price'];

    return FlightOffer(
      id: json['id'] ?? '',
      price: price?['total'] ?? price?['grandTotal'] ?? '0',
      currency: price?['currency'] ?? 'EUR',
      departureTime: firstSegment?['departure']?['at'] ?? '',
      arrivalTime: lastSegment?['arrival']?['at'] ?? '',
      airline: firstSegment?['carrierCode'] ?? '',
      stops: (segments?.length ?? 1) - 1,
      duration: itinerary?['duration'] ?? '',
      isDirectFlight: (segments?.length ?? 0) == 1,
      origin: firstSegment?['departure']?['iataCode'] ?? '',
      destination: lastSegment?['arrival']?['iataCode'] ?? '',
    );
  }

  /// Format price for display
  String get priceDisplay => '$price $currency';

  /// Format duration for display (PT2H30M -> 2h30)
  String get durationDisplay {
    final match = RegExp(r'PT(\d+)H(\d+)M?').firstMatch(duration);
    if (match != null) {
      final hours = match.group(1);
      final minutes = match.group(2);
      return '${hours}h${minutes}m';
    }
    return duration.replaceAll('PT', '').toLowerCase();
  }

  /// Format departure time for display
  String get departureDisplay {
    try {
      final dt = DateTime.parse(departureTime);
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return departureTime;
    }
  }

  /// Format arrival time for display
  String get arrivalDisplay {
    try {
      final dt = DateTime.parse(arrivalTime);
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return arrivalTime;
    }
  }

  /// Stops display
  String get stopsDisplay {
    if (stops == 0) return 'Direct';
    return '$stops escale${stops > 1 ? 's' : ''}';
  }
}
