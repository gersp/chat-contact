package chatcontact.endpoints

import chatcontact.api.UserApiService
import chatcontact.api.model.MatchData
import chatcontact.api.model.MatchStatusData
import chatcontact.api.model.UserFormData

class UserApiImpl: UserApiService {
    override fun collectFeedback(body: String) {
        TODO("Not yet implemented")
    }

    override fun createForm(userFormData: UserFormData) {
        TODO("Not yet implemented")
    }

    override fun exchangeContacts(userFormData: UserFormData): MatchStatusData {
        TODO("Not yet implemented")
    }

    override fun match(userFormData: UserFormData) {
        TODO("Not yet implemented")
    }

    override fun startMatching(matchData: MatchData): List<UserFormData> {
        TODO("Not yet implemented")
    }
}