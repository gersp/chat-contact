package chatcontact.dao

import chatcontact.api.model.MatchRequestData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import javax.persistence.Entity
import javax.persistence.Id

@Entity(name = "match_status")
data class MatchStatus(
        @Id
        val id: Long,
        // кто поставил статус
        val firstUserId: Long,
        // кому поставили статус
        val secondUserId: Long,
        val firstMatchRequestId: Long,
        val secondMatchRequestId: Long,
        val status: String,

        val timestamp: Instant
)

interface MatchStatusRepository : JpaRepository<MatchStatus, Long> {
    @Query("SELECT nextval('match_status_id_seq')", nativeQuery = true)
    fun nextId(): Long

    @Query("SELECT * FROM match_status WHERE first_match_request_id = :firstId AND second_match_request_id = :secondId ORDER BY timestamp DESC LIMIT 1", nativeQuery = true)
    fun findByFirstMatchRequestIdAndSecondMatchRequestId(firstId: Long, secondId: Long): MatchStatus?
}
