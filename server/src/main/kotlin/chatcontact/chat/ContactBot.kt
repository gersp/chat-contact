package chatcontact.chat

import chatcontact.api.model.*
import chatcontact.services.DataService
import com.github.kotlintelegrambot.entities.KeyboardButton
import com.github.kotlintelegrambot.entities.KeyboardReplyMarkup
import com.github.kotlintelegrambot.entities.ReplyKeyboardRemove
import com.justai.jaicf.channel.telegram.telegram
import com.justai.jaicf.model.scenario.Scenario
import me.ivmg.telegram.bot
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ContactBot(private val dataService: DataService, val chatConfig: ChatConfig) : Scenario() {

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

        state("Form") {
            activators {
                regex("/form")
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
                    reactions.go("/CatchAnyText", "/Form/InputName/InputNameResponse")
                }

                state("InputNameResponse") {
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
                    reactions.go("/CatchAnyText", "/Form/InputWork/InputWorkResponse")
                }

                state("InputWorkResponse") {
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
                    reactions.go("/CatchAnyText", "/Form/InputInterests/InputInterestsResponse")
                }

                state("InputInterestsResponse") {
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
                    reactions.go("/CatchAnyText", "/Form/InputAboutYou/InputAboutYouResponse")
                }

                state("InputAboutYouResponse") {
                    action {
                        reactions.run {
                            context.session["aboutYou"] = request.input
                            go("/Preview")
                        }
                    }
                }
            }



        }

        state("SecondMenu") {
            activators {
                regex("/stop")
                regex("Остановить поиск.*")
            }
            action {
                reactions.telegram?.say("Что делаем дальше?", replyMarkup = KeyboardReplyMarkup(
                        listOf(
                                listOf(
                                        KeyboardButton("Запустить поиск собеседника!"),
                                        KeyboardButton("Редактировать анкету")
                                )
                        ),
                        resizeKeyboard = true,
                        oneTimeKeyboard = true
                ))
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
                        userId = request.clientId.toLong(),
                        telegramUserName = request.telegram?.message?.from?.username!!
                ))
            }
        }

        state("Search") {
            activators {
                regex("/search")
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

        state("Topic") {
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
                                                KeyboardButton("Путешествия")
                                        ),
                                        listOf(
                                                KeyboardButton("Работа и деньги"),
                                                KeyboardButton("Еда")
                                        ),

                                        listOf(
                                                KeyboardButton("Спорт и красота"),
                                                KeyboardButton("Пообщаться за жизнь"),
                                                KeyboardButton("Любая!")
                                        )
                                ),
                                oneTimeKeyboard = true,
                                resizeKeyboard = true
                        )
                )
                reactions.go("/CatchAnyText", "/Topic/Time")
            }

            state("Time")
            {
                action {
                    reactions.run {
                        reactions.telegram?.say(
                                "Укажите время",
                                replyMarkup = KeyboardReplyMarkup(
                                        listOf(
                                                listOf(
                                                        KeyboardButton("Утро (с 09-12)"),
                                                        KeyboardButton("День (с 12-18)"),
                                                        KeyboardButton("Вечер (с 18-22)")
                                                ),
                                                listOf(
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
                    context.session["topic"] = request.input
                }

                state("Matching")
                {
                    activators {
                        regex("Утро \\(с 09-12\\)")
                        regex("День \\(с 12-18\\)")
                        regex("Вечер \\(с 18-22\\)")
                        regex("Поздний вечер \\(с 22-00\\)")
                        regex("Выходные")
                        regex("Любое!")
                    }
                    action {
                        context.session["time"] = when (request.input) {
                            "Утро (с 09-12)" -> TimeRestrictionData(morning = true)
                            "День (с 12-18)" -> TimeRestrictionData(daytime = true)
                            "Вечер (с 18-22)" -> TimeRestrictionData(evening = true)
                            "Поздний вечер (с 22-00)" -> TimeRestrictionData(night = true)
                            "Выходные" -> TimeRestrictionData(weekends = true)
                            else -> TimeRestrictionData(morning = true, daytime = true,
                                                        evening = true, night = true, weekends = true)
                        }
                        reactions.go("/StartMatch")
                    }
                }
            }
        }

        state("StartMatch") {
            activators {
                regex("Без ограничений!")
            }
            action {
                reactions.say("Всё понял, пошел искать контакт!")
                dataService.createMatchRequest(MatchRequestData(
                        userId = request.clientId.toLong(),
                        topicText = "",
                        timeRange = TimeRestrictionData(morning = true, daytime = true, evening = true, night = true, weekends = true)
                )
                )
                reactions.go("/ЦиклПодбора")
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
                    reactions.go("/CatchAnyText",
                            "/FixForm/ChangeInputName/ChangeInputNameResponse")
                }

                state("ChangeInputNameResponse") {
                    action {
                        reactions.run {
                            context.session["name"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(request.clientId.toLong())
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
                    reactions.go("/CatchAnyText",
                            "/FixForm/ChangeInputWork/ChangeInputWorkResponse")
                }

                state("ChangeInputWorkResponse") {

                    action {
                        reactions.run {
                            context.session["work"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(request.clientId.toLong())
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
                    reactions.go("/CatchAnyText",
                            "/FixForm/ChangeInputInterests/ChangeInputInterestsResponse")
                }

                state("ChangeInputInterestsResponse") {
                    action {
                        reactions.run {
                            context.session["interest"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(request.clientId.toLong())
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
                    reactions.go("/CatchAnyText",
                            "/FixForm/ChangeInputAboutYou/ChangeInputAboutYouResponse")
                }

                state("ChangeInputAboutYouResponse") {
                    action {
                        reactions.run {
                            context.session["aboutYou"] = request.input
                            dataService.updateUser(dataService
                                    .getUser(request.clientId.toLong())
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

        state("ЦиклПодбора") {
            activators {
                regex("/next")
                regex("показать кадидат.*")
                regex("Проверить кадидат.*")
            }
            action {
                val userId = request.clientId.toLong()
                val candidates = dataService.getCandidates(userId)
                if (candidates.isEmpty()) {
                    reactions.telegram?.say("Список кандидатов пуст", replyMarkup = KeyboardReplyMarkup(
                            listOf(
                                    listOf(
                                            KeyboardButton("Остановить поиск"),
                                            KeyboardButton("Проверить кадидатов")
                                    )
                            ),
                            resizeKeyboard = true,
                            oneTimeKeyboard = true
                    ))
                } else {
                    val c = candidates[0]
                    context.session["candidate"] = c
                    dataService.setStatus(userId, candidates[0], MatchStatusType.shown)
                    reactions.telegram?.say("Есть вот такой кандидат (и ещё ${candidates.size - 1}):\n" +
                            "            Имя: ${c.user!!.displayName}\n" +
                            "            Деятельность: ${c.user.work}\n" +
                            "            Интересы/Хобби: ${c.user.interestsText}\n" +
                            "            О себе: ${c.user.aboutUser}",
                            replyMarkup = KeyboardReplyMarkup(
                                    listOf(
                                            listOf(
                                                    KeyboardButton("Пропустить"),
                                                    KeyboardButton("Выбрать")
                                            )
                                    ),
                                    resizeKeyboard = true, oneTimeKeyboard = true
                            )
                    )
                }
            }
            state("Like") {
                activators {
                    regex("Выбрать.*")
                }
                action {
                    val userId = request.clientId.toLong()
                    val candidate = context.session["candidate"] as CandidateData
                    dataService.setStatus(userId, candidate, MatchStatusType.liked)
                    if (candidate.contraStatus == MatchStatusType.liked) {
                        // отправить пуш
                        bot {
                            apiUrl = chatConfig.telegramApiUrl + "bot"
                            token = chatConfig.token
                        }.sendMessage(candidate.user!!.userId!!,
                                "Есть контакт! Напишите своему собеседнику - @${dataService.getUser(userId).telegramUserName}.\n" +
                                        " Или подождите пока он сам вам напишет.")

                        reactions.say("Есть контакт! Напишите своему собеседнику - @${candidate.user!!.telegramUserName}.\n" +
                                " Или подождите пока он сам вам напишет.")

                        reactions.go("/SecondMenu")
                    } else {
                        reactions.go("/ЦиклПодбора")
                    }
                }
            }
            state("Dislike") {
                activators {
                    regex("Пропустить.*")
                }
                action {
                    val userId = request.clientId.toLong()
                    val candidate = context.session["candidate"] as CandidateData
                    dataService.setStatus(userId, candidate, MatchStatusType.disliked)
                    reactions.go("/ЦиклПодбора")
                }
            }
        }

        state("CatchAnyText", modal = true) {
            fallback {
                reactions.goBack(request.input)
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

    private fun handleStart() {
        state("HandleStart") {
            activators {
                regex("/start")
            }
            action {
                reactions.go("/Start")
            }
        }
    }
}