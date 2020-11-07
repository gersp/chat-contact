package chatcontact.chat

import com.github.kotlintelegrambot.entities.KeyboardButton
import com.github.kotlintelegrambot.entities.KeyboardReplyMarkup
import com.justai.jaicf.channel.telegram.telegram
import com.justai.jaicf.model.scenario.Scenario
import org.slf4j.LoggerFactory

class ContactBot : Scenario() {

    private val log = LoggerFactory.getLogger(this.javaClass)

    init {
        state("Start")
        {
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

        state("FirstMenu", modal = true)
        {
            action {
                reactions.telegram?.say("Для начала надо заполнить анкету! " +
                        "Она будет показываться другим участникам Chat Contact при подборе собеседника для вас.",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Заполнить анкету!", requestContact = true),
                                                KeyboardButton("Как это работает?")
                                        )
                                )
                        )
                )
            }
        }

        state("Info")
        {
            activators {
                regex("Заполнить анкету!")
            }
            action {
                reactions.telegram?.say("Шаг 1: Вы заполняете небольшую анкету о себе\n" +
                        "Шаг 2: В любое удобное для вас время инициируете поиск собеседника, можете выбрать тему и время для общения\n" +
                        "Шаг 3: Умные алгоритмы подбирают подходящие под ваш запрос анкеты и предлагают их\n" +
                        "Шаг 4:  Вы смотрите анкеты собеседников и выбираете те, с кем можно найти общий язык. Бот направит им запрос на контакт с вами\n" +
                        "Шаг 5: Есть контакт! Если собеседник тоже лайкнул вашу анкету, бот вас сведет и предложит пообщаться.\n" +
                        "Если собеседник не ответил, не расстраивайтесь - бот предложит другую анкету.",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Всё понятно, готов начать!")
                                        )
                                )
                        )
                )
            }
        }

        state("Form") {

            state("InputName")
            {
                activators {
                    regex("Всё понятно, готов начать!")
                    regex("Заполнить анкекту")
                }
                action {
                    reactions.say("Как тебя зовут?")
                    reactions.run {
                        context.session["name"] = request.input
                        go("/Form/InputWork")
                    }
                }
            }

            state("InputWork")
            {
                action {
                    reactions.say("Расскажи немного о своей рабочей деятельности (кем работаешь, что делаешь и т.д.)")
                    reactions.run {
                        context.session["work"] = request.input
                        go("/Form/InputInterests")
                    }
                }
            }

            state("InputInterests")
            {
                action {
                    reactions.say("Чем занимаешься в свободное время ? (Интересы, хобби)")
                    reactions.run {
                        context.session["interest"] = request.input
                        go("/Form/InputAboutYou")
                    }
                }
            }
            state("InputAboutYou")
            {
                action {
                    reactions.say("Расскажи немного о себе (в свободной форме)")
                    reactions.run {
                        context.session["aboutYou"]
                        go("/Preview")
                    }
                }
            }
        }

        state("Preview")
        {
            action {
                reactions.telegram?.say("Всё сохранил, теперь ваша анкета выглядит так!\n" +
                        "            Имя: {{ ${context.session["name"]}}\n" +
                        "            Деятельность: {{${context.session["work"]}}\n" +
                        "            Интересы/Хобби: {{ ${context.session["interest"]} }}\n" +
                        "            О себе: {{ ${context.session["aboutYou"]}}}",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Запустить поиск собеседника!"),
                                                KeyboardButton("Редактировать анкету")
                                        )
                                )
                        )
                )
            }
        }

        state("Search")
        {
            action {
                reactions.telegram?.say("Желаете указать тему или время встречи?",
                        replyMarkup = KeyboardReplyMarkup(
                                listOf(
                                        listOf(
                                                KeyboardButton("Задать тему и время"),
                                                KeyboardButton("Без ограничений!")
                                        )
                                )
                        )
                )
            }
        }

        state("Topic")
        {
            activators {
                regex("Задать тему и время")
            }
            action {
            }
        }
    }
}