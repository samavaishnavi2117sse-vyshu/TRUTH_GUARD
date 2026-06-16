package com.samavaishnavi.truthguard.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun DashboardCard(

    title:String,

    value:String

){

    Card(

        modifier=Modifier
            .fillMaxWidth()
            .padding(8.dp),

        elevation= CardDefaults.cardElevation(8.dp)

    ){

        Column(

            modifier=Modifier.padding(20.dp)

        ){

            Text(

                text=title,

                fontSize=18.sp,

                fontWeight= FontWeight.Bold,

                color= MaterialTheme.colorScheme.primary

            )

            Text(

                text=value,

                fontSize=32.sp,

                fontWeight= FontWeight.Bold

            )

        }

    }

}