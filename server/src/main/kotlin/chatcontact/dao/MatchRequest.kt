package chatcontact.dao

import chatcontact.api.model.MatchRequestData
import chatcontact.api.model.TimeRestrictionData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.sql.Timestamp
import java.time.Instant
import javax.persistence.Embeddable
import javax.persistence.Embedded
import javax.persistence.Entity
import javax.persistence.Id

@Embeddable
data class TimeRestriction(
        val morning: Boolean = false,
        val daytime: Boolean = false,
        val evening: Boolean = false,
        val night: Boolean = false,
        val weekends: Boolean = false
)

@Entity(name = "match_requests")
data class MatchRequest(
        @Id
        val id: Long,
        val userId: Long,
        val topicText: String,
        @Embedded
        val timeRange: TimeRestriction,

        val timestamp: Instant
)

interface MatchRequestRepository : JpaRepository<MatchRequest, Long> {
    @Query("SELECT nextval('match_request_id_seq')", nativeQuery = true)
    fun nextId(): Long

    @Query("SELECT * FROM match_requests WHERE user_id = :userId ORDER BY DESC timestamp LIMIT 1", nativeQuery = true)
    fun findLastByUser(userId: Long): MatchRequest

    @Query("SELECT * FROM match_requests WHERE user_id = :userId ORDER BY DESC timestamp", nativeQuery = true)
    fun findByUserId(userId: Long): List<MatchRequest>
}

fun TimeRestriction.toApiData(): TimeRestrictionData {
    return TimeRestrictionData(
            morning = this.morning,
            daytime = this.daytime,
            evening = this.evening,
            night = this.night,
            weekends = this.weekends
    )
}

fun TimeRestrictionData.toDBData(): TimeRestriction {
    return TimeRestriction(
            morning = this.morning ?: false,
            daytime = this.daytime ?: false,
            evening = this.evening ?: false,
            night = this.night ?: false,
            weekends = this.weekends ?: false
    )
}

fun MatchRequest.toApiData(): MatchRequestData {
    return MatchRequestData(
            matchRequestId = this.id,
            topicText = this.topicText,
            timeRange = this.timeRange.toApiData()
    )
}

fun MatchRequestData.toDBData(id: Long): MatchRequest {
    return MatchRequest(
            id = this.matchRequestId!!,
            userId = this.userId!!,
            topicText = this.topicText!!,
            timeRange = this.timeRange?.toDBData() ?: TimeRestriction(),
            timestamp = Instant.now()
    )
}
