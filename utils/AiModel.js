import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const transcribeAudio = async (audioFile) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en",
    });
    return transcription.text;
  } catch (error) {
    console.error("Groq Transcription Error:", error);
    throw error;
  }
};

export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      const result = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional interview assistant. You must ALWAYS respond with valid JSON and nothing else. No markdown, no introductory text."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      let textResponse = result.choices[0]?.message?.content || "";

      // Attempt to normalize the response if it's wrapped in an object
      try {
        const parsed = JSON.parse(textResponse);
        if (parsed && !Array.isArray(parsed)) {
          const keys = Object.keys(parsed);
          if (keys.length > 0 && Array.isArray(parsed[keys[0]])) {
            textResponse = JSON.stringify(parsed[keys[0]]);
          }
        }
      } catch (e) {
        // If parsing fails, just return the original text
      }

      return {
        response: {
          text: () => textResponse
        }
      };
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  }
};
