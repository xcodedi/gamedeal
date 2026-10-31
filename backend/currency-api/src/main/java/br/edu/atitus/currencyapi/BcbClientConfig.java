package br.edu.atitus.currencyapi;

import br.edu.atitus.currencyapi.clients.BcbClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import java.time.Duration;

@Configuration
public class BcbClientConfig {

    @Bean
    BcbClient getClient(RestClient.Builder builder) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(5));

        RestClient restClient = builder
                .baseUrl("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata")
                .requestFactory(requestFactory)
                .requestInterceptor((request, body, execution) -> {
                    System.out.println("Request: " + request.getMethod() + " " + request.getURI());
                    return execution.execute(request, body);
                })
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);

        HttpServiceProxyFactory factory = HttpServiceProxyFactory.
                builderFor(adapter).build();

        return factory.createClient(BcbClient.class);
    }
}
