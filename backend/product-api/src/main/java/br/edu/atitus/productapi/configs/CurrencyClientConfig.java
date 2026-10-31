package br.edu.atitus.productapi.configs;

import br.edu.atitus.productapi.clients.CurrencyClient;
import org.springframework.boot.restclient.autoconfigure.RestClientBuilderConfigurer;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import java.time.Duration;

@Configuration
public class CurrencyClientConfig {

    @Bean
    @LoadBalanced
    RestClient.Builder getLoadBalancedBuilder(RestClientBuilderConfigurer configurer){
        return configurer.configure(RestClient.builder());
    }

    @Bean
    CurrencyClient getClient(RestClient.Builder builder) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(Duration.ofSeconds(1));
        requestFactory.setReadTimeout(Duration.ofSeconds(2));

        RestClient restClient = builder
                .baseUrl("http://currency-api")
                .requestFactory(requestFactory)
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);

        HttpServiceProxyFactory factory = HttpServiceProxyFactory.
                builderFor(adapter).build();

        return factory.createClient(CurrencyClient.class);
    }
}
