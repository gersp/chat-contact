package chatcontact

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ChatContactApplication

object Dev {
    @JvmStatic
    fun main(args: Array<String>) {
        System.setProperty("spring.profiles.active", "dev,local")
        System.setProperty("spring.config.location", "server/src/chatcontact.main/conf/")
        System.setProperty("config.location", "server/src/chatcontact.main/conf/")
        System.setProperty("logging.config", "server/src/chatcontact.main/conf/logback.xml")

        chatcontact.main(args)
    }
}

fun main(args: Array<String>) {
    System.setProperty("user.timezone", "UTC")
    System.setProperty("file.encoding", "UTF-8")

    runApplication<ChatContactApplication>(*args)
}
