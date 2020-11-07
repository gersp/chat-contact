package chatcontact.endpoints

import chatcontact.api.AdminApiService
import chatcontact.api.model.CounterData
import chatcontact.api.model.UserFormData
import chatcontact.services.FormsService
import org.springframework.stereotype.Service

@Service
class AdminApiImpl(private val forms: FormsService) : AdminApiService {


    override fun getCounters(): CounterData {
        return forms.getCounters()
    }

    override fun listCandidates(): List<UserFormData> {
       return forms.listCandidates()
    }

    override fun listCandidatesConnections() {
        TODO("Not yet implemented")
    }

    override fun listUserForms(): List<UserFormData> {
        return forms.listUserForms()
    }


}