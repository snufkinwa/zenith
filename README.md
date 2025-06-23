<div align="center">
  <img src="./public/logo.svg" alt="Zenith Logo" />
</div>

# 𝖹 𝖤 𝖭 𝖨 𝖳 𝖧

## Overview

**ZENITH** is a modern coding problem platform designed to make reasoning visible. Built for learners, not performers, it blends AI, real-time collaboration, and visual debugging to help users grow as problem-solvers — not just pass coding tests.

Whether you're a student, a self-taught dev, or just tired of black-box platforms, ZENITH gives you the space to think, test, and explain your way to deeper understanding.

## Features

- 🧠 **AI-Powered Feedback** using Claude 3.5 via AWS Bedrock
- 📊 **Real-Time Metrics** to track your progress and problem-solving approach
- 🖥️ **Step-through Debugging** with Python Tutor-style visualizations
- 👥 **Multi-user Collaboration** powered by AppSync
- ✍️ **Code Annotations** so you can take notes and highlight your process

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Next.js (App Router), TypeScript
- **Database**: DynamoDB
- **AI**: Claude 3.5 via AWS Bedrock (no RAG, uses CSV + Athena)
- **Infra**: AWS Amplify, AppSync, Lambda, DynamoDB, S3, Athena

## TODO

✅ Add dashboard  
✅ Add auth  
✅ Add compiler support for Python
☐ Integrate AI feedback system (Claude via Bedrock)  
✅ Enable structured AI hints  
☐ Connect CSV → Athena for dynamic AI responses  
✅ Add challenges  
☐ Add tests  
☐ Improve documentation

## Getting Started

Follow these instructions to run the project locally for development and testing.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- AWS account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/zenith.git
   cd zenith
   ```
