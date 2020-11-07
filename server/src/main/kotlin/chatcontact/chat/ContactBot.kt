package chatcontact.chat

import chatcontact.api.model.UserData
import chatcontact.dao.User
import chatcontact.services.DataService
import com.github.kotlintelegrambot.entities.KeyboardButton
import com.github.kotlintelegrambot.entities.KeyboardReplyMarkup
import com.github.kotlintelegrambot.entities.ReplyKeyboardRemove
import com.justai.jaicf.channel.telegram.telegram
import com.justai.jaicf.model.scenario.Scenario
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ContactBot(private val dataService: DataService) : Scenario() {

    private val log = LoggerFactory.getLogger(this.javaClass)

    init {
        state("Start") {
            activators {
                regex("/start")
            }
            action {
                reactions.run {
                    say("Добро пожаловать в Chat Contact! \n" +
                            "Чат, в котором можно выбирать собеседника по интересам.")
                    go("/FirstMenu")
                }
            }
        }

        state("FirstMenu", modal = true) {
            action {
                reactions.telegram?.say("Для начала надо заполнить анкету! " +
                        "Она будет показываться другим участникам Chat Contact при подборе собеседника для вас.",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Заполнить анкету!"),
                                                KeyboardButton("Как это работает?")
                                        )
                                ),
                                resizeKeyboard = true,
                                oneTimeKeyboard = true
                        )
                )
            }
        }

        state("Info") {
            activators {
                regex("Как это работает\\?")
            }
            action {
                reactions.telegram?.say("Шаг 1: Вы заполняете небольшую анкету о себе\n" +
                        "Шаг 2: В любое удобное для Вас время инициируете поиск собеседника, можете выбрать тему и время для общения\n" +
                        "Шаг 3: Умный алгоритм подбирает подходящие под ваш запрос анкеты и предлагает их\n" +
                        "Шаг 4: Вы смотрите анкеты собеседников и выбираете интересные. Бот направит им запрос для установления контакта с Вами\n" +
                        "Шаг 5: Есть контакт! Если собеседник тоже лайкнул вашу анкету, бот обменяет вас контактами.\n" +
                        "Если собеседник не ответил, не расстраивайтесь - бот предложит другую анкету.",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Всё понятно, готов начать!")
                                        )
                                ),
                                resizeKeyboard = true,
                                oneTimeKeyboard = true
                        )
                )
            }
        }

        state("Form", modal = true) {
            activators {
                regex("Всё понятно, готов начать!")
                regex("Заполнить анкету!")
            }

            action {
                reactions.go("/Form/InputName")
            }

            state("InputName") {
                action {
                    reactions.telegram?.say("Как тебя зовут?",
                            replyMarkup = ReplyKeyboardRemove())
                }

                state("InputNameResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["name"] = request.input
                            go("/Form/InputWork")
                        }
                    }
                }
            }

            state("InputWork") {
                action {
                    reactions.say("Расскажи немного о своей рабочей деятельности (кем работаешь, что делаешь и т.д.)")
                }

                state("InputWorkResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["work"] = request.input
                            go("/Form/InputInterests")
                        }
                    }
                }
            }

            state("InputInterests")
            {
                action {
                    reactions.say("Чем занимаешься в свободное время ? (Интересы, хобби)")
                }
                state("InputInterestsResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["interest"] = request.input
                            go("/Form/InputAboutYou")
                        }
                    }
                }
            }

            state("InputAboutYou") {
                action {
                    reactions.say("Расскажи немного о себе (в свободной форме)")
                }
                state("InputAboutYouInterestsResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["aboutYou"] = request.input
                            go("/Preview")
                        }
                    }
                }

            }
        }

        state("Preview") {
            action {
                reactions.telegram?.say("Всё сохранил, теперь ваша анкета выглядит так!\n" +
                        "            Имя: ${context.session["name"]}\n" +
                        "            Деятельность: ${context.session["work"]}\n" +
                        "            Интересы/Хобби: ${context.session["interest"]}\n" +
                        "            О себе: ${context.session["aboutYou"]}",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Запустить поиск собеседника!"),
                                                KeyboardButton("Редактировать анкету")
                                        )
                                ),
                                resizeKeyboard = true,
                                oneTimeKeyboard = true
                        )
                )
                dataService.createUser(UserData(displayName = context.session["name"] as String?,
                        work = context.session["work"] as String?,
                        interestsText = context.session["interest"] as String?,
                        aboutUser = context.session["aboutYou"] as String?,
                        // TODO: fill imageLink =
                        telegramUserId = request.clientId.toLong()
                        ))
            }
        }

        state("Search") {
            action {
                reactions.telegram?.say("Желаете указать тему и время встречи?",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Задать тему и время"),
                                                KeyboardButton("Без ограничений!")
                                        )
                                ),
                                resizeKeyboard = true,
                                oneTimeKeyboard = true
                        )
                )
            }
        }

        state("Topic") {
            activators {
                regex("Задать тему и время")
            }
            action {
            }
        }

        state("NoMatch", noContext = true) {
            activators {
                catchAll()
            }
            action {
                reactions.say("Для этого запроса нет обработчика")
            }
        }
    }
}