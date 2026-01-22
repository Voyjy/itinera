import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/models/hotel.dart';
import '../../data/models/trip_card.dart';
import '../../data/repositories/hotels_repository.dart';
import '../../widgets/common_widgets.dart';

/// Hotels listing screen for a specific city
class HotelsScreen extends StatefulWidget {
  final TripCard? tripCard;

  const HotelsScreen({super.key, this.tripCard});

  @override
  State<HotelsScreen> createState() => _HotelsScreenState();
}

class _HotelsScreenState extends State<HotelsScreen> {
  final HotelsRepository _repo = HotelsRepository();
  
  List<Hotel> _hotels = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadHotels();
  }

  Future<void> _loadHotels() async {
    if (widget.tripCard == null) {
      setState(() {
        _error = 'Destination non spécifiée';
        _isLoading = false;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final hotels = await _repo.fetchHotelsByCity(widget.tripCard!.cityId);
      setState(() {
        _hotels = hotels;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Impossible de charger les hôtels';
        _isLoading = false;
      });
    }
  }

  Future<void> _openBooking(Hotel hotel) async {
    final url = _repo.getBookingUrl(
      hotel,
      widget.tripCard!.title,
    );
    
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Impossible d\'ouvrir le lien')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // App bar
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back),
                      onPressed: () => context.pop(),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hôtels',
                            style: AppTypography.headlineSmall,
                          ),
                          if (widget.tripCard != null)
                            Text(
                              widget.tripCard!.title,
                              style: AppTypography.bodySmall,
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn().slideY(begin: -0.2),

              // Content
              Expanded(
                child: _buildContent(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppColors.primaryStart),
            SizedBox(height: 16),
            Text('Recherche des hôtels...', style: AppTypography.bodyLarge),
          ],
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: AppColors.error),
              SizedBox(height: 16),
              Text(_error!, style: AppTypography.bodyLarge, textAlign: TextAlign.center),
              SizedBox(height: 24),
              GradientButton(
                label: 'Réessayer',
                icon: Icons.refresh,
                onTap: _loadHotels,
              ),
            ],
          ),
        ),
      );
    }

    if (_hotels.isEmpty) {
      return _buildEmptyState();
    }

    return _buildHotelsList();
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.hotel_outlined, size: 80, color: AppColors.textMuted),
            SizedBox(height: 24),
            Text(
              'Aucun hôtel trouvé',
              style: AppTypography.headlineSmall,
            ),
            SizedBox(height: 8),
            Text(
              'Nous n\'avons pas d\'hôtels référencés pour cette destination.',
              textAlign: TextAlign.center,
              style: AppTypography.bodyLarge,
            ),
            SizedBox(height: 24),
            GradientButton(
              label: 'Chercher sur Booking',
              icon: Icons.open_in_new,
              onTap: () async {
                final url = 'https://www.booking.com/searchresults.html?ss=${Uri.encodeComponent(widget.tripCard!.title)}';
                final uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHotelsList() {
    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _hotels.length,
      itemBuilder: (context, index) {
        final hotel = _hotels[index];
        return _HotelCard(
          hotel: hotel,
          onTap: () => _openBooking(hotel),
        ).animate(delay: (50 * index).ms)
            .fadeIn()
            .slideX(begin: 0.1);
      },
    );
  }
}

class _HotelCard extends StatelessWidget {
  final Hotel hotel;
  final VoidCallback onTap;

  const _HotelCard({
    required this.hotel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            if (hotel.image.isNotEmpty)
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                child: SizedBox(
                  height: 140,
                  width: double.infinity,
                  child: CachedNetworkImage(
                    imageUrl: hotel.image.startsWith('http')
                        ? hotel.image
                        : '${AppConstants.baseUrl}/${hotel.image}',
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppColors.surfaceLight,
                      child: Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: AppColors.surfaceLight,
                      child: Icon(Icons.hotel, size: 48, color: AppColors.textMuted),
                    ),
                  ),
                ),
              ),

            // Content
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name and stars
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          hotel.name,
                          style: AppTypography.titleLarge,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      SizedBox(width: 8),
                      _StarRating(stars: hotel.stars),
                    ],
                  ),
                  SizedBox(height: 8),

                  // Address
                  if (hotel.address.isNotEmpty)
                    Row(
                      children: [
                        Icon(Icons.place, size: 14, color: AppColors.textMuted),
                        SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            hotel.address,
                            style: AppTypography.bodySmall,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  SizedBox(height: 12),

                  // Amenities
                  if (hotel.amenities.isNotEmpty)
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: hotel.amenities.take(4).map((amenity) {
                        return Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.chipBackground,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            amenity,
                            style: TextStyle(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  SizedBox(height: 12),

                  // Price and book button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            hotel.priceDisplay,
                            style: AppTypography.headlineSmall.copyWith(
                              color: AppColors.accentLight,
                            ),
                          ),
                          Text('par nuit', style: AppTypography.bodySmall),
                        ],
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Réserver',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(Icons.open_in_new, size: 14, color: Colors.white),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StarRating extends StatelessWidget {
  final int stars;

  const _StarRating({required this.stars});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < stars ? Icons.star : Icons.star_border,
          size: 16,
          color: index < stars ? AppColors.accentLight : AppColors.textMuted,
        );
      }),
    );
  }
}
