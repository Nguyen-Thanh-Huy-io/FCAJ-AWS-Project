# 🚀 PubliCast - Social Media Automation Platform

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

**PubliCast** is a cloud-native, microservices-based social media automation platform designed to help users manage, schedule, and publish content across multiple social networks simultaneously. 

This repository serves as the capstone project for the **First Cloud Journey (FCJ) Bootcamp** by AWS Study Group Vietnam, demonstrating a production-grade AWS infrastructure deployment using **100% Infrastructure as Code (IaC)**.

---

## 📚 Full Documentation & Workshop

This project includes a comprehensive, bilingual (EN/VI) technical workshop built with Hugo, detailing the architectural decisions and step-by-step Terraform deployment guide.

👉 **[View the PubliCast Architecture Workshop](https://nguyen-thanh-huy-io.github.io/FCAJ-Intership-report/)**

---

## ✨ Key Cloud & DevOps Features

- **Microservices Architecture**: The backend monolith is decoupled into 3 distinct ECS Fargate services (`API`, `Worker-Light`, `Worker-Heavy`) to isolate heavy media processing tasks from user-facing API requests.
- **100% Infrastructure as Code**: The entire AWS environment (20+ resources) is provisioned using **16 modularized Terraform components**.
- **Zero-Trust Network**: Implemented a multi-AZ VPC with public/private subnets and 4 chain-referenced Security Groups. Databases (RDS, Redis) are strictly isolated and only accept traffic from internal ECS containers.
- **Serverless Scheduled Publishing**: Utilizes a hybrid **AWS EventBridge Scheduler + Amazon SQS** pipeline to accurately trigger scheduled posts without always-on compute costs.
- **AWS-Native CI/CD**: 2 independent pipelines (AWS CodePipeline + CodeBuild) for Frontend and Backend that automate Docker image building, ECR pushing, and ECS rolling deployments upon every GitHub push.
- **Centralized Observability**: Automated log aggregation using CloudWatch Log Groups, coupled with Metric Filters that scan for error patterns (`ERROR`, `Exception`) and trigger real-time **SNS Email Alerts**.
- **Cost Optimization**: Implemented VPC Gateway Endpoints for Amazon S3 to route internal media traffic securely while completely bypassing NAT Gateway data processing fees.

---

## 🏗️ Architecture Overview

The system is designed around a **5-Pillar Architecture Strategy**:

1. **Network & Security**: Multi-AZ VPC, Public/Private Subnets, IGW, NAT Gateway, Zero-Trust Security Groups.
2. **Edge & Load Balancing**: Route53 (DNS), Application Load Balancer (ALB) for dynamic API routing, and CloudFront CDN + OAC for high-speed static asset delivery.
3. **Compute & Orchestration**: Amazon ECR (with lifecycle policies) and ECS Fargate clusters running our decoupled Docker containers.
4. **Storage & Database**: Amazon RDS (MySQL) for relational data, Amazon ElastiCache (Redis) for queue management/caching, and Amazon S3 for media storage.
5. **Monitoring & Automation**: CloudWatch, SNS, and Secrets Manager for secure, runtime credential injection.

---

## 📂 Repository Structure

This is a monorepo containing the application source code, infrastructure definitions, and documentation:

```text
.
├── backend/                  # Node.js backend (API & BullMQ Workers)
├── frontend/                 # React/Vite single-page application
├── terraform/                # 16 IaC modules for AWS deployment
│   ├── modules/              # Reusable Terraform modules (vpc, ecs, rds, alb, etc.)
│   ├── environments/         # Environment-specific tfvars (staging/prod)
│   └── main.tf               # Main infrastructure entrypoint
├── fcj-workshop-template/    # Hugo-based documentation & workshop source code
└── README.md                 # You are here
```

---

## 🛠️ Tech Stack

### Infrastructure & DevOps
- **Cloud Provider**: Amazon Web Services (AWS)
- **IaC**: Terraform
- **Containers**: Docker, Amazon Elastic Container Registry (ECR)
- **Compute**: Amazon Elastic Container Service (ECS) with AWS Fargate
- **CI/CD**: AWS CodePipeline, AWS CodeBuild, GitHub Webhooks

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: PostgreSQL (Amazon RDS)
- **Cache & Queue**: Redis (Amazon ElastiCache), BullMQ
- **ORM**: Prisma

### Frontend
- **Framework**: React.js (Vite)
- **Hosting**: Amazon S3 + CloudFront CDN

---

## 🚀 Getting Started

### 1. Local Development (Docker Compose)
To run the application locally for development without deploying to AWS:
```bash
# Clone the repository
git clone https://github.com/Nguyen-Thanh-Huy-io/FCAJ-AWS-Project.git
cd FCAJ-AWS-Project

# Start Docker containers
docker-compose up -d
```

### 2. Cloud Deployment (Terraform)
To deploy the infrastructure to your AWS account:
```bash
cd terraform/environments/staging

# Initialize Terraform and download providers
terraform init

# Review the infrastructure plan
terraform plan

# Deploy to AWS (Requires AWS CLI configured)
terraform apply
```

---

## 👨‍💻 Author

**Nguyễn Thành Huy**  
*Aspiring DevOps / Cloud Engineer*  
- GitHub: [@Nguyen-Thanh-Huy-io](https://github.com/Nguyen-Thanh-Huy-io)
- LinkedIn: [https://www.linkedin.com/in/huy-nguyen-thanh/](https://www.linkedin.com/in/huy-nguyen-thanh/) <!-- Bạn nhớ cập nhật đúng link LinkedIn của bạn nhé -->
