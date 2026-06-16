package com.samavaishnavi.truthguard.network

import com.samavaishnavi.truthguard.model.NewsResult
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface ApiService {

    @GET("v2/top-headlines")
    suspend fun getTopNews(
        @Query("country") country: String = "us",
        @Query("apiKey") apiKey: String
    ): Response<NewsResult>
}