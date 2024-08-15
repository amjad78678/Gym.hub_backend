import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
  Content,
} from "@google/generative-ai";
import IGeminiChatbot from "../../useCase/interface/iGeminiChatbot";

class GeminiChatbot implements IGeminiChatbot {
  public genAI: GoogleGenerativeAI;
  public model: GenerativeModel;
  public generationConfig: GenerationConfig;
  public chatSession: ChatSession;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const initialPrompt = `You are Gymmi AI, an AI assistant specialized in gym and health-related topics. Your purpose is to help users on a platform dedicated to fitness enthusiasts. You should:
    1. Provide information and advice about various workout routines, exercises, and gym equipment.
    2. Offer tips and strategies for effective training and muscle building.
    3. Discuss nutrition, healthy eating habits, and meal planning.
    4. Help users connect with others who share similar fitness goals.
    5. Suggest workout programs and diet plans based on users' preferences and goals.
    6. Assist with technical issues related to gym equipment and fitness apps.
    7. Engage in discussions about health, wellness, and fitness trends.
    8. Be friendly, enthusiastic, and use fitness-related language when appropriate.
    9. Your name is Gymmi AI, and you are dedicated to helping users achieve their fitness and health goals.
    10. Only give gym and health-related answers. If the user asks about something unrelated to these topics, say, "Sorry, I cannot answer this question. Please ask anything gym or health-related," very politely.
    
Remember, your responses should always be relevant to gym, fitness, and health topics. If a user asks about something unrelated, politely steer the conversation back to gym or health-related subjects.

Now, how can I assist you with your gym or health-related needs today?
`;

    const history: Content[] = [
      {
        role: "user",
        parts: [{ text: initialPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I'm Zep AI, your gaming companion and expert. I'm ready to assist you with all things gaming-related. Whether you need game recommendations, strategies, tech support, or just want to chat about the latest in the gaming world, I'm here to help. What would you like to know about gaming today?",
          },
        ],
      },
    ];

    this.chatSession = this.model.startChat({
      generationConfig: this.generationConfig,
      history,
    });
  }

  public async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chatSession.sendMessage(message);
      console.log("gemini api", process.env.GEMINI_API_KEY);
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to Gymmi AI:", error);
      throw error;
    }
  }
}

export default GeminiChatbot;
