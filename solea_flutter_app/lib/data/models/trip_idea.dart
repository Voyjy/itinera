import 'dart:convert';

/// Model for trip ideas - activities/places within cities
class TripIdea {
  final String id;
  final String cityId;
  final String cityName;
  final String country;
  final String continent;
  final String activityTitle;
  final String shortDescription;
  final String whyThis;
  final List<String> tags;
  final String duration;
  final String intensity; // calm, balanced, active
  final String imageUrl;
  final String? cityImageUrl;

  TripIdea({
    required this.id,
    required this.cityId,
    required this.cityName,
    required this.country,
    required this.continent,
    required this.activityTitle,
    required this.shortDescription,
    required this.whyThis,
    required this.tags,
    required this.duration,
    required this.intensity,
    required this.imageUrl,
    this.cityImageUrl,
  });

  /// Display title for the card
  String get displayTitle => activityTitle;

  /// Subtitle showing location
  String get displaySubtitle => '$cityName, $country';

  factory TripIdea.fromJson(Map<String, dynamic> json) {
    return TripIdea(
      id: json['id'] ?? '',
      cityId: json['cityId'] ?? '',
      cityName: json['cityName'] ?? '',
      country: json['country'] ?? '',
      continent: json['continent'] ?? '',
      activityTitle: json['activityTitle'] ?? '',
      shortDescription: json['shortDescription'] ?? '',
      whyThis: json['whyThis'] ?? '',
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ??
              [],
      duration: json['duration'] ?? '',
      intensity: json['intensity'] ?? 'balanced',
      imageUrl: json['imageUrl'] ?? '',
      cityImageUrl: json['cityImageUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'cityId': cityId,
      'cityName': cityName,
      'country': country,
      'continent': continent,
      'activityTitle': activityTitle,
      'shortDescription': shortDescription,
      'whyThis': whyThis,
      'tags': tags,
      'duration': duration,
      'intensity': intensity,
      'imageUrl': imageUrl,
      'cityImageUrl': cityImageUrl,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  factory TripIdea.fromJsonString(String jsonString) {
    return TripIdea.fromJson(jsonDecode(jsonString));
  }

  @override
  String toString() => 'TripIdea($activityTitle in $cityName)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TripIdea && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
