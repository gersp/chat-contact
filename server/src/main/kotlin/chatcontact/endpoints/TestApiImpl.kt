package chatcontact.endpoints

import chatcontact.api.TestApiService
import chatcontact.api.model.TestSimRequestData
import chatcontact.chat.ChatConfig
import chatcontact.dao.UserRepository
import chatcontact.services.EmbedderService
import me.ivmg.telegram.bot
import org.springframework.stereotype.Service

@Service
class TestApiImpl(val embedder: EmbedderService,
                  val users: UserRepository,
                  val chatConfig: ChatConfig
    ): TestApiService {

    override fun testSimilarityDetection(testSimRequestData: TestSimRequestData): List<String> {
        val r = embedder.getEncodings(testSimRequestData.first!!)
        val c = testSimRequestData.second!!.map { it to embedder.getEncodings(it) }

        return c.map { it.first to embedder.cosineSimilarity(r, it.second) }.sortedBy { -it.second }.map { it.first }
    }

    override fun testPush(userId: Long) {
        val user = users.getOne(userId)

        // TODO: почему-то не работает\
        bot {
            apiUrl = chatConfig.telegramApiUrl
            token = chatConfig.token
        }.sendMessage(user.telegramUserId, "Тестовый совсем мессадж")
    }

}