package chatcontact.chat

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("chat")
class ChatConfig {
    lateinit var token: String
    lateinit var telegramApiUrl: String
}