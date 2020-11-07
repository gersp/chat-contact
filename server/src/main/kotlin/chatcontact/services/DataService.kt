package chatcontact.services

import chatcontact.api.model.MatchRequestData
import chatcontact.api.model.StatData
import chatcontact.api.model.UserData
import chatcontact.dao.*
import org.springframework.stereotype.Service

@Service
class DataService(
        val users: UserRepository,
        val matchRequests: MatchRequestRepository,
        val matchStatuses: MatchStatusRepository
) {

    fun getCounters(): StatData {
        return StatData(users.count(), matchStatuses.count())
    }

    fun listUsers(): List<UserData> {
        return users.findAll().map { it.toApiData() }
    }

    fun createMatchRequest(matchRequestData: MatchRequestData): MatchRequestData {
        val d = matchRequestData.toDBData(matchRequests.nextId())
        matchRequests.save(d)
        return d.toApiData()
    }
}