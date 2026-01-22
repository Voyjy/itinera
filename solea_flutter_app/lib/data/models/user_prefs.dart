import 'dart:convert';

/// User onboarding preferences (travel style)
class UserPrefs {
  final String travelType;   // family, couple, solo, kids, senior
  final String priority;     // comfort, relax, culture, food, nature
  final String pace;         // calm, balanced, light-walking

  UserPrefs({
    this.travelType = 'solo',
    this.priority = 'relax',
    this.pace = 'balanced',
  });

  factory UserPrefs.fromJson(Map<String, dynamic> json) {
    return UserPrefs(
      travelType: json['travelType'] ?? 'solo',
      priority: json['priority'] ?? 'relax',
      pace: json['pace'] ?? 'balanced',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'travelType': travelType,
      'priority': priority,
      'pace': pace,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  factory UserPrefs.fromJsonString(String jsonString) {
    return UserPrefs.fromJson(jsonDecode(jsonString));
  }

  /// Get relevant tags based on user preferences
  List<String> get preferredTags {
    final tags = <String>[];
    
    // Add tags based on travel type
    switch (travelType) {
      case 'family':
      case 'kids':
        tags.addAll(['family', 'relax', 'beach']);
        break;
      case 'couple':
        tags.addAll(['romantic', 'culture', 'food']);
        break;
      case 'senior':
        tags.addAll(['history', 'culture', 'relax']);
        break;
      default:
        tags.addAll(['adventure', 'culture']);
    }

    // Add tag based on priority
    if (priority.isNotEmpty && !tags.contains(priority)) {
      tags.add(priority);
    }

    // Adjust based on pace
    if (pace == 'calm') {
      tags.add('relax');
    } else if (pace == 'light-walking') {
      tags.addAll(['city', 'adventure']);
    }

    return tags.toSet().toList(); // Remove duplicates
  }

  @override
  String toString() => 'UserPrefs($travelType, $priority, $pace)';
}
