package com.samavaishnavi.truthguard.model

data class Article(

    val title: String,

    val description: String?,

    val url: String?,

    val urlToImage: String?,

    val source: Source

)

data class Source(

    val name: String

)