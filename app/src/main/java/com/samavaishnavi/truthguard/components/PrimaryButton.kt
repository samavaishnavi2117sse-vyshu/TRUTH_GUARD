package com.samavaishnavi.truthguard.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PrimaryButton(

    text: String,

    onClick: () -> Unit

) {

    Button(

        onClick = onClick,

        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),

        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 6.dp
        )

    ) {

        Text(text)

    }

}