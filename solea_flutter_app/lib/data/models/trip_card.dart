import 'dart:convert';
import 'city.dart';

/// Enhanced model for swipe trip cards
class TripCard {
  final String cityId;
  final String title;       // City name
  final String subtitle;    // "Country, Continent"
  final String imageUrl;    // Full URL to image
  final List<String> tags;
  final List<String> topSpots;  // Top 3 popular spots
  final String whyThis;     // Generated explanation based on preferences

  TripCard({
    required this.cityId,
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    this.tags = const [],
    this.topSpots = const [],
    this.whyThis = '',
  });

  /// Create from City model
  factory TripCard.fromCity(City city, String baseUrl, {String? whyThisExplanation}) {
    String imageUrl = city.image;
    if (!imageUrl.startsWith('http')) {
      imageUrl = '$baseUrl/${city.image}';
    }
    
    return TripCard(
      cityId: city.id,
      title: city.name,
      subtitle: '${city.country}, ${city.continent}',
      imageUrl: imageUrl,
      tags: city.tags,
      topSpots: city.popularSpots.take(3).toList(),
      whyThis: whyThisExplanation ?? _generateWhyThis(city),
    );
  }

  /// Generate "Why this trip?" explanation based on city tags
  static String _generateWhyThis(City city) {
    final tagExplanations = {
      'nature': 'des paysages naturels époustouflants',
      'culture': 'une richesse culturelle unique',
      'food': 'une gastronomie exceptionnelle',
      'relax': 'une atmosphère relaxante',
      'adventure': 'des aventures inoubliables',
      'history': 'un patrimoine historique fascinant',
      'beach': 'des plages paradisiaques',
      'mountain': 'des montagnes majestueuses',
      'city': 'une vie urbaine vibrante',
      'romantic': 'une ambiance romantique parfaite',
    };

    final explanations = city.tags
        .where((tag) => tagExplanations.containsKey(tag.toLowerCase()))
        .map((tag) => tagExplanations[tag.toLowerCase()]!)
        .take(2)
        .toList();

    if (explanations.isEmpty) {
      return 'Découvrez ${city.name}, une destination unique qui vous attend !';
    }
    
    return 'Pourquoi ${city.name} ? Pour ${explanations.join(' et ')}.';
  }

  factory TripCard.fromJson(Map<String, dynamic> json) {
    return TripCard(
      cityId: json['cityId'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      topSpots: (json['topSpots'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      whyThis: json['whyThis'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'cityId': cityId,
      'title': title,
      'subtitle': subtitle,
      'imageUrl': imageUrl,
      'tags': tags,
      'topSpots': topSpots,
      'whyThis': whyThis,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  factory TripCard.fromJsonString(String jsonString) {
    return TripCard.fromJson(jsonDecode(jsonString));
  }

  @override
  String toString() => 'TripCard($title)';
}
