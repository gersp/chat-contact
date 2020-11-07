package chatcontact.services

import chatcontact.api.model.*
import chatcontact.dao.*
import org.springframework.stereotype.Service

@Service
class DataService(
        val users: UserRepository,
        val matchRequests: MatchRequestRepository,
        val matchStatuses: MatchStatusRepository,
        val embedder: EmbedderService
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

    fun getActiveMatching(userId: Long): MatchRequest {
        return matchRequests.findLastActiveByUser(userId)
    }

    fun getMatchRequests(userId: Long): List<MatchRequest> {
        return matchRequests.findByUserId(userId)
    }

    fun createUser(userData: UserData): UserData {
        val d = userData.toDBData(users.nextId())
        users.save(d)
        return d.toApiData()
    }

    fun updateUser(userId: Long, userData: UserData): UserData {
        users.save(userData.toDBData(userId))
        return users.getOne(userId).toApiData()
    }

    class Candidate(
            val request: MatchRequest,
            val user: User,
            val weight: Double
    )

    fun getCandidates(userId: Long, matchRequestId: Long): List<CandidateData> {
        val mr = matchRequests.getOne(matchRequestId)
        val user = users.getOne(userId)

        val topicEm1 = embedder.getEncodings(mr.topicText)
        val interestEm1 = embedder.getEncodings(user.interestsText)

        val candidates = matchRequests.findAll()
                .asSequence()
                .filter { it.userId != userId && it.active }
                .filter { match(mr, it) }
                .map {
                    val u2 = users.getOne(it.userId)
                    val topicEm2 = embedder.getEncodings(it.topicText)
                    val interestEm2 = embedder.getEncodings(u2.interestsText)
                    val weight = embedder.cosineSimilarity(topicEm1, topicEm2) * 0.6 +
                            embedder.cosineSimilarity(interestEm1, interestEm2) * 0.4

                    Candidate(it, u2, weight)
                }
                .sortedBy { -it.weight }
                .distinctBy { it.user.id }
                .map {
                    val ds = matchStatuses.findByFirstMatchRequestIdAndSecondMatchRequestId(matchRequestId, it.request.id)
                    val rs = matchStatuses.findByFirstMatchRequestIdAndSecondMatchRequestId(it.request.id, matchRequestId)
                    CandidateData(it.user.toApiData(), it.weight, ds?.status?.let { MatchStatusType.valueOf(it) }, rs?.status?.let { MatchStatusType.valueOf(it) } ) }
                .toList()
        return candidates
    }

    private fun match(m1: MatchRequest, m2: MatchRequest): Boolean {
        return  (!m1.timeRange.morning || (m1.timeRange.morning && m2.timeRange.morning)) &&
                (!m1.timeRange.daytime || (m1.timeRange.daytime && m2.timeRange.daytime)) &&
                (!m1.timeRange.evening || (m1.timeRange.evening && m2.timeRange.evening)) &&
                (!m1.timeRange.night || (m1.timeRange.night && m2.timeRange.night)) &&
                (!m1.timeRange.weekends || (m1.timeRange.weekends && m2.timeRange.weekends))
    }

}