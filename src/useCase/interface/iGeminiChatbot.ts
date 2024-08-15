interface IGeminiChatbot {
    sendMessage(message: string): Promise<string>;
  }
  
  export default IGeminiChatbot;
  