import Cookies from "js-cookie";

const STORAGE_SERVER_HOST = "127.0.0.1";

export const login = async (username, password) => {
  let endpoint = `http://${STORAGE_SERVER_HOST}:8000/api/login/`;
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
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
  console.log(response);
  return response;
};

export const logout = async () => {
  let endpoint = `http://${STORAGE_SERVER_HOST}:8000/api/logout/`;
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
  };

  const response = await fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};

export const getChatRoom = async (pageNum = null) => {
  let endpoint = `http://${STORAGE_SERVER_HOST}:8000/api/chatroom/`;
  const requestOptions = {
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

export const getChatHistory = async (room_id) => {
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/chat-history/${room_id}`,
    requestOptions
  );

  const results = await response.json();
  return results;
};

export const createChatRoom = async (newChatRoomNameInput) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newChatRoomNameInput }),
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/chatroom/`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));

  return response;
};

export const postChat = async (chatroom_id, role, content) => {
  const csrftoken = Cookies.get("csrftoken");

  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    body: JSON.stringify({
      chatroom: chatroom_id,
      role: role,
      content: content,
    }),
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/chat/`,
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
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/prompt-topic/`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};

export const getPromptsList = async () => {
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/prompts/`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
  return response;
};

export const postNewPrompt = async (initialPrompt) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(initialPrompt),
  };

  const response = await fetch(
    `http://${STORAGE_SERVER_HOST}:8000/api/prompts/`,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return response;
};
