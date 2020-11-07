package chatcontact.services

import chatcontact.dao.Embedding
import chatcontact.dao.EmbeddingRepository
import chatcontact.utils.JSON
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.client.postForEntity
import java.security.MessageDigest
import java.util.*


class EmbedderRequest(val texts: List<String>)
class EmbedderResponse(val embeddings: List<List<Double>>)

@Service
class EmbedderService(
        val embeddings: EmbeddingRepository,
        @Value("\${embedder.url}") val embedderUrl: String
) {
    private val restTemplate = RestTemplateBuilder()
            .build()

    private fun calculateEncodings(text: String): List<Double> {
        val r = restTemplate.postForEntity<EmbedderResponse>("${embedderUrl}/vectors/", EmbedderRequest(listOf(text)))
        return r.body!!.embeddings[0]
    }

    fun getEncodings(text: String): List<Double> {
        val messageDigest = MessageDigest.getInstance("SHA-256")
        messageDigest.update(text.toByteArray())
        val hash = Base64.getEncoder().encodeToString(messageDigest.digest())

        val e = embeddings.findByIdOrNull(hash)
        if (e != null) {
            return JSON.parseList<Double>(e.embedding)
        }

        val em = calculateEncodings(text)

        embeddings.save(Embedding(hash, text, JSON.stringify(em)))

        return em
    }

    fun cosineSimilarity(vectorA: List<Double>, vectorB: List<Double>): Double {
        var dotProduct = 0.0
        var normA = 0.0
        var normB = 0.0
        for (i in vectorA.indices) {
            dotProduct += vectorA[i] * vectorB[i]
            normA += Math.pow(vectorA[i], 2.0)
            normB += Math.pow(vectorB[i], 2.0)
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
    }
}