import { Configuration, OpenAIApi } from "openai";

const fetchMessage = async (messages, apiKey) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  return response;
};

export default fetchMessage;
