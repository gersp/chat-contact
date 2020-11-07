package chatcontact.dao

import chatcontact.api.model.UserData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import javax.persistence.Entity
import javax.persistence.Id

@Entity(name = "users")
data class User (
        @Id
        val id: Long,
        val displayName: String,
        val imageLink: String?,
        val interestsText: String,
        val work: String,
        val aboutUser: String,
        val telegramUserId: Long
        ) {

}

interface UserRepository : JpaRepository<User, Long> {

    @Query("SELECT nextval('user_id_seq')", nativeQuery = true)
    fun nextId(): Long

}

fun User.toApiData(): UserData {
    return UserData(
            userId = this.id,
            displayName = this.displayName,
            imageLink = this.imageLink,
            interestsText = this.interestsText,
            work = this.work,
            aboutUser = this.aboutUser,
            telegramUserId = this.telegramUserId
    )
}

fun UserData.toDBData(): User  {
    return User(
            id = this.userId!!,
            displayName = this.displayName!!,
            imageLink = this.imageLink,
            interestsText = this.interestsText ?: "",
            work = this.work?: "",
            aboutUser = this.aboutUser?: "",
            telegramUserId = this.telegramUserId ?: 0L
    )
}
