package chatcontact.endpoints

import chatcontact.api.AdminDataApiService
import chatcontact.api.model.CandidateData
import chatcontact.api.model.MatchRequestData
import chatcontact.api.model.StatData
import chatcontact.api.model.UserData
import chatcontact.dao.toApiData
import chatcontact.services.DataService
import org.springframework.stereotype.Service

@Service
class AdminDataApiImpl(val data: DataService) : AdminDataApiService {

    override fun createUser(userData: UserData): UserData {
        return data.createUser(userData)
    }

    override fun getCounters(): StatData {
        return data.getCounters()
    }

    override fun getMatching(userId: Long): MatchRequestData {
        return data.getActiveMatching(userId)?.toApiData() ?: MatchRequestData()
    }

    override fun getMatchingCandidates(userId: Long, matchRequestId: Long): List<CandidateData> {
        return data.getCandidates(userId, matchRequestId)
    }

    override fun listUsers(): List<UserData> {
        return data.listUsers()
    }

    override fun startMatching(userId: Long, matchRequestData: MatchRequestData): MatchRequestData {
        return data.createMatchRequest(matchRequestData.copy(userId = userId))
    }

}