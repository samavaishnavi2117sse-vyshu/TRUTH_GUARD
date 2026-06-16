package com.samavaishnavi.truthguard.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AboutScreen() {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),

        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "🛡️",
            fontSize = 60.sp
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "TruthGuard",
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            modifier = Modifier.fillMaxWidth()
        ) {

            Column(
                modifier = Modifier.padding(16.dp)
            ) {

                Text(
                    text = "AI Powered Fake News Detection App",
                    fontSize = 20.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Version : 1.0"
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Developed for Educational Purpose"
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Technology : Kotlin + Jetpack Compose + AI"
                )

            }

        }

        Spacer(modifier = Modifier.height(25.dp))

        Text(
            text = "© TruthGuard 2025"
        )

    }

}