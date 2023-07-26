import Cookies from "js-cookie";
import {
  ShzGPTPromptArgs,
  PostNewMessageArgs,
  ShzGPTChatHistoryResponseObject,
} from "../types/interfaces";

const STORAGE_API_ENDPOINT = process.env.REACT_APP_DJANGO_STORAGE_API_ENDPOINT;

export const login = async (username: string, password: string) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/login/`;
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-Csrftoken": csrftoken },
    body: JSON.stringify({
      username,
      password,
    }),
  };
  const response = await fetch(endpoint, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
  return response;
};

export const logout = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/logout/`;
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
  };

  const response = await fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};

export const getUser = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/user/`;

  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);
  const results = await response.json();

  return results;
};

export const getAPIKey = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/api-key/`;

  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);
  const results = await response.json();

  return results;
};

export const getChatRoom = async (pageNum = null) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/chatroom/`;
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  if (pageNum) {
    endpoint = endpoint.concat(`?page=${pageNum}`);
  }
  const response = await fetch(endpoint, requestOptions);
  const results = await response.json();

  return results;
};

export const getChatHistory = async (
  roomId: number
): Promise<ShzGPTChatHistoryResponseObject[]> => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/chat-history/${roomId}`;
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);

  const results = await response.json();
  return results;
};

export const createChatRoom = async (newChatRoomNameInput: string) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/chatroom/`;
  const csrftoken = Cookies.get("csrftoken");
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    body: JSON.stringify({ name: newChatRoomNameInput }),
  };

  const response = await fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));

  return response;
};

export const postChat = async (args: PostNewMessageArgs) => {
  const { chatRoomId, role, newMessage } = args;
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    body: JSON.stringify({
      chatroom: chatRoomId,
      role: role,
      content: newMessage,
    }),
  };

  const response = await fetch(
    `${STORAGE_API_ENDPOINT}/chat/chat/`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
  return response;
};

export const getPromptTopic = async () => {
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `${STORAGE_API_ENDPOINT}/chat/prompt-topic/`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};

export const getPromptsList = async () => {
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `${STORAGE_API_ENDPOINT}/chat/prompts/`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
  return response;
};

export const postNewPrompt = async (initialPrompt: ShzGPTPromptArgs) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/chat/prompts/`;
  const csrftoken = Cookies.get("csrftoken");
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    body: JSON.stringify(initialPrompt),
  };

  const response = await fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};
