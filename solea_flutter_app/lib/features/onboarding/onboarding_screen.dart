import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/models/user_prefs.dart';
import '../../data/local/prefs_store.dart';
import '../../widgets/common_widgets.dart';

/// 3-step onboarding wizard for travel preferences
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;

  // Selected options
  String _travelType = 'solo';
  String _priority = 'relax';
  String _pace = 'balanced';

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 2) {
      _pageController.nextPage(
        duration: Duration(milliseconds: 400),
        curve: Curves.easeOutCubic,
      );
      setState(() => _currentStep++);
    } else {
      _completeOnboarding();
    }
  }

  void _skipOnboarding() {
    _completeOnboarding();
  }

  Future<void> _completeOnboarding() async {
    final prefs = UserPrefs(
      travelType: _travelType,
      priority: _priority,
      pace: _pace,
    );
    
    await PrefsStore.saveUserPrefs(prefs);
    await PrefsStore.setOnboardingComplete(true);
    
    if (mounted) {
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Header with skip button
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Progress indicators
                    Row(
                      children: List.generate(3, (index) {
                        return Container(
                          margin: EdgeInsets.only(right: 8),
                          width: index == _currentStep ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: index <= _currentStep
                                ? AppColors.primaryStart
                                : AppColors.surfaceLight,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ).animate(target: index == _currentStep ? 1 : 0)
                            .scale(duration: 200.ms);
                      }),
                    ),
                    // Skip button
                    TextButton(
                      onPressed: _skipOnboarding,
                      child: Text(
                        'Passer',
                        style: TextStyle(color: AppColors.textMuted),
                      ),
                    ),
                  ],
                ),
              ),

              // Animated header icon
              Container(
                height: 120,
                child: Icon(
                  Icons.flight_takeoff,
                  size: 80,
                  color: AppColors.primaryStart,
                ).animate(onPlay: (c) => c.repeat())
                    .shimmer(duration: 2.seconds, color: AppColors.primaryEnd.withOpacity(0.3)),
              ),

              // Page content
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: NeverScrollableScrollPhysics(),
                  children: [
                    _buildTravelTypeStep(),
                    _buildPriorityStep(),
                    _buildPaceStep(),
                  ],
                ),
              ),

              // Next button
              Padding(
                padding: EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity,
                  child: GradientButton(
                    label: _currentStep == 2 ? 'Commencer' : 'Suivant',
                    icon: _currentStep == 2 ? Icons.rocket_launch : Icons.arrow_forward,
                    onTap: _nextStep,
                  ),
                ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTravelTypeStep() {
    final options = [
      ('solo', 'Solo', Icons.person, 'Aventure en solitaire'),
      ('couple', 'Couple', Icons.favorite, 'Voyage romantique'),
      ('family', 'Famille', Icons.family_restroom, 'Avec les enfants'),
      ('kids', 'Avec enfants', Icons.child_care, 'Activités familiales'),
      ('senior', 'Senior', Icons.elderly, 'Confort et découverte'),
    ];

    return _buildStep(
      title: 'Comment voyagez-vous ?',
      subtitle: 'Nous adapterons nos suggestions à votre style',
      options: options,
      selectedValue: _travelType,
      onSelect: (value) => setState(() => _travelType = value),
    );
  }

  Widget _buildPriorityStep() {
    final options = [
      ('relax', 'Détente', Icons.spa, 'Repos et bien-être'),
      ('culture', 'Culture', Icons.museum, 'Histoire et art'),
      ('nature', 'Nature', Icons.forest, 'Grands espaces'),
      ('food', 'Gastronomie', Icons.restaurant, 'Découvertes culinaires'),
      ('comfort', 'Confort', Icons.hotel, 'Luxe et service'),
    ];

    return _buildStep(
      title: 'Quelle est votre priorité ?',
      subtitle: 'Ce que vous recherchez avant tout',
      options: options,
      selectedValue: _priority,
      onSelect: (value) => setState(() => _priority = value),
    );
  }

  Widget _buildPaceStep() {
    final options = [
      ('calm', 'Calme', Icons.self_improvement, 'Prendre son temps'),
      ('balanced', 'Équilibré', Icons.balance, 'Un peu de tout'),
      ('light-walking', 'Actif', Icons.directions_walk, 'Explorer à pied'),
    ];

    return _buildStep(
      title: 'Quel rythme préférez-vous ?',
      subtitle: 'L\'intensité de vos journées',
      options: options,
      selectedValue: _pace,
      onSelect: (value) => setState(() => _pace = value),
    );
  }

  Widget _buildStep({
    required String title,
    required String subtitle,
    required List<(String, String, IconData, String)> options,
    required String selectedValue,
    required void Function(String) onSelect,
  }) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTypography.headlineLarge)
              .animate().fadeIn().slideX(begin: -0.1),
          SizedBox(height: 8),
          Text(subtitle, style: AppTypography.bodyLarge)
              .animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),
          SizedBox(height: 32),
          Expanded(
            child: ListView.builder(
              itemCount: options.length,
              itemBuilder: (context, index) {
                final option = options[index];
                final isSelected = option.$1 == selectedValue;
                
                return Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: _OptionCard(
                    value: option.$1,
                    title: option.$2,
                    icon: option.$3,
                    subtitle: option.$4,
                    isSelected: isSelected,
                    onTap: () => onSelect(option.$1),
                  ),
                ).animate(delay: (100 * index).ms)
                    .fadeIn()
                    .slideX(begin: 0.1);
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _OptionCard extends StatelessWidget {
  final String value;
  final String title;
  final IconData icon;
  final String subtitle;
  final bool isSelected;
  final VoidCallback onTap;

  const _OptionCard({
    required this.value,
    required this.title,
    required this.icon,
    required this.subtitle,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected 
              ? AppColors.primaryStart.withOpacity(0.15)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected 
                ? AppColors.primaryStart
                : AppColors.glassBorder,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primaryStart.withOpacity(0.2)
                    : AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppColors.primaryStart : AppColors.textSecondary,
                size: 24,
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(
                Icons.check_circle,
                color: AppColors.primaryStart,
                size: 24,
              ),
          ],
        ),
      ),
    );
  }
}
