import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/local/prefs_store.dart';
import '../../data/local/likes_store.dart';
import '../../data/local/dislikes_store.dart';
import '../../widgets/common_widgets.dart';

/// Settings screen for app configuration and data management
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  int _likedCount = 0;
  int _dislikedCount = 0;
  bool _onboardingComplete = false;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  void _loadStats() {
    setState(() {
      _likedCount = LikesStore.getLikedCards().length;
      _dislikedCount = DislikesStore.getDislikedIds().length;
      _onboardingComplete = PrefsStore.isOnboardingComplete;
    });
  }

  Future<void> _resetPreferences() async {
    final confirm = await _showConfirmDialog(
      title: 'Réinitialiser les préférences ?',
      message: 'Cela effacera vos préférences de voyage et vous ramènera à l\'onboarding.',
    );

    if (confirm == true) {
      await PrefsStore.clearAll();
      if (mounted) {
        context.go('/onboarding');
      }
    }
  }

  Future<void> _resetLikes() async {
    final confirm = await _showConfirmDialog(
      title: 'Effacer les favoris ?',
      message: 'Tous vos favoris seront supprimés.',
    );

    if (confirm == true) {
      await LikesStore.clearAll();
      _loadStats();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Favoris effacés')),
        );
      }
    }
  }

  Future<void> _resetDislikes() async {
    final confirm = await _showConfirmDialog(
      title: 'Effacer les dislikes ?',
      message: 'Les destinations que vous avez refusées pourront réapparaître.',
    );

    if (confirm == true) {
      await DislikesStore.clearAll();
      DislikesStore.dislikedTagsFromHistory.clear();
      _loadStats();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Dislikes effacés')),
        );
      }
    }
  }

  Future<void> _resetAll() async {
    final confirm = await _showConfirmDialog(
      title: 'Tout réinitialiser ?',
      message: 'Toutes vos données seront effacées : préférences, favoris et dislikes.',
    );

    if (confirm == true) {
      await PrefsStore.clearAll();
      await LikesStore.clearAll();
      await DislikesStore.clearAll();
      DislikesStore.dislikedTagsFromHistory.clear();
      if (mounted) {
        context.go('/onboarding');
      }
    }
  }

  Future<bool?> _showConfirmDialog({
    required String title,
    required String message,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text(title, style: AppTypography.titleLarge),
        content: Text(message, style: AppTypography.bodyMedium),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Annuler'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Confirmer', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Text('Réglages', style: AppTypography.headlineLarge)
                    .animate().fadeIn().slideY(begin: -0.2),
                SizedBox(height: 8),
                Text(
                  'Gérez vos préférences et données',
                  style: AppTypography.bodyMedium,
                ).animate().fadeIn(delay: 50.ms).slideY(begin: -0.2),
                SizedBox(height: 32),

                // Stats section
                _SectionTitle(title: 'Statistiques'),
                SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.favorite,
                        label: 'Favoris',
                        value: '$_likedCount',
                        color: AppColors.like,
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.close,
                        label: 'Refusées',
                        value: '$_dislikedCount',
                        color: AppColors.dislike,
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 100.ms),
                SizedBox(height: 32),

                // API Configuration
                _SectionTitle(title: 'Configuration API'),
                SizedBox(height: 12),
                GlassContainer(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.link, color: AppColors.textSecondary, size: 20),
                          SizedBox(width: 12),
                          Text('BASE_URL', style: AppTypography.labelLarge),
                        ],
                      ),
                      SizedBox(height: 8),
                      Container(
                        padding: EdgeInsets.all(12),
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          AppConstants.baseUrl,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Pour changer l\'URL, modifiez constants.dart',
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 150.ms),
                SizedBox(height: 32),

                // Data management
                _SectionTitle(title: 'Gestion des données'),
                SizedBox(height: 12),
                
                _SettingsButton(
                  icon: Icons.tune,
                  label: 'Modifier les préférences',
                  subtitle: _onboardingComplete ? 'Refaire l\'onboarding' : 'Non complété',
                  onTap: () => context.go('/onboarding'),
                ).animate().fadeIn(delay: 200.ms).slideX(begin: 0.1),
                SizedBox(height: 8),
                
                _SettingsButton(
                  icon: Icons.favorite_border,
                  label: 'Effacer les favoris',
                  subtitle: '$_likedCount destination(s)',
                  onTap: _resetLikes,
                  isDestructive: true,
                ).animate().fadeIn(delay: 250.ms).slideX(begin: 0.1),
                SizedBox(height: 8),
                
                _SettingsButton(
                  icon: Icons.block,
                  label: 'Effacer les dislikes',
                  subtitle: '$_dislikedCount destination(s)',
                  onTap: _resetDislikes,
                  isDestructive: true,
                ).animate().fadeIn(delay: 300.ms).slideX(begin: 0.1),
                SizedBox(height: 24),

                // Danger zone
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.error.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.warning, color: AppColors.error, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Zone dangereuse',
                            style: AppTypography.labelLarge.copyWith(color: AppColors.error),
                          ),
                        ],
                      ),
                      SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: _resetAll,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.error,
                            side: BorderSide(color: AppColors.error),
                          ),
                          child: Text('Tout réinitialiser'),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 350.ms),
                SizedBox(height: 32),

                // App info
                Center(
                  child: Column(
                    children: [
                      Text(
                        'Solea Travel',
                        style: AppTypography.labelLarge,
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Version 1.0.0',
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 400.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: AppTypography.labelLarge.copyWith(color: AppColors.textMuted),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          SizedBox(height: 8),
          Text(value, style: AppTypography.headlineMedium),
          SizedBox(height: 4),
          Text(label, style: AppTypography.bodySmall),
        ],
      ),
    );
  }
}

class _SettingsButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final VoidCallback onTap;
  final bool isDestructive;

  const _SettingsButton({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isDestructive 
                    ? AppColors.error.withOpacity(0.1)
                    : AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isDestructive ? AppColors.error : AppColors.textSecondary,
                size: 20,
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: AppTypography.titleMedium),
                  Text(subtitle, style: AppTypography.bodySmall),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
