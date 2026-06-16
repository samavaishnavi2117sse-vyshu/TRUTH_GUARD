package com.samavaishnavi.truthguard.repository

import com.samavaishnavi.truthguard.model.NewsResult
import com.samavaishnavi.truthguard.network.RetrofitInstance
import retrofit2.Response

class NewsRepository {

    suspend fun getTopNews(apiKey: String): Response<NewsResult> {
        return RetrofitInstance.api.getTopNews(
            country = "us",
            apiKey = apiKey
        )
    }
}