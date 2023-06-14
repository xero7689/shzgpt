const STORAGE_SERVER_HOST = "127.0.0.1"

export const getChatRoom = async (pageNum=null) => {
    let endpoint = `http://${STORAGE_SERVER_HOST}:8000/api/chatroom/`
    if (pageNum) {
        endpoint = endpoint.concat(`?page=${pageNum}`)
    }
    const response = await fetch(endpoint);
    const results = await response.json();

    return results;
}


export const getChatHistory = async (room_id) => {
    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/chat-history/${room_id}`);
    const results = await response.json();
    return results;
}

export const createChatRoom = async (newChatRoomNameInput) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChatRoomNameInput }),
    };

    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/chatroom/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch((error) => console.log(error));

    return response;
}

export const postChat = async (chatroom_id, role, content) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chatroom: chatroom_id,
            role: role,
            content: content
        }),
    }

    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/chat/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(error))
    return response;
}

export const getPromptTopic = async () => {
    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/prompt-topic/`)
    .then((response) => (response.json()))
    .catch((error) => console.log(error));
    return response;
}

export const getPromptsList = async () => {
    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/prompts/`)
    .then((response) => { return response.json() })
    .catch((error) => console.log(error));
    return response;
}

export const postNewPrompt = async (initialPrompt) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialPrompt),
    }

    const response = await fetch(`http://${STORAGE_SERVER_HOST}:8000/api/prompts/`, requestOptions)
        .then((response) => (response.json()))
        .catch((error) => console.log(error));
    return response;
}