package chatcontact.endpoints

import chatcontact.api.TestApiService
import chatcontact.api.model.TestSimRequestData
import chatcontact.services.EmbedderService
import org.springframework.stereotype.Service

@Service
class TestApiImpl(val embedder: EmbedderService): TestApiService {

    override fun testSimilarityDetection(testSimRequestData: TestSimRequestData): List<String> {
        val r = embedder.getEncodings(testSimRequestData.first!!)
        val c = testSimRequestData.second!!.map { it to embedder.getEncodings(it) }

        return c.map { it.first to embedder.cosineSimilarity(r, it.second) }.sortedBy { -it.second }.map { it.first }
    }

}