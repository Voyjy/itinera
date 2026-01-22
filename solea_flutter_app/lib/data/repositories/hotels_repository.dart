import '../models/hotel.dart';
import '../remote/api_client.dart';
import '../../core/constants.dart';

/// Repository for fetching hotel data
class HotelsRepository {
  final ApiClient _api = ApiClient();
  
  /// Fetch hotels for a specific city
  Future<List<Hotel>> fetchHotelsByCity(String cityId) async {
    try {
      final response = await _api.get('/api/hotels/city/$cityId');
      
      if (response.data is List) {
        return (response.data as List)
            .map((json) => Hotel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      
      return [];
    } catch (e) {
      print('Error fetching hotels for city $cityId: $e');
      return [];
    }
  }

  /// Fetch all hotels
  Future<List<Hotel>> fetchAllHotels() async {
    try {
      final response = await _api.get('/api/hotels');
      
      if (response.data is List) {
        return (response.data as List)
            .map((json) => Hotel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      
      return [];
    } catch (e) {
      print('Error fetching all hotels: $e');
      return [];
    }
  }

  /// Fetch hotel details by ID
  Future<Hotel?> fetchHotelById(String hotelId) async {
    try {
      final response = await _api.get('/api/hotels/$hotelId');
      return Hotel.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      print('Error fetching hotel $hotelId: $e');
      return null;
    }
  }

  /// Build a booking URL for a hotel (redirect to Booking.com search)
  String getBookingUrl(Hotel hotel, String cityName, {DateTime? checkIn, DateTime? checkOut}) {
    final encodedCity = Uri.encodeComponent(cityName);
    final encodedHotel = Uri.encodeComponent(hotel.name);
    
    // Format dates if provided
    String dateParams = '';
    if (checkIn != null) {
      dateParams += '&checkin=${_formatDate(checkIn)}';
    }
    if (checkOut != null) {
      dateParams += '&checkout=${_formatDate(checkOut)}';
    }
    
    return 'https://www.booking.com/searchresults.html?ss=$encodedCity+$encodedHotel$dateParams';
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}
