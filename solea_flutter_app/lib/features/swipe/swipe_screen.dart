import 'package:flutter/material.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../core/constants.dart';
import '../../data/models/trip_idea.dart';
import '../../data/repositories/trip_idea_repository.dart';
import '../../data/local/trip_idea_store.dart';
import '../../widgets/common_widgets.dart';
import 'package:go_router/go_router.dart';

/// Main swipe screen with Tinder-like TripIdea card deck
class SwipeScreen extends StatefulWidget {
  const SwipeScreen({super.key});

  @override
  State<SwipeScreen> createState() => _SwipeScreenState();
}

class _SwipeScreenState extends State<SwipeScreen>
    with TickerProviderStateMixin {
  final TripIdeaRepository _repo = TripIdeaRepository();
  final CardSwiperController _swiperController = CardSwiperController();

  List<TripIdea> _deck = [];
  bool _isLoading = true;
  String? _error;

  // Stamp animations
  bool _showLikeStamp = false;
  bool _showNopeStamp = false;

  @override
  void initState() {
    super.initState();
    _loadDeck();
  }

  @override
  void dispose() {
    _swiperController.dispose();
    super.dispose();
  }

  Future<void> _loadDeck() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final deck = await _repo.buildDeck(size: 15);
      setState(() {
        _deck = deck;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error =
            'Impossible de charger les destinations.\nVérifiez votre connexion.';
        _isLoading = false;
      });
    }
  }

  bool _onSwipe(
      int previousIndex, int? currentIndex, CardSwiperDirection direction) {
    if (previousIndex >= _deck.length) return false;

    final idea = _deck[previousIndex];

    if (direction == CardSwiperDirection.right) {
      // Like - save and navigate to TripVibeScreen
      _showLikeAnimation();
      TripIdeaLikesStore.addLike(idea);
      TripIdeaLikesStore.markAsShown(idea.id);

      // Navigate to TripVibeScreen after animation
      Future.delayed(Duration(milliseconds: 400), () {
        if (mounted) {
          context.push('/trip-vibe', extra: idea);
        }
      });
    } else if (direction == CardSwiperDirection.left) {
      // Dislike - reduce similar ideas
      _showNopeAnimation();
      TripIdeaLikesStore.addDislike(idea.id, idea.tags);
      TripIdeaLikesStore.markAsShown(idea.id);
    } else if (direction == CardSwiperDirection.top) {
      // Super like (treated as like)
      _showLikeAnimation();
      TripIdeaLikesStore.addLike(idea);
      TripIdeaLikesStore.markAsShown(idea.id);

      Future.delayed(Duration(milliseconds: 400), () {
        if (mounted) {
          context.push('/trip-vibe', extra: idea);
        }
      });
    }

    // Refill deck if running low
    if (_deck.length - (currentIndex ?? 0) < 5) {
      _refillDeck();
    }
    return true;
  }

  void _showLikeAnimation() {
    setState(() => _showLikeStamp = true);
    Future.delayed(Duration(milliseconds: 500), () {
      if (mounted) setState(() => _showLikeStamp = false);
    });
  }

  void _showNopeAnimation() {
    setState(() => _showNopeStamp = true);
    Future.delayed(Duration(milliseconds: 500), () {
      if (mounted) setState(() => _showNopeStamp = false);
    });
  }

  Future<void> _refillDeck() async {
    try {
      final moreIdeas = await _repo.buildDeck(size: 10);
      setState(() {
        _deck.addAll(moreIdeas);
      });
    } catch (e) {
      print('Error refilling deck: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(),

              // Demo mode banner
              if (AppConstants.isDemoMode)
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  color: AppColors.accent.withOpacity(0.2),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.wifi_off, size: 16, color: AppColors.accent),
                      SizedBox(width: 8),
                      Text(
                        'Mode démo',
                        style: AppTypography.labelMedium
                            .copyWith(color: AppColors.accent),
                      ),
                    ],
                  ),
                ).animate().fadeIn(),

              // Main content
              Expanded(
                child: _buildContent(),
              ),

              // Action buttons
              if (!_isLoading && _error == null && _deck.isNotEmpty)
                _buildActionButtons(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Explorer', style: AppTypography.headlineLarge),
              Text(
                'Swipez pour découvrir',
                style: AppTypography.bodyMedium,
              ),
            ],
          ),
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.filter_list, color: AppColors.textSecondary),
          ),
        ],
      ),
    ).animate().fadeIn().slideY(begin: -0.2);
  }

  Widget _buildContent() {
    if (_isLoading) {
      return _buildLoadingState();
    }

    if (_error != null) {
      return _buildErrorState();
    }

    if (_deck.isEmpty) {
      return _buildEmptyState();
    }

    return Stack(
      alignment: Alignment.center,
      children: [
        // Card swiper
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: CardSwiper(
            controller: _swiperController,
            cardsCount: _deck.length,
            numberOfCardsDisplayed: 3,
            backCardOffset: Offset(0, 30),
            padding: EdgeInsets.zero,
            onSwipe: _onSwipe,
            onUndo: (previousIndex, currentIndex, direction) => true,
            cardBuilder:
                (context, index, horizontalThreshold, verticalThreshold) {
              if (index >= _deck.length) return Container();
              return _TripIdeaCardWidget(
                idea: _deck[index],
                horizontalDrag: horizontalThreshold.toDouble(),
                onTap: () => context.push('/trip-vibe', extra: _deck[index]),
              );
            },
          ),
        ),

        // Like stamp overlay
        if (_showLikeStamp)
          _StampOverlay(
            text: 'LIKE',
            color: AppColors.like,
            rotation: -0.3,
          ).animate().scale(begin: Offset(0.5, 0.5)).fadeIn(duration: 200.ms),

        // Nope stamp overlay
        if (_showNopeStamp)
          _StampOverlay(
            text: 'NOPE',
            color: AppColors.dislike,
            rotation: 0.3,
          ).animate().scale(begin: Offset(0.5, 0.5)).fadeIn(duration: 200.ms),
      ],
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.flight,
            size: 64,
            color: AppColors.primaryStart,
          )
              .animate(onPlay: (c) => c.repeat())
              .rotate(duration: 2.seconds, begin: -0.1, end: 0.1),
          SizedBox(height: 24),
          Text(
            'Préparation de vos destinations...',
            style: AppTypography.bodyLarge,
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.wifi_off,
              size: 64,
              color: AppColors.error,
            ),
            SizedBox(height: 24),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: AppTypography.bodyLarge,
            ),
            SizedBox(height: 24),
            GradientButton(
              label: 'Réessayer',
              icon: Icons.refresh,
              onTap: _loadDeck,
            ),
          ],
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
              Icons.check_circle_outline,
              size: 80,
              color: AppColors.success,
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                begin: Offset(1, 1),
                end: Offset(1.1, 1.1),
                duration: 1.seconds),
            SizedBox(height: 24),
            Text(
              'Vous avez tout vu !',
              style: AppTypography.headlineMedium,
            ),
            SizedBox(height: 8),
            Text(
              'Revenez plus tard pour de nouvelles destinations',
              textAlign: TextAlign.center,
              style: AppTypography.bodyLarge,
            ),
            SizedBox(height: 32),
            GradientButton(
              label: 'Actualiser',
              icon: Icons.refresh,
              onTap: _loadDeck,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons() {
    return Padding(
      padding: EdgeInsets.only(bottom: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Dislike button
          _ActionButton(
            icon: Icons.close,
            color: AppColors.dislike,
            size: 56,
            onTap: () => _swiperController.swipe(CardSwiperDirection.left),
          ),
          SizedBox(width: 24),
          // Super like button
          _ActionButton(
            icon: Icons.star,
            color: AppColors.superLike,
            size: 48,
            onTap: () => _swiperController.swipe(CardSwiperDirection.top),
          ),
          SizedBox(width: 24),
          // Like button
          _ActionButton(
            icon: Icons.favorite,
            color: AppColors.like,
            size: 56,
            onTap: () => _swiperController.swipe(CardSwiperDirection.right),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3);
  }
}

/// Individual TripIdea card widget
class _TripIdeaCardWidget extends StatelessWidget {
  final TripIdea idea;
  final double horizontalDrag;
  final VoidCallback onTap;

  const _TripIdeaCardWidget({
    required this.idea,
    required this.horizontalDrag,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate stamp opacity based on drag
    final likeOpacity = (horizontalDrag / 100).clamp(0.0, 1.0);
    final nopeOpacity = (-horizontalDrag / 100).clamp(0.0, 1.0);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Background image with parallax effect
              Transform.scale(
                scale: 1.1,
                child: Transform.translate(
                  offset: Offset(horizontalDrag * 0.05, 0),
                  child: CachedNetworkImage(
                    imageUrl: idea.imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppColors.surface,
                      child: Center(
                        child: CircularProgressIndicator(
                          color: AppColors.primaryStart,
                        ),
                      ),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: AppColors.surface,
                      child: Icon(
                        Icons.image_not_supported,
                        color: AppColors.textMuted,
                        size: 48,
                      ),
                    ),
                  ),
                ),
              ),

              // Gradient overlay
              Container(
                decoration: BoxDecoration(
                  gradient: AppColors.cardOverlay,
                ),
              ),

              // Like indicator
              Positioned(
                top: 40,
                left: 24,
                child: Opacity(
                  opacity: likeOpacity,
                  child: Transform.rotate(
                    angle: -0.3,
                    child: Container(
                      padding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.like, width: 4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'LIKE',
                        style: AppTypography.stampText
                            .copyWith(color: AppColors.like),
                      ),
                    ),
                  ),
                ),
              ),

              // Nope indicator
              Positioned(
                top: 40,
                right: 24,
                child: Opacity(
                  opacity: nopeOpacity,
                  child: Transform.rotate(
                    angle: 0.3,
                    child: Container(
                      padding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.dislike, width: 4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'NOPE',
                        style: AppTypography.stampText
                            .copyWith(color: AppColors.dislike),
                      ),
                    ),
                  ),
                ),
              ),

              // Content
              Positioned(
                left: 20,
                right: 20,
                bottom: 24,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Tags
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: idea.tags.take(3).map((tag) {
                        return TagChip(label: tag);
                      }).toList(),
                    ),
                    SizedBox(height: 12),

                    // Activity Title
                    Text(
                      idea.activityTitle,
                      style: AppTypography.displayMedium,
                    ),
                    SizedBox(height: 4),

                    // City & Location
                    Text(
                      idea.displaySubtitle,
                      style: AppTypography.bodyLarge.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    SizedBox(height: 12),

                    // Why this trip?
                    GlassContainer(
                      padding: EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.lightbulb_outline,
                                  color: AppColors.accentLight, size: 16),
                              SizedBox(width: 8),
                              Text(
                                'Pourquoi ce voyage ?',
                                style: AppTypography.labelMedium.copyWith(
                                  color: AppColors.accentLight,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 6),
                          Text(
                            idea.whyThis,
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    // Duration & Intensity
                    SizedBox(height: 12),
                    Row(
                      children: [
                        Icon(Icons.schedule,
                            color: AppColors.textMuted, size: 14),
                        SizedBox(width: 4),
                        Text(
                          idea.duration,
                          style: AppTypography.bodySmall,
                        ),
                        SizedBox(width: 16),
                        Icon(
                          idea.intensity == 'calm'
                              ? Icons.spa
                              : idea.intensity == 'active'
                                  ? Icons.directions_run
                                  : Icons.self_improvement,
                          color: AppColors.textMuted,
                          size: 14,
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
        ),
      ),
    );
  }
}

/// Action button (like/dislike/super)
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final Color color;
  final double size;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.color,
    required this.size,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: AppColors.surface,
          shape: BoxShape.circle,
          border: Border.all(color: color.withOpacity(0.3), width: 2),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.2),
              blurRadius: 12,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Icon(icon, color: color, size: size * 0.5),
      ),
    );
  }
}

/// Stamp overlay for swipe feedback
class _StampOverlay extends StatelessWidget {
  final String text;
  final Color color;
  final double rotation;

  const _StampOverlay({
    required this.text,
    required this.color,
    required this.rotation,
  });

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Transform.rotate(
        angle: rotation,
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          decoration: BoxDecoration(
            border: Border.all(color: color, width: 6),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            text,
            style: AppTypography.stampText.copyWith(
              color: color,
              fontSize: 48,
            ),
          ),
        ),
      ),
    );
  }
}
