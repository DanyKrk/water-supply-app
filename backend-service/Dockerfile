FROM openjdk:17-jdk-slim
ARG JAR_FILE
COPY ${JAR_FILE} backend-service.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/backend-service.jar"]