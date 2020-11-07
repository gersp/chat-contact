package chatcontact.services

import chatcontact.api.model.CounterData
import chatcontact.api.model.UserFormData
import org.springframework.stereotype.Service

@Service
class FormsService {

    fun getCounters(): CounterData {
        return CounterData(14, 3)
    }

    fun listUserForms(): List<UserFormData> {
        val userOne = UserFormData("Виссарионов Валерий Генадьевич", null, "теннис")
        val userTwo = UserFormData("Пупкина Анна Николаевна", null, "код, coн")
        val userThree = UserFormData("Васечкин Василий Васильевич", null, "еда повкуснее")

        return listOf(userOne, userTwo, userThree)
    }

    fun listCandidates(): List<UserFormData> {
        val userOne = UserFormData("Виссарионов Валерий Генадьевич", null, "теннис")
        val userTwo = UserFormData("Пупкина Анна Николаевна", null, "код, coн")

        return listOf(userOne, userTwo)
    }
}