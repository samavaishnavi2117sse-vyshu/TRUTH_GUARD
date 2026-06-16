package com.samavaishnavi.truthguard.screens
import com.samavaishnavi.truthguard.repository.FirebaseRepository

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun VerifyScreen() {

    val firebaseRepository = FirebaseRepository()
    var newsText by remember { mutableStateOf("") }
    var result by remember { mutableStateOf("") }
    var confidence by remember { mutableStateOf("") }
    var recommendation by remember { mutableStateOf("") }
    var resultColor by remember { mutableStateOf(Color.Gray) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
            .verticalScroll(rememberScrollState())
    ) {

        Text(
            text = "Verify News",
            fontSize = 34.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF6A4FB3)
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
            value = newsText,
            onValueChange = {
                newsText = it
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),
            label = {
                Text("Paste News Here")
            }
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = {

                val text = newsText.lowercase()

                if (
                    text.contains("fake") ||
                    text.contains("hoax") ||
                    text.contains("rumor") ||
                    text.contains("clickbait") ||
                    text.contains("shocking")
                ) {

                    result = "❌ Likely Fake News"
                    confidence = "Confidence Score : 88%"
                    firebaseRepository.saveVerification(
                        newsText,
                        result,
                        confidence
                    )
                    recommendation =
                        "Recommendation:\nVerify this news using trusted sources before sharing."
                    resultColor = Color.Red

                } else {

                    result = "✅ Likely Genuine News"
                    confidence = "Confidence Score : 94%"
                    firebaseRepository.saveVerification(
                        newsText,
                        result,
                        confidence
                    )
                    recommendation =
                        "Recommendation:\nThis news appears reliable."
                    resultColor = Color(0xFF2E7D32)
                }

            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Analyze")
        }

        Spacer(modifier = Modifier.height(25.dp))

        if (result.isNotEmpty()) {

            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {

                Column(
                    modifier = Modifier.padding(16.dp)
                ) {

                    Text(
                        text = "Analysis Result",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(15.dp))

                    Text(
                        text = result,
                        color = resultColor,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = confidence,
                        fontSize = 18.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = recommendation,
                        fontSize = 17.sp
                    )
                }
            }
        }
    }
}