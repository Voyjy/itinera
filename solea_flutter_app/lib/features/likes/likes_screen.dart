import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/models/trip_idea.dart';
import '../../data/local/trip_idea_store.dart';
import '../../widgets/common_widgets.dart';

/// Screen showing all liked TripIdeas
class LikesScreen extends StatefulWidget {
  const LikesScreen({super.key});

  @override
  State<LikesScreen> createState() => _LikesScreenState();
}

class _LikesScreenState extends State<LikesScreen> {
  List<TripIdea> _likedIdeas = [];

  @override
  void initState() {
    super.initState();
    _loadLikes();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadLikes();
  }

  void _loadLikes() {
    setState(() {
      _likedIdeas = TripIdeaLikesStore.getLikedIdeas();
    });
  }

  void _removeLike(TripIdea idea) async {
    await TripIdeaLikesStore.removeLike(idea.id);
    _loadLikes();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${idea.activityTitle} retiré des favoris'),
          action: SnackBarAction(
            label: 'Annuler',
            onPressed: () async {
              await TripIdeaLikesStore.addLike(idea);
              _loadLikes();
            },
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Mes favoris', style: AppTypography.headlineLarge),
                    SizedBox(height: 4),
                    Text(
                      '${_likedIdeas.length} activité${_likedIdeas.length > 1 ? 's' : ''} sauvegardée${_likedIdeas.length > 1 ? 's' : ''}',
                      style: AppTypography.bodyMedium,
                    ),
                  ],
                ),
              ).animate().fadeIn().slideY(begin: -0.2),

              // Content
              Expanded(
                child: _likedIdeas.isEmpty
                    ? _buildEmptyState()
                    : _buildLikesList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.favorite_border,
              size: 80,
              color: AppColors.textMuted,
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                begin: Offset(1, 1),
                end: Offset(1.1, 1.1),
                duration: 1.seconds),
            SizedBox(height: 24),
            Text(
              'Pas encore de favoris',
              style: AppTypography.headlineSmall,
            ),
            SizedBox(height: 8),
            Text(
              'Swipez vers la droite sur les activités qui vous plaisent !',
              textAlign: TextAlign.center,
              style: AppTypography.bodyLarge,
            ),
            SizedBox(height: 32),
            GradientButton(
              label: 'Explorer',
              icon: Icons.explore,
              onTap: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLikesList() {
    return ListView.builder(
      padding: EdgeInsets.symmetric(horizontal: 20),
      itemCount: _likedIdeas.length,
      itemBuilder: (context, index) {
        final idea = _likedIdeas[index];
        return _LikedIdeaTile(
          idea: idea,
          onTap: () => context.push('/trip-vibe', extra: idea),
          onRemove: () => _removeLike(idea),
        ).animate(delay: (50 * index).ms).fadeIn().slideX(begin: 0.1);
      },
    );
  }
}

class _LikedIdeaTile extends StatelessWidget {
  final TripIdea idea;
  final VoidCallback onTap;
  final VoidCallback onRemove;

  const _LikedIdeaTile({
    required this.idea,
    required this.onTap,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 120,
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: Row(
            children: [
              // Image
              ClipRRect(
                borderRadius:
                    BorderRadius.horizontal(left: Radius.circular(20)),
                child: SizedBox(
                  width: 120,
                  height: 120,
                  child: CachedNetworkImage(
                    imageUrl: idea.imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppColors.surfaceLight,
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: AppColors.surfaceLight,
                      child: Icon(Icons.image, color: AppColors.textMuted),
                    ),
                  ),
                ),
              ),

              // Content
              Expanded(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        idea.activityTitle,
                        style: AppTypography.titleMedium,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(height: 4),
                      Text(
                        idea.displaySubtitle,
                        style: AppTypography.bodySmall,
                        maxLines: 1,
                      ),
                      SizedBox(height: 8),
                      // Duration + Intensity
                      Row(
                        children: [
                          Icon(Icons.schedule,
                              size: 12, color: AppColors.textMuted),
                          SizedBox(width: 4),
                          Text(idea.duration, style: AppTypography.bodySmall),
                          SizedBox(width: 12),
                          // Tags
                          ...idea.tags
                              .take(2)
                              .map((tag) => Container(
                                    margin: EdgeInsets.only(right: 4),
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppColors.chipBackground,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      tag,
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ))
                              .toList(),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Remove button
              Padding(
                padding: EdgeInsets.only(right: 12),
                child: IconButton(
                  icon: Icon(Icons.close, color: AppColors.textMuted),
                  onPressed: onRemove,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
