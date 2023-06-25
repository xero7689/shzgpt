import Cookies from "js-cookie";
const STORAGE_API_ENDPOINT = process.env.REACT_APP_DJANGO_STORAGE_API_ENDPOINT;

export const login = async (username, password) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/login/`;
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
  return response;
};

export const logout = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/logout/`;
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

export const getUser = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/user/`;

  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);
  const results = await response.json();

  return results;
};

export const getAPIKey = async () => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/api-key/`;

  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);
  const results = await response.json();

  return results;
};

export const getChatRoom = async (pageNum = null) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/chatroom/`;
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

export const getChatHistory = async (roomId) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/chat-history/${roomId}`;
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(endpoint, requestOptions);

  const results = await response.json();
  return results;
};

export const createChatRoom = async (newChatRoomNameInput) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/chatroom/`;
  const csrftoken = Cookies.get("csrftoken");
  const requestOptions = {
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
    `${STORAGE_API_ENDPOINT}/api/chat/`,
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
    `${STORAGE_API_ENDPOINT}/api/prompt-topic/`,
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
    `${STORAGE_API_ENDPOINT}/api/prompts/`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
  return response;
};

export const postNewPrompt = async (initialPrompt) => {
  let endpoint = `${STORAGE_API_ENDPOINT}/api/prompts/`;
  const csrftoken = Cookies.get("csrftoken");
  const requestOptions = {
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
