import 'dart:convert';

import 'package:amazon_clone/common/widgets/bottom_bar.dart';
import 'package:amazon_clone/constants/error_handling.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:amazon_clone/features/home/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:amazon_clone/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:amazon_clone/constants/global_variables.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:amazon_clone/providers/user_provider.dart';

class AuthService {
  //
  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
        id: '',
        name: name,
        password: password,
        email: email,
        address: '',
        type: '',
        token: '',
        cart: [],
      );

      http.Response res = await http.post(
        Uri.parse('$uri/auth/signup'),
        body: user.toJson(),
        headers: <String, String>{
          'content-type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'Account created! Login with the same credentials!',
          );
        },
      );
    } catch (e) {
      showSnackBar(
          context,
          // e.toString(),
          'proba 1');
    }
  }

  // sign in
  void signInUser({
    required BuildContext context,
    required String email,
    required String password,
    // required [bool mounted = true],
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('$uri/auth/signin'),
        body: jsonEncode({'email': email, 'password': password}),
        headers: <String, String>{
          'content-type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () async {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          // ignore: use_build_context_synchronously
          Provider.of<UserProvider>(context, listen: false).setUser(res.body);
          await prefs.setString(
            'x-auth-token',
            jsonDecode(res.body)['token'],
          );
          // ignore: use_build_context_synchronously
          Navigator.pushNamedAndRemoveUntil(
            context,
            BottomBar.routeName,
            (route) => false,
          );
        },
      );
    } catch (e) {
      showSnackBar(
          context,
          // e.toString(),
          'proba 2');
    }
  }

  void getUserData(
    BuildContext context,
  ) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('x-auth-token');

      if (token == null) {
        prefs.setString('x-auth-token', '');
      }

      var tokenRes = await http.post(
        Uri.parse('$uri/auth/tokenIsValid'),
        headers: <String, String>{
          'content-type': 'application/json; charset=UTF-8',
          'x-auth-token': token!,
        },
      );

      var response = jsonDecode(tokenRes.body);

      if (response == true) {
        http.Response userRes = await http.get(
          Uri.parse('$uri/auth/'),
          headers: <String, String>{
            'content-type': 'application/json; charset=UTF-8',
            'x-auth-token': token,
          },
        );

        // ignore: use_build_context_synchronously
        var userProvider = Provider.of<UserProvider>(context, listen: false);
        userProvider.setUser(userRes.body);
      }
      // http.Response res = await http.post(
      //   Uri.parse('$uri/auth/signin'),
      //   body: jsonEncode({
      //     'email': email,
      //     'password': password,
      //   }),
      //   headers: <String, String>{
      //     'content-type': 'application/json; charset=UTF-8',
      //   },
      // );

      // httpErrorHandle(
      //   response: res,
      //   context: context,
      //   onSuccess: () async {
      //     SharedPreferences prefs = await SharedPreferences.getInstance();
      //     Provider.of<UserProvider>(context, listen: false).setUser(res.body);
      //     await prefs.setString(
      //       'x-auth-token',
      //       jsonDecode(res.body)['token'],
      //     );
      //     Navigator.pushNamedAndRemoveUntil(
      //       context,
      //       HomeScreen.routeName,
      //       (route) => false,
      //     );
      //   },
      // );
    } catch (e) {
      showSnackBar(
        context,
        e.toString(),
      );
      // 'proba 3');
    }
  }
}
