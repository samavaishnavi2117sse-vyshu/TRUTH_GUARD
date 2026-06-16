package com.samavaishnavi.truthguard.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.samavaishnavi.truthguard.screens.*

@Composable
fun AppNavigation() {

    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {

        composable(Routes.HOME) {
            HomeScreen(navController)
        }

        composable(Routes.VERIFY) {
            VerifyScreen()
        }

        composable(Routes.TRENDING) {
            TrendingScreen()
        }

        composable(Routes.DASHBOARD) {
            DashboardScreen()
        }

        composable(Routes.ABOUT) {
            AboutScreen()
        }

    }
}