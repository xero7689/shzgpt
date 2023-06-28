# SHZ GPT
![shzgpt-screenshot](https://static.shzlee.com/public/shzgpt/screenshot.png)

shz-gpt is a minimal chatgpt-like project developed using React JS that provides a chatroom function to chat with GPT models. It uses another Django project, [shzgpt-storage](https://github.com/xero7689/shzgpt-storage), as its backend to manage user data.

## Features
shz-gpt supports the following features:
1. Basic session-based authentication
2. Chatroom management for different topics' chat
3. Prompt management for saving prompt templates to quickly use while chatting
4. Support for light/dark theme switching
5. API key management
6. Automatic calculation of the chat token to manage the length of the chat that is being sent to the chat API
7. Basic chatroom search function
8. Basic responsive web design (RWD) for both laptop and mobile devices

## Usage
Clone the project and install the necessary npm packages:
```
npm install
```

Create a `.env` file and set the `REACT_APP_DJANGO_STORAGE_API_ENDPOINT` variable to the endpoint of the `shagpt-storage` server:
```env
REACT_APP_DJANGO_STORAGE_API_ENDPOINT=http://127.0.0.1:8000
```

Start the project locally using:
```
npm run start
```

The application should be accessible at `127.0.0.1:3000` by default.
