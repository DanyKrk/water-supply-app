package eu.waterlineproject.app.supply.water.security.jwt;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class JwtDenylistService {

    private Cache<String, Boolean> denylistCache;

    @Value("${wsa.app.jwtExpirationMs}")
    private long jwtExpirationMs;

    @PostConstruct
    public void init() {
        denylistCache = CacheBuilder.newBuilder()
                .expireAfterWrite(jwtExpirationMs, TimeUnit.MILLISECONDS)
                .build();
    }

    public void denylist(String token) {
        if (token != null && !token.isEmpty()) {
            denylistCache.put(token, true);
        }
    }

    public boolean isDenylisted(String token) {
        return token != null && denylistCache.getIfPresent(token) != null;
    }
}