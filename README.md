# WhatsApp Web Clone

A full-stack web application that simulates the WhatsApp Web interface. This project displays chat conversations from sample webhook data, groups them by user, and allows for sending new messages. It was built as part of a full-stack developer evaluation.

## Live Demo

**[View the live application here](https://anu-whatsapp-frontend.onrender.com/)** 🚀


## Key Features

* **WhatsApp-like UI**: A clean, responsive interface inspired by WhatsApp Web.
* **Conversation Grouping**: Displays all chats neatly organized and grouped by user.
* **Detailed Chat View**: Shows message bubbles with timestamps and delivery status indicators (`sent`, `delivered`, `read`).
* **Webhook Processor**: A backend endpoint capable of processing simulated webhook payloads for both new messages and status updates.
* **Send Messages**: A "Send Message" feature to add new messages to a conversation and persist them in the database.
* **Responsive Design**: The layout is mobile-friendly and adapts to various screen sizes.

## Tech Stack

* **Frontend**: React, Axios
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Deployment**: Render

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm
* Git
* A free MongoDB Atlas account for the database

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd whatsapp-clone
    ```

2.  **Setup the Backend:**
    ```sh
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
    Start the backend server:
    ```sh
    npm start
    ```

3.  **Setup the Frontend:**
    Open a new terminal window.
    ```sh
    cd frontend
    npm install
    ```
    Start the frontend development server:
    ```sh
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## API Endpoints

The backend provides the following API endpoints:

* `GET /api/conversations`: Fetches all conversations, grouped by user.
* `POST /api/send`: Sends a new message from the UI and saves it to the database.
* `POST /api/webhook`: Processes incoming webhook payloads to create new messages or update message statuses.
