import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme/colors.dart';
import '../../core/theme/typography.dart';
import '../../data/models/trip_card.dart';
import '../../data/models/flight_search.dart';
import '../../data/repositories/flights_repository.dart';
import '../../data/local/prefs_store.dart';
import '../../widgets/common_widgets.dart';

/// Flights search screen with redirect links to external sites
class FlightsScreen extends StatefulWidget {
  final TripCard? tripCard;

  const FlightsScreen({super.key, this.tripCard});

  @override
  State<FlightsScreen> createState() => _FlightsScreenState();
}

class _FlightsScreenState extends State<FlightsScreen> {
  final FlightsRepository _repo = FlightsRepository();
  
  final _originController = TextEditingController();
  final _destinationController = TextEditingController();
  
  DateTime _departDate = DateTime.now().add(Duration(days: 14));
  DateTime? _returnDate;
  int _passengers = 1;
  String _cabin = 'economy';
  bool _isRoundTrip = true;

  @override
  void initState() {
    super.initState();
    _initForm();
  }

  void _initForm() {
    // Prefill destination from trip card
    if (widget.tripCard != null) {
      _destinationController.text = widget.tripCard!.title;
    }
    
    // Try to load last search
    final lastSearch = PrefsStore.getLastFlightSearch();
    if (lastSearch != null) {
      try {
        final search = FlightSearch.fromJsonString(lastSearch);
        _originController.text = search.origin;
        _passengers = search.passengers;
        _cabin = search.cabin;
      } catch (e) {
        print('Error loading last search: $e');
      }
    }
    
    // Set default return date
    _returnDate = _departDate.add(Duration(days: 7));
  }

  @override
  void dispose() {
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  FlightSearch _buildSearch() {
    return FlightSearch(
      origin: _originController.text,
      destination: _destinationController.text,
      departDate: DateFormat('yyyy-MM-dd').format(_departDate),
      returnDate: _isRoundTrip && _returnDate != null 
          ? DateFormat('yyyy-MM-dd').format(_returnDate!) 
          : null,
      passengers: _passengers,
      cabin: _cabin,
    );
  }

  Future<void> _saveAndSearch(Future<bool> Function(FlightSearch) launcher) async {
    final search = _buildSearch();
    
    // Validate
    if (search.origin.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Veuillez entrer une ville de départ')),
      );
      return;
    }
    
    if (search.destination.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Veuillez entrer une destination')),
      );
      return;
    }

    // Save for future use
    await PrefsStore.saveLastFlightSearch(search.toJsonString());
    
