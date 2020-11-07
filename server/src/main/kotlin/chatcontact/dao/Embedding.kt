package chatcontact.dao

import chatcontact.api.model.UserData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import javax.persistence.Entity
import javax.persistence.Id

@Entity(name = "embeddings")
data class Embedding (
        @Id
        val hash: String,
        val text: String,
        val embedding: String
        ) {

}

interface EmbeddingRepository : JpaRepository<Embedding, String> {

}
