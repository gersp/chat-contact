package chatcontact.endpoints

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SystemEndpoint() {

    @GetMapping(value = ["/api/ping"])
    fun healthCheck(): String {
        return "Ok"
    }

}
