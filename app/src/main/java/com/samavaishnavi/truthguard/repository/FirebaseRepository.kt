package com.samavaishnavi.truthguard.repository

import com.google.firebase.firestore.FirebaseFirestore

class FirebaseRepository {

    private val db = FirebaseFirestore.getInstance()

    fun saveVerification(
        news: String,
        result: String,
        confidence: String
    ) {

        val data = hashMapOf(
            "news" to news,
            "result" to result,
            "confidence" to confidence,
            "timestamp" to System.currentTimeMillis()
        )

        db.collection("verifications")
            .add(data)
    }
}