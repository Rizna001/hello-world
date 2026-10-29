import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'services/dua_repository.dart';

void main() {
  runApp(const DuaApp());
}

class DuaApp extends StatelessWidget {
  const DuaApp({super.key});

  @override
  Widget build(BuildContext context) {
    const seedColor = Color(0xFF176B58);

    return MaterialApp(
      title: 'Dua Library',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seedColor,
          surface: const Color(0xFFF7F8F5),
        ),
        scaffoldBackgroundColor: const Color(0xFFF7F8F5),
      ),
      home: HomeScreen(repository: DuaRepository()),
    );
  }
}
