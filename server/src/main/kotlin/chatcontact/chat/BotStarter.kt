package chatcontact.chat

import com.justai.jaicf.BotEngine
import com.justai.jaicf.activator.catchall.CatchAllActivator
import com.justai.jaicf.activator.event.BaseEventActivator
import com.justai.jaicf.activator.regex.RegexActivator
import com.justai.jaicf.channel.telegram.TelegramChannel
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class BotStarter(val bot: ContactBot,
                     val config: ChatConfig
    ) {

       /* @PostConstruct
        fun init() {
            config.tokens.forEach {
                val bot = BotEngine(
                        model = bot.model,
                        defaultContextManager = ContextManager(
                                it, botContextRepository
                        ),
                        activators = arrayOf(
                                RegexActivator,
                                BaseEventActivator,
                                CatchAllActivator
                        )
                )

                TelegramChannel(
                        bot,
                        it,
                        telegramApiUrl = config.telegramApiUrl
                ).run()
            }

        }

    }*/
}