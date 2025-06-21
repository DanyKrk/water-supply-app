package eu.waterlineproject.app.supply.water;

import org.junit.jupiter.api.AfterEach;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureDataMongo
public abstract class BaseIT {

    @Autowired
    private MongoTemplate mongoTemplate;

    @AfterEach
    public void tearDown() {
        mongoTemplate.dropCollection("readings");
        mongoTemplate.dropCollection("forms");
        mongoTemplate.dropCollection("images");
        mongoTemplate.dropCollection("spots");
        mongoTemplate.dropCollection("users");
        mongoTemplate.dropCollection("changes_history");
        mongoTemplate.dropCollection("tokens");
        mongoTemplate.dropCollection("images");
    }
}
