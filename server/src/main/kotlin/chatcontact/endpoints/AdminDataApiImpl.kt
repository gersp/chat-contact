package chatcontact.endpoints

import chatcontact.api.AdminDataApiService
import chatcontact.api.model.CandidateData
import chatcontact.api.model.MatchRequestData
import chatcontact.api.model.StatData
import chatcontact.api.model.UserData
import chatcontact.services.DataService
import org.springframework.stereotype.Service

@Service
class AdminDataApiImpl(val data: DataService) : AdminDataApiService {

    override fun createUser(userData: UserData): UserData {
        TODO("Not yet implemented")
    }

    override fun getCounters(): StatData {
        return data.getCounters()
    }

    override fun getMatching(userId: Long): MatchRequestData {
        TODO("Not yet implemented")
    }

    override fun getMatchingCandidates(userId: Long, matchRequestId: Long): List<CandidateData> {
        TODO("Not yet implemented")
    }

    override fun listUsers(): List<UserData> {
        return data.listUsers()
    }

    override fun startMatching(userId: Long, matchRequestData: MatchRequestData): MatchRequestData {
        return data.createMatchRequest(matchRequestData.copy(userId = userId))
    }

}