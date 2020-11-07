package chatcontact.chat

import chatcontact.api.model.MatchRequestData
import chatcontact.api.model.TimeRestrictionData
import chatcontact.api.model.UserData
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
                dataService.cleanup(request.clientId.toLong())
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
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
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
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
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
                reactions.telegram?.say("Всё сохранил, теперь ваша анкета выглядит так:\n" +
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
                val user = dataService.createUser(UserData(displayName = context.session["name"] as String?,
                        work = context.session["work"] as String?,
                        interestsText = context.session["interest"] as String?,
                        aboutUser = context.session["aboutYou"] as String?,
                        // TODO: fill imageLink =
                        telegramUserId = request.clientId.toLong()
                        ))
                context.session["userId"] = user.userId
            }
        }

        state("Search") {
            activators {
                regex("Запустить поиск собеседника!")
            }
            action {
                reactions.telegram?.say("Желаете указать тему и время встречи?",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Задать тему и время"),
                                                KeyboardButton("Без ограничений!")
                                        )
                                ),
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
                        )
                )
            }
        }

        state("Topic"){
            activators {
                regex("Задать тему и время")
            }
            action {
                reactions.telegram?.say(
                        "Укажите тему",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Кино и вино"),
                                                KeyboardButton("Путешествия"),
                                                KeyboardButton("Работа и деньги"),
                                                KeyboardButton("Еда"),
                                                KeyboardButton("Спорт и красота"),
                                                KeyboardButton("Пообщаться за жизнь"),
                                                KeyboardButton("Любая!")
                                        )
                                ),
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
                        )
                )
            }
            state("Time")
            {
                activators {
                    regex(".*")
                }
                action {
                    reactions.run {
                        reactions.telegram?.say(
                                "Укажите время",
                                replyMarkup = KeyboardReplyMarkup(
                                        listOf(
                                                listOf(
                                                        KeyboardButton("Утро (с 09-12)"),
                                                        KeyboardButton("День (с 12-18)"),
                                                        KeyboardButton("Вечер (с 18-22)"),
                                                        KeyboardButton("Поздний вечер (с 22-00)"),
                                                        KeyboardButton("Выходные"),
                                                        KeyboardButton("Любое!")
                                                )
                                        ),
                                        oneTimeKeyboard = true,
                                        resizeKeyboard = true
                                )
                        )
                    }
                }
                state("Matching")
                {
                    activators {
                        regex("Утро (с 09-12)")
                        regex("День (с 12-18)")
                        regex("Вечер (с 18-22)")
                        regex("Поздний вечер (с 22-00)")
                        regex("Выходные")
                        regex("Любое!")
                    }
                    action {
                        reactions.say("Всё понял, пошел искать контакт!")
                        reactions.go("/ThirdMenu")
                    }
                }
            }
        }
        state("FixForm") {
            activators {
                regex("Редактировать анкету")
            }
            action {
                reactions.telegram?.say("Выберите поле, которое, хотите поменять.",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Имя"),
                                                KeyboardButton("Деятельность"),
                                                KeyboardButton("Интересы/Хобби")
                                        ),
                                        listOf(
                                                KeyboardButton("О себе"),
                                                KeyboardButton("Завершить редактирование")
                                        )
                                ),
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
                        )
                )
            }
            state("ChangeInputName") {
                activators {
                    regex("Имя")
                }
                action {
                    reactions.telegram?.say("Как тебя зовут?",
                            replyMarkup = ReplyKeyboardRemove())
                }

                state("ChangeInputNameResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["name"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(context.session["userId"] as Long)
                                    .copy(displayName = request.input)
                            )
                            go("/FixForm")
                        }
                    }
                }
            }

            state("ChangeInputWork") {
                activators {
                    regex("Деятельность")
                }
                action {
                    reactions.say("Расскажи немного о своей рабочей деятельности (кем работаешь, что делаешь и т.д.)")
                }

                state("ChangeInputWorkResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["work"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(context.session["userId"] as Long)
                                    .copy(work = request.input)
                            )
                            go("/FixForm")
                        }
                    }
                }
            }

            state("ChangeInputInterests")
            {
                activators {
                    regex("Интересы/Хобби")
                }
                action {
                    reactions.say("Чем занимаешься в свободное время ? (Интересы, хобби)")
                }
                state("ChangeInputInterestsResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["interest"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(context.session["userId"] as Long)
                                    .copy(interestsText = request.input)
                            )
                            go("/FixForm")
                        }
                    }
                }
            }

            state("ChangeInputAboutYou")
            {
                activators {
                    regex("О себе")
                }
                action {
                    reactions.say("Расскажи немного о себе (в свободной форме)")
                }
                state("ChangeInputAboutYouInterestsResponse") {
                    activators {
                        regex(".*")
                    }
                    action {
                        reactions.run {
                            context.session["aboutYou"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(context.session["userId"] as Long)
                                    .copy(aboutUser = request.input)
                            )
                            go("/FixForm")
                        }
                    }
                }
            }

            state("FixPreview")
            {
                activators {
                    regex("Завершить редактирование")
                }
                action {
                    // TODO: убрать дублирование
                    reactions.telegram?.say("Всё сохранил, теперь ваша анкета выглядит так:\n" +
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
                    reactions.go("/SecondMenu")
                }
            }
        }

        state("ThirdMenu") {
            action {
                reactions.telegram?.say("",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Остановить поиск контакта")
                                        )
                                ),
                                resizeKeyboard = true,
                                oneTimeKeyboard = true
                        )
                )
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
    
    private fun stopButton(): KeyboardReplyMarkup {
        return KeyboardReplyMarkup(
                listOf(
                        listOf(
                                KeyboardButton("Остановить поиск контакта")
                        )
                ),
                resizeKeyboard = true,
                oneTimeKeyboard = true
        )
    }
}