package com.samavaishnavi.truthguard.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.samavaishnavi.truthguard.model.Article
import com.samavaishnavi.truthguard.repository.NewsRepository
import com.samavaishnavi.truthguard.utils.Constants
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class NewsViewModel : ViewModel() {

    private val repository = NewsRepository()

    private val _newsList = MutableStateFlow<List<Article>>(emptyList())
    val newsList: StateFlow<List<Article>> = _newsList

    fun fetchNews() {

        viewModelScope.launch {

            try {

                val response = repository.getTopNews(Constants.API_KEY)

                if (response.isSuccessful) {
                    _newsList.value =
                        response.body()?.articles ?: emptyList()
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }

        }

    }
}