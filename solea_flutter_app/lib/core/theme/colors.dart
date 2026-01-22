import 'package:flutter/material.dart';

/// Travel-themed color palette with vibrant gradients
class AppColors {
  AppColors._();

  // Primary gradient colors (sunset/travel theme)
  static const Color primaryStart = Color(0xFF667eea);
  static const Color primaryEnd = Color(0xFF764ba2);
  
  // Secondary accent (warm coral for actions)
  static const Color accent = Color(0xFFFF6B6B);
  static const Color accentLight = Color(0xFFFFE66D);
  
  // Success/Like green
  static const Color success = Color(0xFF4ECDC4);
  static const Color like = Color(0xFF00D084);
  
  // Error/Dislike
  static const Color error = Color(0xFFFF6B6B);
  static const Color dislike = Color(0xFFFF4757);
  
  // Super like
  static const Color superLike = Color(0xFF00BFFF);
  
  // Background (deep dark with purple tint)
  static const Color background = Color(0xFF0D0D1A);
  static const Color surface = Color(0xFF1A1A2E);
  static const Color surfaceLight = Color(0xFF252540);
  
  // Card overlay gradient
  static const Color cardOverlayStart = Color(0x00000000);
  static const Color cardOverlayEnd = Color(0xE6000000);
  
  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB8B8D0);
  static const Color textMuted = Color(0xFF6B6B80);
  
  // Chip/Tag colors
  static const Color chipBackground = Color(0x33667eea);
  static const Color chipBorder = Color(0x66667eea);
  
  // Glass morphism
  static const Color glassBg = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x33FFFFFF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryStart, primaryEnd],
  );

  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF0D0D1A),
      Color(0xFF1A1A2E),
      Color(0xFF16213E),
    ],
  );

  static const LinearGradient cardOverlay = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    stops: [0.4, 1.0],
    colors: [cardOverlayStart, cardOverlayEnd],
  );

  static const LinearGradient likeStampGradient = LinearGradient(
    colors: [like, Color(0xFF00F5A0)],
  );

  static const LinearGradient dislikeStampGradient = LinearGradient(
    colors: [dislike, Color(0xFFFF6348)],
  );
}
