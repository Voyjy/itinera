import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/models/trip_card.dart';
import '../../widgets/common_widgets.dart';

/// Trip details screen showing full info and action buttons
class TripDetailsScreen extends StatelessWidget {
  final TripCard? card;

  const TripDetailsScreen({super.key, this.card});

  @override
  Widget build(BuildContext context) {
    if (card == null) {
      return Scaffold(
        body: Center(
          child: Text('Destination non trouvée'),
        ),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          // Background image
          Positioned.fill(
            child: CachedNetworkImage(
              imageUrl: card!.imageUrl,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: AppColors.surface),
              errorWidget: (context, url, error) => Container(
                color: AppColors.surface,
                child: Icon(Icons.image, size: 64, color: AppColors.textMuted),
              ),
            ),
          ),

          // Gradient overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: [0.0, 0.3, 0.7, 1.0],
                  colors: [
                    Colors.black.withOpacity(0.3),
                    Colors.transparent,
                    Colors.black.withOpacity(0.5),
                    Colors.black.withOpacity(0.9),
                  ],
                ),
              ),
            ),
          ),

          // Content
          SafeArea(
            child: Column(
              children: [
                // App bar
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _CircleButton(
                        icon: Icons.arrow_back,
                        onTap: () => context.pop(),
                      ),
                      _CircleButton(
                        icon: Icons.share,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Partage à venir...')),
                          );
                        },
                      ),
                    ],
                  ),
                ).animate().fadeIn().slideY(begin: -0.3),

                Spacer(),

                // Bottom content
                Container(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tags
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: card!.tags.map((tag) => TagChip(label: tag)).toList(),
                      ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2),
                      SizedBox(height: 16),

                      // Title
                      Text(
                        card!.title,
                        style: AppTypography.displayLarge,
                      ).animate().fadeIn(delay: 150.ms).slideY(begin: 0.2),
                      SizedBox(height: 4),

                      // Subtitle
                      Text(
                        card!.subtitle,
                        style: AppTypography.bodyLarge.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2),
                      SizedBox(height: 20),

                      // Why this trip
                      GlassContainer(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.lightbulb, color: AppColors.accentLight, size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Pourquoi ce voyage ?',
                                  style: AppTypography.labelLarge.copyWith(
                                    color: AppColors.accentLight,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Text(
                              card!.whyThis,
                              style: AppTypography.bodyMedium.copyWith(
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(delay: 250.ms).slideY(begin: 0.2),
                      SizedBox(height: 16),

                      // Popular spots
                      if (card!.topSpots.isNotEmpty) ...[
                        Text(
                          'Lieux populaires',
                          style: AppTypography.labelLarge,
                        ).animate().fadeIn(delay: 300.ms),
                        SizedBox(height: 12),
                        ...card!.topSpots.asMap().entries.map((entry) {
                          return Padding(
                            padding: EdgeInsets.only(bottom: 8),
                            child: Row(
                              children: [
                                Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    gradient: AppColors.primaryGradient,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '${entry.key + 1}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                                SizedBox(width: 12),
                                Text(
                                  entry.value,
                                  style: AppTypography.bodyMedium.copyWith(
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ).animate(delay: (350 + entry.key * 50).ms)
                              .fadeIn()
                              .slideX(begin: 0.1);
                        }).toList(),
                        SizedBox(height: 16),
                      ],

                      // Action buttons
                      Row(
                        children: [
                          Expanded(
                            child: GradientButton(
                              label: 'Trouver des vols',
                              icon: Icons.flight,
                              onTap: () => context.push('/flights', extra: card),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.3),
                      SizedBox(height: 12),
                      
                      // Secondary hotel button
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          icon: Icon(Icons.hotel, size: 20),
                          label: Text('Voir les hôtels'),
                          style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            side: BorderSide(color: AppColors.glassBorder),
                          ),
                          onPressed: () => context.push('/hotels', extra: card),
                        ),
                      ).animate().fadeIn(delay: 550.ms).slideY(begin: 0.3),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CircleButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _CircleButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: AppColors.glassBg,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: Icon(icon, color: AppColors.textPrimary, size: 20),
      ),
    );
  }
}
