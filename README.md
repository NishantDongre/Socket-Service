# CodeQuest - Socket Service

The CodeQuest-Socket-Service is a microservice responsible for real-time communication between the [CodeQuest](https://github.com/NishantDongre/leetcode-frontend) platform and its users. It utilizes Socket.IO for WebSocket connections and Redis for connection management, enabling instant notifications about code evaluation results

![Image](https://github.com/user-attachments/assets/a7562f5c-d130-41f3-818a-062ef428d46b)

<p align="center"><i>Figure 1: Workflow of the Socket-Service.</i></p>

## Features

- WebSocket-based real-time communication
- Redis-based connection tracking
- Handles multiple simultaneous users
- Graceful handling of connection and disconnection events

## Architecture & Workflow

1. **User submits code**: The frontend submits code to the `Submission-Servive` for evaluation.
2. **Submission Queuing**: The `Submission-Servive` adds the submission to a queue (`SubmissionQueue`).
3. **Evaluation Process**:
   - The `Evaluator-Service` processes the submission.
   - After evaluation, the result is placed in `EvaluationQueue`.
4. **Updating Database & Notifying Users**:
   - The `Submission-Service` retrieves the evaluated submission from `evaluationQueue`.
   - It updates the database and makes an API request to this `CodeQuest-Socket-Service` on `/sendCodeSubmissionResponsePayload`.
5. **Real-time Notification**:
   - The `CodeQuest-Socket-Service` retrieves the connection ID from `Redis`.
   - It sends the evaluation result back to the respective user using `Socket.IO`.

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: HTTP server framework
- **Socket.IO**: WebSocket communication
- **Redis**: Caching and connection tracking

## Installation & Setup

### Prerequisites

- Node.js and npm
- Redis

### Setup

1. Clone the repository

```bash
git clone https://github.com/NishantDongre/Socket-Service.git
cd socket-service
```

2. Install dependencies

```bash
npm install
```

3. Start the service:

```bash
npm run dev
```

## Contact

For queries, reach out at [Email](mailto:nishantdongre30@gmail.com) or [Linkedin](https://www.linkedin.com/in/nishant-dongre/)
