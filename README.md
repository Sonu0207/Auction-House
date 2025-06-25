# 🏦 Auction House

A serverless, cloud-based auction platform allowing users to create listings and place bids. Built with AWS Lambda for backend functionality, this project simulates a real-time auction experience using REST APIs and S3-hosted frontend assets.

> 🛠️ Developed as part of a CS509 Group Project

---

## 📋 Table of Contents

- [Features](#features)  
- [Architecture & Tech Stack](#architecture--tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Deployment](#deployment)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)

---

## 🚀 Features

- 🧾 Create and manage auction items
- 💸 Place bids on active items
- 🛑 End auctions manually
- 📦 AWS Lambda powered REST API endpoints
- ☁️ Static frontend hosted on AWS S3
- 🧪 Lightweight testing and modular structure

---

## 🧱 Architecture & Tech Stack

| Layer        | Tech                                                                 |
|--------------|----------------------------------------------------------------------|
| Frontend     | HTML, CSS, JavaScript (vanilla)                                      |
| Backend      | Node.js + AWS Lambda                                                 |
| Storage      | AWS S3 (for static files), internal JSON structures for data mocking |
| APIs         | RESTful routes via AWS Lambda function handlers                      |
| Deployment   | AWS CLI (for Lambda updates), S3 Console for frontend uploads        |

---

## 🧰 Getting Started

### Prerequisites

Make sure you have the following tools installed:

- **Node.js** (v18 or newer)
- **npm**
- **AWS CLI** (configured with your credentials)
- **An S3 bucket** (for static frontend hosting)
- **AWS Lambda & API Gateway permissions**

---

### 🛠️ Installation

```bash
git clone https://github.com/Sonu0207/Auction-House.git
cd Auction-House
npm install
