package com.samavaishnavi.truthguard.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun HomeScreen(
    navController: NavHostController
) {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),

        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Text(
            text = "🛡️",
            fontSize = 60.sp
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "TRUTHGUARD",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "AI Powered Fake News Detection",
            fontSize = 18.sp
        )

        Spacer(modifier = Modifier.height(30.dp))

        Card(
            modifier = Modifier.fillMaxWidth()
        ) {

            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp),
                    onClick = {
                        navController.navigate(Routes.VERIFY)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text(
                        "🔍 Verify News",
                        fontSize = 18.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp),
                    onClick = {
                        navController.navigate(Routes.TRENDING)
                    }
                ) {
                    Text(
                        "📰 Trending News",
                        fontSize = 18.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp),
                    onClick = {
                        navController.navigate(Routes.DASHBOARD)
                    }
                ) {
                    Text(
                        "📊 Dashboard",
                        fontSize = 18.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp),
                    onClick = {
                        navController.navigate(Routes.ABOUT)
                    }
                ) {
                    Text(
                        "ℹ About",
                        fontSize = 18.sp
                    )
                }

            }

        }

        Spacer(modifier = Modifier.height(30.dp))

        Text(
            text = "Version 1.0",
            fontSize = 14.sp
        )

    }

}