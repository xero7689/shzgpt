import { Configuration, OpenAIApi } from "openai";

// You should route the traffic to secure backend like Nuxt3 if
// using electron to build your app
const configuration = new Configuration({
    apiKey: "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",
});
delete configuration.baseOptions.headers['User-Agent'];

const openai = new OpenAIApi(configuration);

const fetchMessage = async (messages) => {
    console.log("[gpt.js][Fetch Message]");
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    return response;
}

export default fetchMessage;