/// City model matching backend schema
class City {
  final String id;
  final String name;
  final String country;
  final String continent;
  final List<String> tags;
  final List<String> popularSpots;
  final String image;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  City({
    required this.id,
    required this.name,
    required this.country,
    required this.continent,
    this.tags = const [],
    this.popularSpots = const [],
    this.image = '',
    this.createdAt,
    this.updatedAt,
  });

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      country: json['country'] ?? '',
      continent: json['continent'] ?? '',
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      popularSpots: (json['popularSpots'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      image: json['image'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.tryParse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'country': country,
      'continent': continent,
      'tags': tags,
      'popularSpots': popularSpots,
      'image': image,
    };
  }

  @override
  String toString() => 'City($name, $country)';
}
