package com.samavaishnavi.truthguard.model

data class NewsResult(
    val status: String,
    val totalResults: Int,
    val articles: List<Article>
)