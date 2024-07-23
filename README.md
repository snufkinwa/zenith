<div align="center">
  <img src="./public/logo.svg" alt="Zenith Logo" />
</div>

# 𝖹 𝖤 𝖭 𝖨 𝖳 𝖧

## Overview

Zenith is a coding problem platform that leverages AI and advanced metrics to challenge and enhance the skills of future software engineers. Our platform provides a unique environment where users can engage with complex coding challenges, receive feedback powered by AI, take notes, and highlight important parts of the problems for better learning and retention.

## Features

- **AI-Powered Feedback**: Get insights, hints and suggestions on your code.
- **Advanced Metrics**: Track your progress and performance with detailed metrics.
- **Community Engagement**: Join a community of like-minded developers and collaborate on challenges.
- **Real-Time Updates**: Stay up-to-date with the latest challenges and features.

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Next.js, TypeScript
- **Database**: <s>Firebase</s> Supabase
- **AI**: OpenAI

## TODO

☐ Integrate compilers for C, C++, JavaScript and Java <br />
☐ Integrate AI for feedback <br />
☐ Integrate AI for hints <br />
☐ Integrate Langchain for AI <br />
☐ Add challenges <br />
☐ Add dashboard <br />
☐ Add auth <br />
☐ Add tests <br />
☐ Add more documentation <br />


## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/zenith.git
   cd zenith
   ```
2. **Install dependencies:**

   ```sh
   npm install
   ```
3. Set up Firebase:

    - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
    - Initialize Firebase in the project directory:

   ```sh
   firebase init
   ```
   -Update the Firebase configuration in `src/firebase/config.ts` with your Firebase project details.

### Running the Project

1. **Start the development server:**

   ```sh
   npm run dev
   ```
   The project will be available at `http://localhost:3000`.

