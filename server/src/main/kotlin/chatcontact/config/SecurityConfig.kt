package chatcontact.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy

@Configuration
@EnableWebSecurity
class SecurityConfig() : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity?) {
        http!!

        http
            .authorizeRequests()
            .antMatchers("/**/*").permitAll()
            .anyRequest().denyAll()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .sessionAuthenticationStrategy(NullAuthenticatedSessionStrategy())
            .and()
            .cors().disable()
            .csrf().disable()
    }
}
