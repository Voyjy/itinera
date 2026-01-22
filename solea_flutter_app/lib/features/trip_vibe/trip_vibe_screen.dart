import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../core/constants.dart';
import '../../data/models/trip_idea.dart';
import '../../data/repositories/trip_idea_repository.dart';
import '../../widgets/common_widgets.dart';

/// Screen shown after user swipes RIGHT on a TripIdea
class TripVibeScreen extends StatefulWidget {
  final TripIdea likedIdea;

  const TripVibeScreen({super.key, required this.likedIdea});

  @override
  State<TripVibeScreen> createState() => _TripVibeScreenState();
}

class _TripVibeScreenState extends State<TripVibeScreen> {
  final TripIdeaRepository _repo = TripIdeaRepository();
  List<TripIdea> _suggestions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSuggestions();
  }

  Future<void> _loadSuggestions() async {
    final similar = _repo.getSimilarIdeas(widget.likedIdea, limit: 5);
    setState(() {
      _suggestions = similar;
      _isLoading = false;
    });
  }

  void _openFlights() async {
    final now = DateTime.now();
    final departDate = now.add(Duration(days: 30));
    final dateStr =
        '${departDate.year}-${departDate.month.toString().padLeft(2, '0')}-${departDate.day.toString().padLeft(2, '0')}';

    final url = AppConstants.googleFlightsUrl(
      origin: 'PAR', // Default Paris
      destination: widget.likedIdea.cityName,
      departDate: dateStr,
    );

    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _openHotels() async {
    final url =
        'https://www.booking.com/searchresults.html?ss=${Uri.encodeComponent(widget.likedIdea.cityName)}';
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: CustomScrollView(
          slivers: [
            // Hero image with title
            SliverAppBar(
              expandedHeight: 300,
              pinned: true,
              backgroundColor: AppColors.surface,
              leading: IconButton(
                icon: Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.surface.withOpacity(0.8),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.arrow_back, color: AppColors.textPrimary),
                ),
                onPressed: () => context.pop(),
              ),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Background image
                    CachedNetworkImage(
                      imageUrl: widget.likedIdea.cityImageUrl ??
                          widget.likedIdea.imageUrl,
                      fit: BoxFit.cover,
                      placeholder: (context, url) =>
                          Container(color: AppColors.surface),
                      errorWidget: (context, url, error) => Container(
                        color: AppColors.surface,
                        child: Icon(Icons.image,
                            color: AppColors.textMuted, size: 48),
                      ),
                    ),
                    // Gradient overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            AppColors.background.withOpacity(0.8),
                            AppColors.background,
                          ],
                          stops: [0.3, 0.7, 1.0],
                        ),
                      ),
                    ),
                    // Content
                    Positioned(
                      left: 20,
                      right: 20,
                      bottom: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Votre vibe voyage',
                            style: AppTypography.labelMedium.copyWith(
                              color: AppColors.accentLight,
                            ),
                          ).animate().fadeIn().slideX(begin: -0.1),
                          SizedBox(height: 4),
                          Text(
                            widget.likedIdea.cityName,
                            style: AppTypography.displayLarge,
                          ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),
                          SizedBox(height: 4),
                          Text(
                            widget.likedIdea.displaySubtitle,
                            style: AppTypography.bodyLarge.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ).animate().fadeIn(delay: 200.ms),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content
            SliverPadding(
              padding: EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Why you liked this
                  _buildWhySection(),
                  SizedBox(height: 24),

                  // Action buttons
                  _buildActionButtons(),
                  SizedBox(height: 32),

                  // Suggestions section
                  Text(
                    'Activités suggérées',
                    style: AppTypography.headlineMedium,
                  ).animate().fadeIn(delay: 400.ms),
                  SizedBox(height: 16),

                  // Main liked activity
                  _buildActivityCard(widget.likedIdea, isMain: true),
                  SizedBox(height: 12),

                  // Similar suggestions
                  if (_isLoading)
                    Center(
                        child: CircularProgressIndicator(
                            color: AppColors.primaryStart))
                  else
                    ..._suggestions
                        .map((idea) => Padding(
                              padding: EdgeInsets.only(bottom: 12),
                              child: _buildActivityCard(idea),
                            ))
                        .toList(),

                  SizedBox(height: 40),

                  // Plan trip button
                  GradientButton(
                    label: 'Planifier ce voyage',
                    icon: Icons.flight_takeoff,
                    onTap: () {
                      // Navigate to trip planning or show flight options
                      _showPlanTripDialog();
                    },
                  )
                      .animate()
                      .fadeIn(delay: 600.ms)
                      .scale(begin: Offset(0.9, 0.9)),

                  SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWhySection() {
    return GlassContainer(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.favorite, color: AppColors.like, size: 20),
              SizedBox(width: 8),
              Text(
                'Pourquoi vous avez aimé',
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.like,
                ),
              ),
            ],
          ),
          SizedBox(height: 12),
          Text(
            widget.likedIdea.activityTitle,
            style: AppTypography.titleLarge,
          ),
          SizedBox(height: 8),
          Text(
            widget.likedIdea.whyThis,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: widget.likedIdea.tags
                .take(4)
                .map((tag) => TagChip(label: tag))
                .toList(),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1);
  }

  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: _ActionPill(
            icon: Icons.flight,
            label: 'Vols',
            color: AppColors.primaryStart,
            onTap: _openFlights,
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: _ActionPill(
            icon: Icons.hotel,
            label: 'Hôtels',
            color: AppColors.accent,
            onTap: _openHotels,
          ),
        ),
      ],
    ).animate().fadeIn(delay: 350.ms).slideY(begin: 0.1);
  }

  Widget _buildActivityCard(TripIdea idea, {bool isMain = false}) {
    return GlassContainer(
      padding: EdgeInsets.all(12),
      child: Row(
        children: [
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl: idea.imageUrl,
              width: 80,
              height: 80,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                width: 80,
                height: 80,
                color: AppColors.surface,
              ),
              errorWidget: (context, url, error) => Container(
                width: 80,
                height: 80,
                color: AppColors.surface,
                child: Icon(Icons.image, color: AppColors.textMuted),
              ),
            ),
          ),
          SizedBox(width: 12),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (isMain)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.like.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Votre choix',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.like,
                      ),
                    ),
                  ),
                SizedBox(height: isMain ? 4 : 0),
                Text(
                  idea.activityTitle,
                  style: AppTypography.titleSmall,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.schedule, size: 14, color: AppColors.textMuted),
                    SizedBox(width: 4),
                    Text(
                      idea.duration,
                      style: AppTypography.bodySmall,
                    ),
                    SizedBox(width: 12),
                    Icon(
                      idea.intensity == 'calm'
                          ? Icons.spa
                          : idea.intensity == 'active'
                              ? Icons.directions_run
                              : Icons.self_improvement,
                      size: 14,
                      color: AppColors.textMuted,
                    ),
                    SizedBox(width: 4),
                    Text(
                      idea.intensity == 'calm'
                          ? 'Calme'
                          : idea.intensity == 'active'
                              ? 'Actif'
                              : 'Équilibré',
                      style: AppTypography.bodySmall,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: (500 + (_suggestions.indexOf(idea) * 100)).ms);
  }

  void _showPlanTripDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.textMuted,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            SizedBox(height: 24),
            Text(
              'Planifiez votre voyage à ${widget.likedIdea.cityName}',
              style: AppTypography.titleLarge,
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 24),
            ListTile(
              leading: Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primaryStart.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.flight, color: AppColors.primaryStart),
              ),
              title:
                  Text('Rechercher des vols', style: AppTypography.titleSmall),
              subtitle: Text('Comparer les prix sur Google Flights',
                  style: AppTypography.bodySmall),
              trailing: Icon(Icons.arrow_forward_ios,
                  size: 16, color: AppColors.textMuted),
              onTap: () {
                Navigator.pop(context);
                _openFlights();
              },
            ),
            ListTile(
              leading: Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.hotel, color: AppColors.accent),
              ),
              title: Text('Trouver un hôtel', style: AppTypography.titleSmall),
              subtitle: Text('Réserver sur Booking.com',
                  style: AppTypography.bodySmall),
              trailing: Icon(Icons.arrow_forward_ios,
                  size: 16, color: AppColors.textMuted),
              onTap: () {
                Navigator.pop(context);
                _openHotels();
              },
            ),
            SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _ActionPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionPill({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.15),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 20),
            SizedBox(width: 8),
            Text(
              label,
              style: AppTypography.titleSmall.copyWith(color: color),
            ),
          ],
        ),
      ),
    );
  }
}
