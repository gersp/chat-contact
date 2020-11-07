package chatcontact

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ChatContactApplication

object Dev {
    fun applyProps() {
        System.setProperty("spring.profiles.active", "dev,local")
        System.setProperty("spring.config.location", "server/src/main/conf/")
        System.setProperty("config.location", "server/src/main/conf/")
        System.setProperty("logging.config", "server/src/main/conf/logback.xml")
        System.setProperty("migration.path", "server/src/main/migrations")
    }

    @JvmStatic
    fun main(args: Array<String>) {
        applyProps()

        chatcontact.main(args)
    }
}

fun main(args: Array<String>) {
    System.setProperty("user.timezone", "UTC")
    System.setProperty("file.encoding", "UTF-8")

    runApplication<ChatContactApplication>(*args)
}
