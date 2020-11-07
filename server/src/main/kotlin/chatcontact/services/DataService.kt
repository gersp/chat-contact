package chatcontact.services

import chatcontact.api.model.StatData
import chatcontact.api.model.UserData
import org.springframework.stereotype.Service

@Service
class DataService {

    fun getCounters(): StatData {
        return StatData(countForms = 14, countMathes = 3)
    }

    fun listUsers(): List<UserData> {
        val userOne = UserData(1, "Виссарионов Валерий Генадьевич", null, "теннис")
        val userTwo = UserData(2, "Пупкина Анна Николаевна", null, "код, coн")
        val userThree = UserData(3, "Васечкин Василий Васильевич", null, "еда повкуснее")

        return listOf(userOne, userTwo, userThree)
    }

    fun listCandidates(): List<UserData> {
        val userOne = UserData(1, "Виссарионов Валерий Генадьевич", null, "теннис")
        val userTwo = UserData(2, "Пупкина Анна Николаевна", null, "код, coн")

        return listOf(userOne, userTwo)
    }
}