package com.samavaishnavi.truthguard.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class NewsItem(
    val title: String,
    val source: String
)

@Composable
fun TrendingScreen() {

    val newsList = listOf(
        NewsItem(
            "Scientists discover new climate monitoring technology",
            "BBC"
        ),
        NewsItem(
            "AI transforming healthcare worldwide",
            "Reuters"
        ),
        NewsItem(
            "Space mission successfully reaches orbit",
            "NASA"
        ),
        NewsItem(
            "Global economy shows positive growth",
            "Bloomberg"
        ),
        NewsItem(
            "Education sector adopts AI learning tools",
            "UNESCO"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text(
            text = "📰 Trending News",
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(20.dp))

        LazyColumn {

            items(newsList) { item ->

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {

                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {

                        Text(
                            text = item.title,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Source: ${item.source}",
                            color = MaterialTheme.colorScheme.primary
                        )

                    }

                }

            }

        }

    }

}