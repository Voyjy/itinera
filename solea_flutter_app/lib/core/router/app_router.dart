import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../data/local/prefs_store.dart';
import '../../data/models/trip_card.dart';
import '../../data/models/trip_idea.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/swipe/swipe_screen.dart';
import '../../features/likes/likes_screen.dart';
import '../../features/trip_details/trip_details_screen.dart';
import '../../features/trip_vibe/trip_vibe_screen.dart';
import '../../features/flights/flights_screen.dart';
import '../../features/hotels/hotels_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/shell/app_shell.dart';

/// App router configuration using go_router
class AppRouter {
  AppRouter._();

  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    redirect: (context, state) {
      // Redirect to onboarding if not complete
      if (!PrefsStore.isOnboardingComplete &&
          state.matchedLocation != '/onboarding') {
        return '/onboarding';
      }
      return null;
    },
    routes: [
      // Onboarding (full screen, no shell)
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // Main app with bottom navigation shell
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const SwipeScreen(),
            ),
          ),
          GoRoute(
            path: '/likes',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const LikesScreen(),
            ),
          ),
          GoRoute(
            path: '/settings',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const SettingsScreen(),
            ),
          ),
        ],
      ),

      // Trip details (full screen overlay)
      GoRoute(
        path: '/details',
        builder: (context, state) {
          final card = state.extra as TripCard?;
          return TripDetailsScreen(card: card);
        },
      ),

      // Trip vibe screen (after right swipe on TripIdea)
      GoRoute(
        path: '/trip-vibe',
        builder: (context, state) {
          final idea = state.extra as TripIdea;
          return TripVibeScreen(likedIdea: idea);
        },
      ),

      // Flights search (full screen overlay)
      GoRoute(
        path: '/flights',
        builder: (context, state) {
          final card = state.extra as TripCard?;
          return FlightsScreen(tripCard: card);
        },
      ),

      // Hotels listing (full screen overlay)
      GoRoute(
        path: '/hotels',
        builder: (context, state) {
          final card = state.extra as TripCard?;
          return HotelsScreen(tripCard: card);
        },
      ),
    ],
  );
}
