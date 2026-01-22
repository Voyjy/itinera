/// Hotel model matching backend schema
class Hotel {
  final String id;
  final String name;
  final String cityId;
  final String address;
  final double pricePerNight;
  final int stars;
  final List<String> amenities;
  final String image;

  Hotel({
    required this.id,
    required this.name,
    required this.cityId,
    this.address = '',
    this.pricePerNight = 0,
    this.stars = 3,
    this.amenities = const [],
    this.image = '',
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      cityId: json['city']?.toString() ?? '',
      address: json['address'] ?? '',
      pricePerNight: (json['pricePerNight'] ?? 0).toDouble(),
      stars: json['stars'] ?? 3,
      amenities: (json['amenities'] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList() ?? [],
      image: json['image'] ?? '',
    );
  }

  /// Get star rating as icons string
  String get starsDisplay => '★' * stars + '☆' * (5 - stars);

  /// Format price for display
  String get priceDisplay => '${pricePerNight.toStringAsFixed(0)}€/nuit';

  @override
  String toString() => 'Hotel($name, $stars★)';
}
