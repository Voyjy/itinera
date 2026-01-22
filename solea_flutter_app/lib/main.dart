import 'package:flutter/material.dart';
import 'app.dart';
import 'data/local/prefs_store.dart';
import 'data/local/likes_store.dart';
import 'data/local/dislikes_store.dart';
import 'data/local/trip_idea_store.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize local storage
  await PrefsStore.init();
  await LikesStore.init();
  await DislikesStore.init();
  await TripIdeaLikesStore.init();

  runApp(const SoleaApp());
}
