package com.samavaishnavi.truthguard.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.samavaishnavi.truthguard.components.StatCard

@Composable
fun DashboardScreen() {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),

        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "📊 Dashboard",
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(30.dp))

        StatCard(
            title = "Articles Verified",
            value = "25"
        )

        Spacer(modifier = Modifier.height(15.dp))

        StatCard(
            title = "True News",
            value = "18"
        )

        Spacer(modifier = Modifier.height(15.dp))

        StatCard(
            title = "Fake News",
            value = "7"
        )

        Spacer(modifier = Modifier.height(15.dp))

        StatCard(
            title = "Accuracy",
            value = "92%"
        )

    }

}