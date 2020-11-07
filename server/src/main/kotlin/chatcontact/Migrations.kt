package chatcontact

import org.flywaydb.core.Flyway
import org.flywaydb.core.api.Location
import org.flywaydb.core.api.configuration.FluentConfiguration
import org.springframework.boot.SpringApplication
import java.io.File

object Migrations {

    object Migrate {
        @JvmStatic
        fun main(args: Array<String>) {
            Dev.applyProps()
            Migrations.main(arrayOf("migrate"))
        }
    }

    object CleanMigrate {
        @JvmStatic
        fun main(args: Array<String>) {
            Dev.applyProps()
            Migrations.main(arrayOf("clean", "migrate"))
        }
    }


    @JvmStatic
    fun main(args: Array<String>) {
        System.setProperty("spring.main.web-application-type", "none")
        System.setProperty("spring.main.banner-mode", "off")

        val context = SpringApplication.run(Migrations::class.java);
        val env = context.environment;

        val folder = File(env.getProperty("migration.path")!!).absoluteFile
        if (!folder.isDirectory) {
            println("Migration path is not a directory: $folder")
            return
        }
        val flywayConfig: FluentConfiguration = Flyway.configure()
                .locations(Location.FILESYSTEM_PREFIX + folder.absolutePath)
                .dataSource(env.getProperty("spring.datasource.url"),
                            env.getProperty("spring.datasource.username"),
                            env.getProperty("spring.datasource.password"))
                .table("schema_version")

        val flyway: Flyway = flywayConfig.load()

        if (args.contains("clean")) {
            flyway.clean()
        }
        if (args.contains("migrate")) {
            flyway.migrate()
        }
    }

}