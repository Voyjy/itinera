import 'dart:convert';

/// Flight search parameters for persistence
class FlightSearch {
  final String origin;
  final String destination;
  final String departDate;
  final String? returnDate;
  final int passengers;
  final String cabin; // economy, premium, business

  FlightSearch({
    required this.origin,
    required this.destination,
    required this.departDate,
    this.returnDate,
    this.passengers = 1,
    this.cabin = 'economy',
  });

  factory FlightSearch.fromJson(Map<String, dynamic> json) {
    return FlightSearch(
      origin: json['origin'] ?? '',
      destination: json['destination'] ?? '',
      departDate: json['departDate'] ?? '',
      returnDate: json['returnDate'],
      passengers: json['passengers'] ?? 1,
      cabin: json['cabin'] ?? 'economy',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'origin': origin,
      'destination': destination,
      'departDate': departDate,
      'returnDate': returnDate,
      'passengers': passengers,
      'cabin': cabin,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  factory FlightSearch.fromJsonString(String jsonString) {
    return FlightSearch.fromJson(jsonDecode(jsonString));
  }

  bool get isRoundTrip => returnDate != null && returnDate!.isNotEmpty;
}
