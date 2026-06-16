package com.samavaishnavi.truthguard.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StatCard(

    title: String,

    value: String

) {

    Card(

        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)

    ) {

        Column(

            modifier = Modifier.padding(16.dp)

        ) {

            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = value,
                fontSize = 26.sp
            )

        }

    }

}