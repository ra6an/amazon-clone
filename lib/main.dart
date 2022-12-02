import 'package:amazon_clone/common/widgets/bottom_bar.dart';
import 'package:amazon_clone/features/admin/screens/admin_screen.dart';
import 'package:amazon_clone/features/home/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:amazon_clone/constants/global_variables.dart';
import 'package:amazon_clone/router.dart';
import 'package:amazon_clone/features/auth/screens/auth_screen.dart';
import 'package:amazon_clone/providers/user_provider.dart';
import 'package:amazon_clone/features/auth/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:amazon_clone/constants/utils.dart';

void main() {
  runApp(MultiProvider(providers: [
    ChangeNotifierProvider(
      create: (context) => UserProvider(),
    )
  ], child: const MyApp()));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final AuthService authService = AuthService();

  @override
  void initState() {
    super.initState();
    authService.getUserData(context);
  }

// This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Amazon Clone',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: GlobalVariables.backgroundColor,
        colorScheme: const ColorScheme.light(
          primary: GlobalVariables.secondaryColor,
        ),
        appBarTheme: const AppBarTheme(
            elevation: 0, iconTheme: IconThemeData(color: Colors.black)),
      ),
      onGenerateRoute: (settings) => generateRoute(settings),
      home: Provider.of<UserProvider>(context).user.token.isNotEmpty
          ? Provider.of<UserProvider>(context).user.type == 'user'
              ? const BottomBar()
              : const AdminScreen()
          : const AuthScreen(),
      // home: Scaffold(
      //   appBar: AppBar(title: const Text('Amazon Clone')),
      //   body: Column(
      //     children: [
      //       const Center(
      //         child: Text(
      //           'Flutter Demo Home Page',
      //         ),
      //       ),
      //       Builder(builder: (context) {
      //         return ElevatedButton(
      //           onPressed: () {
      //             Navigator.pushNamed(context, AuthScreen.routeName);
      //           },
      //           child: const Text('Press'),
      //         );
      //       }),
      //     ],
      //   ),
      // ),
    );
  }
}

// void main() {
//   runApp(const MyApp());
// }

// class MyApp extends StatefulWidget {
//   const MyApp({super.key});

//   @override
//   State<MyApp> createState() => _MyAppState();
// }

// class _MyAppState extends State<MyApp> {
//   int count = 0;

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: Scaffold(
//         appBar: AppBar(
//           backgroundColor: Colors.green,
//           title: const Center(
//             child: Text('Count RABANOV!!!'),
//           ),
//         ),
//         floatingActionButton: FloatingActionButton(
//           child: Icon(Icons.add),
//           onPressed: () {
//             setState(() {
//               count++;
//             });
//           },
//         ),
//         body: Column(
//           children: [
//             const Center(
//               child: Text('Counter'),
//             ),
//             ListTile(
//               title: Center(
//                 child: Text(
//                   '$count',
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
