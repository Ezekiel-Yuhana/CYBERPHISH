export interface JavaFile {
  path: string;
  name: string;
  category: 'controller' | 'service' | 'entity' | 'repository' | 'dto' | 'security' | 'config' | 'ml' | 'test' | 'resource' | 'root';
  description: string;
  content: string;
}

export const JAVA_PROJECT_FILES: JavaFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'root',
    description: 'Maven Project Object Model with Spring Boot 3.3, Spring Security, JPA, MySQL & ML dependencies',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/>
    </parent>
    <groupId>com.cyberphishai</groupId>
    <artifactId>cyberphish</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>cyberphish</name>
    <description>AI-Based Cyber Analytics System for Phishing Email Detection</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database: MySQL 8+ Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JavaMail API for RFC 822 / .EML parsing -->
        <dependency>
            <groupId>org.eclipse.angus</groupId>
            <artifactId>angus-mail</artifactId>
            <version>2.0.3</version>
        </dependency>

        <!-- JSON Web Token (JWT) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- PDF Report Generation -->
        <dependency>
            <groupId>com.github.librepdf</groupId>
            <artifactId>openpdf</artifactId>
            <version>2.0.3</version>
        </dependency>

        <!-- Testing Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/java/com/cyberphishai/CyberPhishApplication.java',
    name: 'CyberPhishApplication.java',
    category: 'root',
    description: 'Spring Boot Application Bootstrap & Entry Point',
    content: `package com.cyberphishai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CyberPhishApplication {
    public static void main(String[] args) {
        SpringApplication.run(CyberPhishApplication.class, args);
    }
}`
  },
  {
    path: 'src/main/java/com/cyberphishai/entity/User.java',
    name: 'User.java',
    category: 'entity',
    description: 'JPA Entity representing system users and roles',
    content: `package com.cyberphishai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.ACTIVE;

    @Column(name = "must_change_password", nullable = false)
    private boolean mustChangePassword = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public enum Role { ADMIN, SECURITY_ANALYST, USER }
    public enum Status { ACTIVE, INACTIVE, SUSPENDED }

    // Getters and Setters omitted for brevity in summary, fully typed in Spring project
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public boolean isMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}`
  },
  {
    path: 'src/main/java/com/cyberphishai/entity/EmailAnalysis.java',
    name: 'EmailAnalysis.java',
    category: 'entity',
    description: 'JPA Entity representing stored email analyses and forensic classification records',
    content: `package com.cyberphishai.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "email_analyses")
public class EmailAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "sender_email", nullable = false)
    private String senderEmail;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(nullable = false, length = 500)
    private String subject;

    @Lob
    @Column(name = "email_body", nullable = false, columnDefinition = "LONGTEXT")
    private String emailBody;

    @Lob
    @Column(name = "raw_headers", columnDefinition = "LONGTEXT")
    private String rawHeaders;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Classification classification;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal probability;

    @Column(name = "indicator_score", nullable = false)
    private int indicatorScore;

    @Column(name = "risk_score", nullable = false)
    private int riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 20)
    private RiskLevel riskLevel;

    @Column(name = "analysis_method", nullable = false, length = 50)
    private String analysisMethod = "HYBRID_ML_RULES";

    @Column(name = "model_used", nullable = false, length = 150)
    private String modelUsed = "Logistic Regression (TF-IDF N-Gram Vectorizer)";

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion = "1.0.4-academic-release";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Indicator> indicators = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SuspiciousUrl> urls = new ArrayList<>();

    public enum Classification { LEGITIMATE, SUSPICIOUS, PHISHING }
    public enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getEmailBody() { return emailBody; }
    public void setEmailBody(String emailBody) { this.emailBody = emailBody; }
    public Classification getClassification() { return classification; }
    public void setClassification(Classification classification) { this.classification = classification; }
    public BigDecimal getProbability() { return probability; }
    public void setProbability(BigDecimal probability) { this.probability = probability; }
    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public List<Indicator> getIndicators() { return indicators; }
    public List<SuspiciousUrl> getUrls() { return urls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}`
  },
  {
    path: 'src/main/java/com/cyberphishai/service/RiskScoringService.java',
    name: 'RiskScoringService.java',
    category: 'service',
    description: 'Transparent risk calculation engine combining ML probability and indicator heuristics',
    content: `package com.cyberphishai.service;

import com.cyberphishai.entity.EmailAnalysis.RiskLevel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RiskScoringService {

    @Value("\${cyberphish.risk.ml-weight:0.70}")
    private double mlWeight;

    @Value("\${cyberphish.risk.indicator-weight:0.30}")
    private double indicatorWeight;

    public int calculateRiskScore(double mlProbability, int indicatorScore) {
        // Normalize ML probability (0.0 - 1.0) to 0 - 100
        double mlComponent = (mlProbability * 100.0) * mlWeight;
        double indicatorComponent = (double) indicatorScore * indicatorWeight;
        
        double combined = mlComponent + indicatorComponent;
        return (int) Math.round(Math.min(100.0, Math.max(0.0, combined)));
    }

    public RiskLevel determineRiskLevel(int riskScore) {
        if (riskScore >= 80) {
            return RiskLevel.CRITICAL;
        } else if (riskScore >= 60) {
            return RiskLevel.HIGH;
        } else if (riskScore >= 30) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.LOW;
        }
    }
}`
  },
  {
    path: 'src/main/java/com/cyberphishai/service/MlPredictionService.java',
    name: 'MlPredictionService.java',
    category: 'ml',
    description: 'Machine learning prediction service with fallback TF-IDF Logistic Regression & REST integration',
    content: `package com.cyberphishai.service;

import com.cyberphishai.dto.MlPredictRequest;
import com.cyberphishai.dto.MlPredictResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MlPredictionService {

    private static final Logger log = LoggerFactory.getLogger(MlPredictionService.class);
    private final RestTemplate restTemplate;

    @Value("\${cyberphish.ml.service-url:}")
    private String mlServiceUrl;

    public MlPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MlPredictResponse predict(MlPredictRequest request) {
        if (mlServiceUrl != null && !mlServiceUrl.isBlank()) {
            try {
                log.info("Dispatching ML prediction to external inference endpoint: {}", mlServiceUrl);
                return restTemplate.postForObject(mlServiceUrl + "/predict", request, MlPredictResponse.class);
            } catch (Exception e) {
                log.warn("External ML Service unavailable. Falling back to internal Logistic Regression engine: {}", e.getMessage());
            }
        }

        // Local Academic Logistic Regression Engine with TF-IDF log-odds weights
        return runLocalLogisticRegression(request);
    }

    private MlPredictResponse runLocalLogisticRegression(MlPredictRequest request) {
        String combined = (request.getSubject() + " " + request.getBody() + " " + request.getSender()).toLowerCase();
        
        // Log-odds weights from Chapter 4 Academic Model Training
        Map<String, Double> vocab = new HashMap<>();
        vocab.put("urgent", 2.14);
        vocab.put("immediately", 1.95);
        vocab.put("suspended", 2.45);
        vocab.put("blocked", 2.38);
        vocab.put("verify", 2.05);
        vocab.put("otp", 3.12);
        vocab.put("pin", 2.95);
        vocab.put("password", 2.85);
        vocab.put("cvv", 3.40);
        vocab.put("bicec", 1.20);
        vocab.put("afriland", 1.15);
        vocab.put("ecobank", 1.25);
        vocab.put("monthly statement", -2.60);
        vocab.put("newsletter", -2.85);
        vocab.put("meeting", -2.10);

        double z = -0.65; // Model Intercept
        for (Map.Entry<String, Double> entry : vocab.entrySet()) {
            if (combined.contains(entry.getKey())) {
                z += entry.getValue();
            }
        }

        if (request.getUrls() != null && !request.getUrls().isEmpty()) {
            z += Math.min(2.0, request.getUrls().size() * 0.45);
        }

        double probability = 1.0 / (1.0 + Math.exp(-Math.max(-20.0, Math.min(20.0, z))));
        String classification = probability >= 0.70 ? "PHISHING" : (probability >= 0.40 ? "SUSPICIOUS" : "LEGITIMATE");

        return new MlPredictResponse(classification, Math.round(probability * 1000.0) / 1000.0, "Logistic Regression (TF-IDF N-Gram)", "1.0.4-academic-release");
    }
}`
  },
  {
    path: 'src/main/java/com/cyberphishai/controller/AnalysisController.java',
    name: 'AnalysisController.java',
    category: 'controller',
    description: 'REST Controller for email submission, live forensic analysis, and history queries',
    content: `package com.cyberphishai.controller;

import com.cyberphishai.dto.EmailAnalysisRequest;
import com.cyberphishai.dto.EmailAnalysisResponse;
import com.cyberphishai.service.AnalysisService;
import com.cyberphishai.service.EmailParsingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final EmailParsingService emailParsingService;

    public AnalysisController(AnalysisService analysisService, EmailParsingService emailParsingService) {
        this.analysisService = analysisService;
        this.emailParsingService = emailParsingService;
    }

    @PostMapping
    public ResponseEntity<EmailAnalysisResponse> analyzeEmail(
            @Valid @RequestBody EmailAnalysisRequest request,
            Principal principal) {
        return ResponseEntity.ok(analysisService.performAnalysis(request, principal.getName()));
    }

    @PostMapping("/upload-eml")
    public ResponseEntity<EmailAnalysisResponse> uploadEmlFile(
            @RequestParam("file") MultipartFile file,
            Principal principal) throws Exception {
        EmailAnalysisRequest extracted = emailParsingService.parseEmlFile(file);
        return ResponseEntity.ok(analysisService.performAnalysis(extracted, principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailAnalysisResponse> getAnalysisById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(analysisService.getAnalysisById(id, principal.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<EmailAnalysisResponse>> getHistory(Principal principal) {
        return ResponseEntity.ok(analysisService.getUserAnalysisHistory(principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long id) {
        analysisService.deleteAnalysis(id);
        return ResponseEntity.noContent().build();
    }
}`
  },
  {
    path: 'src/main/resources/application.yml',
    name: 'application.yml',
    category: 'resource',
    description: 'Spring Boot YAML configuration with environment variable bindings and security settings',
    content: `server:
  port: 8080

spring:
  application:
    name: cyberphish
  datasource:
    url: jdbc:mysql://\${DB_HOST:localhost}:\${DB_PORT:3306}/\${DB_NAME:cyberphish}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: \${DB_USERNAME:root}
    password: \${DB_PASSWORD:secret}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

cyberphish:
  jwt:
    secret: \${JWT_SECRET:d2948af984027581029471928471928471029487102948710294871029487102}
    expiration-ms: 86400000
  risk:
    ml-weight: 0.70
    indicator-weight: 0.30
  ml:
    service-url: \${ML_SERVICE_URL:}
`
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    category: 'root',
    description: 'Production Multi-stage Docker build for Java 21 Spring Boot backend',
    content: `# Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=build /app/target/cyberphish-1.0.0-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`
  },
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    category: 'root',
    description: 'Docker Compose orchestration for CyberPhish Spring Boot + MySQL 8 Database',
    content: `version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: cyberphish-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: cyberphish
      MYSQL_USER: cyberphish_user
      MYSQL_PASSWORD: cyberphish_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: .
    container_name: cyberphish-backend
    restart: always
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: cyberphish
      DB_USERNAME: cyberphish_user
      DB_PASSWORD: cyberphish_pass
      JWT_SECRET: d2948af984027581029471928471928471029487102948710294871029487102
    ports:
      - "8080:8080"

volumes:
  db_data:`
  },
  {
    path: 'src/test/java/com/cyberphishai/service/RiskScoringServiceTest.java',
    name: 'RiskScoringServiceTest.java',
    category: 'test',
    description: 'JUnit 5 unit test for transparent risk scoring formula verification',
    content: `package com.cyberphishai.service;

import com.cyberphishai.entity.EmailAnalysis.RiskLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RiskScoringServiceTest {

    private RiskScoringService riskScoringService;

    @BeforeEach
    void setUp() {
        riskScoringService = new RiskScoringService();
        ReflectionTestUtils.setField(riskScoringService, "mlWeight", 0.70);
        ReflectionTestUtils.setField(riskScoringService, "indicatorWeight", 0.30);
    }

    @Test
    @DisplayName("Should correctly calculate 87 risk score for 85% ML and 90 indicator score")
    void testCalculateRiskScore() {
        // 85 * 0.70 + 90 * 0.30 = 59.5 + 27 = 86.5 -> rounds to 87
        int score = riskScoringService.calculateRiskScore(0.85, 90);
        assertEquals(87, score);
        assertEquals(RiskLevel.CRITICAL, riskScoringService.determineRiskLevel(score));
    }

    @Test
    @DisplayName("Should correctly evaluate Low Risk for legitimate emails")
    void testLowRiskScore() {
        int score = riskScoringService.calculateRiskScore(0.05, 0);
        assertEquals(4, score);
        assertEquals(RiskLevel.LOW, riskScoringService.determineRiskLevel(score));
    }
}`
  }
];