    // Launch URL
    final success = await launcher(search);
    if (!success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Impossible d\'ouvrir le lien')),
      );
    }
  }

  Future<void> _selectDate(bool isDeparture) async {
    final initialDate = isDeparture ? _departDate : (_returnDate ?? _departDate.add(Duration(days: 7)));
    final firstDate = isDeparture ? DateTime.now() : _departDate;
    
    final date = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: DateTime.now().add(Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: AppColors.primaryStart,
              surface: AppColors.surface,
            ),
          ),
          child: child!,
        );
      },
    );

    if (date != null) {
      setState(() {
        if (isDeparture) {
          _departDate = date;
          // Ensure return is after depart
          if (_returnDate != null && _returnDate!.isBefore(_departDate)) {
            _returnDate = _departDate.add(Duration(days: 7));
          }
        } else {
          _returnDate = date;
        }
      });
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
                    Text('Rechercher des vols', style: AppTypography.headlineSmall),
                  ],
                ),
              ).animate().fadeIn().slideY(begin: -0.2),

              // Form content
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Origin input
                      _buildTextField(
                        controller: _originController,
                        label: 'Ville de départ',
                        icon: Icons.flight_takeoff,
                        hint: 'Ex: Paris, CDG',
                      ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),
                      SizedBox(height: 16),

                      // Destination input
                      _buildTextField(
                        controller: _destinationController,
                        label: 'Destination',
                        icon: Icons.flight_land,
                        hint: 'Ex: Tokyo, NRT',
                      ).animate().fadeIn(delay: 150.ms).slideX(begin: -0.1),
                      SizedBox(height: 20),

                      // Trip type toggle
                      Row(
                        children: [
                          Expanded(
                            child: _ToggleButton(
                              label: 'Aller-retour',
                              isSelected: _isRoundTrip,
                              onTap: () => setState(() => _isRoundTrip = true),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: _ToggleButton(
                              label: 'Aller simple',
                              isSelected: !_isRoundTrip,
                              onTap: () => setState(() => _isRoundTrip = false),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 200.ms),
                      SizedBox(height: 20),

                      // Date pickers
                      Row(
                        children: [
                          Expanded(
                            child: _DateButton(
                              label: 'Départ',
                              date: _departDate,
                              onTap: () => _selectDate(true),
                            ),
                          ),
                          SizedBox(width: 12),
                          if (_isRoundTrip)
                            Expanded(
                              child: _DateButton(
                                label: 'Retour',
                                date: _returnDate ?? _departDate.add(Duration(days: 7)),
                                onTap: () => _selectDate(false),
                              ),
                            ),
                        ],
                      ).animate().fadeIn(delay: 250.ms),
                      SizedBox(height: 20),

                      // Passengers & Cabin
                      Row(
                        children: [
                          Expanded(
                            child: _buildDropdown<int>(
                              label: 'Passagers',
                              value: _passengers,
                              items: List.generate(6, (i) => i + 1),
                              itemLabel: (v) => '$v',
                              onChanged: (v) => setState(() => _passengers = v!),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: _buildDropdown<String>(
                              label: 'Classe',
                              value: _cabin,
                              items: ['economy', 'premium', 'business'],
                              itemLabel: (v) {
                                switch (v) {
                                  case 'economy': return 'Économique';
                                  case 'premium': return 'Premium';
                                  case 'business': return 'Affaires';
                                  default: return v;
                                }
                              },
                              onChanged: (v) => setState(() => _cabin = v!),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 300.ms),
                      SizedBox(height: 32),

                      // Redirect notice
                      GlassContainer(
                        child: Row(
                          children: [
                            Icon(Icons.info_outline, color: AppColors.textSecondary, size: 20),
                            SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Vous allez être redirigé vers un site de confiance pour finaliser votre recherche.',
                                style: AppTypography.bodySmall,
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(delay: 350.ms),
                      SizedBox(height: 24),

                      // Search buttons
                      Text('Rechercher sur :', style: AppTypography.labelLarge)
                          .animate().fadeIn(delay: 400.ms),
                      SizedBox(height: 16),

                      // Google Flights (primary)
                      SizedBox(
                        width: double.infinity,
                        child: GradientButton(
                          label: 'Google Flights',
                          icon: Icons.search,
                          onTap: () => _saveAndSearch(_repo.launchGoogleFlights),
                        ),
                      ).animate().fadeIn(delay: 450.ms).slideY(begin: 0.2),
                      SizedBox(height: 12),

                      // Secondary options
                      Row(
                        children: [
                          Expanded(
                            child: _SecondaryButton(
                              label: 'Skyscanner',
                              onTap: () => _saveAndSearch(_repo.launchSkyscanner),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: _SecondaryButton(
                              label: 'Kayak',
                              onTap: () => _saveAndSearch(_repo.launchKayak),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required String hint,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelMedium),
        SizedBox(height: 8),
        TextField(
          controller: controller,
          style: TextStyle(color: AppColors.textPrimary),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppColors.textMuted),
            hintText: hint,
          ),
        ),
      ],
    );
  }

  Widget _buildDropdown<T>({
    required String label,
    required T value,
    required List<T> items,
    required String Function(T) itemLabel,
    required void Function(T?) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelMedium),
        SizedBox(height: 8),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              isExpanded: true,
              dropdownColor: AppColors.surface,
              style: TextStyle(color: AppColors.textPrimary),
              items: items.map((item) {
                return DropdownMenuItem(
                  value: item,
                  child: Text(itemLabel(item)),
                );
              }).toList(),
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }
}

class _ToggleButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _ToggleButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryStart.withOpacity(0.2) : AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primaryStart : AppColors.glassBorder,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.primaryStart : AppColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}

class _DateButton extends StatelessWidget {
  final String label;
  final DateTime date;
  final VoidCallback onTap;

  const _DateButton({
    required this.label,
    required this.date,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTypography.labelMedium),
          SizedBox(height: 8),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.glassBorder),
            ),
            child: Row(
              children: [
                Icon(Icons.calendar_today, color: AppColors.textMuted, size: 18),
                SizedBox(width: 12),
                Text(
                  DateFormat('dd MMM yyyy', 'fr').format(date),
                  style: TextStyle(color: AppColors.textPrimary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _SecondaryButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onTap,
      style: OutlinedButton.styleFrom(
        padding: EdgeInsets.symmetric(vertical: 16),
        side: BorderSide(color: AppColors.glassBorder),
      ),
      child: Text(label),
    );
  }
}
