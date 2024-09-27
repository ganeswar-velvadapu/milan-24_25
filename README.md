# IIT Hyderabad Social Media App

Welcome to the IIT Hyderabad Social Media App! This application is tailored for students of IIT Hyderabad, allowing them to connect with peers, sort students by degree, branch, batch, and hostel, and engage in direct messaging.

## Features

- **Login**: Authenticate using IIT Hyderabad email ID.
- **Student Sorting**:
  - **Degree**: Filter students by B.Tech, M.Tech, or PhD.
  - **Branch**: Sort students by their branch of study.
  - **Batch**: Further refine by batch within the selected branch.
- **Hostel Sorting**: Filter students based on their hostel.
- **Direct Messaging**: Engage in real-time chat with peers.

## Technologies Used

- **Backend**: Node.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Real-Time Messaging**: Socket.io
- **Database**: MongoDB (assumed for this example; adjust based on actual usage)

## Installation
### 1. Clone the Repository

```bash
git clone https://github.com/your-username/iit-hyderabad-social-media-app.git
cd iit-hyderabad-social-media-app
```
### Install Dependencies
```bash
npm install
```
### Set Up .env file
### Start the server 
```bash
npm start
```
## Usage

### 1. **Login**

- Open the application in your browser.
- On the login page, enter your IIT Hyderabad email ID.
- Click the **"Login"** button to authenticate. Ensure your email ID is registered with the application.

### 2. **Sort Students**

- **By Degree**:
  - From the home page, select a degree (B.Tech, M.Tech, PhD) from the dropdown or filter options.
- **By Branch**:
  - After selecting a degree, choose a branch from the available options.
- **By Batch**:
  - Within the selected branch, filter students by batch to view the specific students.
- **By Hostel**:
  - Alternatively, select a hostel to see students from that specific hostel.

### 3. **View and Chat with Peers**

- **View Students**:
  - Browse the list of students based on the selected filters (degree, branch, batch, or hostel).
- **Chat**:
  - Click on a student's profile or name to start a chat.
  - Use the chat interface to send and receive messages in real-time. The chat feature utilizes Socket.io for instant communication.

### 4. **Logout**

- To log out, navigate to the logout option in the navigation bar or menu.
- Confirm logout to end your session and return to the login page.


