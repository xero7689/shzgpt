const localIP = "10.178.1.206"

export const getChatRoom = async () => {
    const response = await fetch(`http://${localIP}:8000/api/chatroom/`);
    const results = await response.json();
    return results;
}


export const getChatHistory = async (room_id) => {
    const response = await fetch(`http://${localIP}:8000/api/chat-history/${room_id}`);
    const results = await response.json();
    return results;
}

export const createChatRoom = async (newChatRoomNameInput) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChatRoomNameInput }),
    };

    const response = await fetch(`http://${localIP}:8000/api/chatroom/`, requestOptions)
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

    const response = await fetch(`http://${localIP}:8000/api/chat/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(error))
    return response;
}