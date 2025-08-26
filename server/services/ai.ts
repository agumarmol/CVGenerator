import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function enhanceJobDescription(description: string, jobTitle: string, company: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional CV writer. Enhance job descriptions to be more impactful, specific, and achievement-focused while maintaining accuracy. Use action verbs, quantify achievements where possible, and highlight key skills and technologies.",
        },
        {
          role: "user",
          content: `Enhance this job description for a ${jobTitle} position at ${company}:\n\n${description}`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || description;
  } catch (error) {
    console.error("Error enhancing job description:", error);
    throw new Error("Failed to enhance job description with AI");
  }
}

export async function extractCvDataFromText(text: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a CV data extraction expert. Extract structured CV information from text and return it in JSON format. 
          
          Return the data in this exact structure:
          {
            "personalInfo": {
              "fullName": "string",
              "title": "string",
              "email": "string",
              "phone": "string", 
              "location": "string",
              "summary": "string"
            },
            "experiences": [
              {
                "jobTitle": "string",
                "company": "string",
                "startDate": "YYYY-MM-DD",
                "endDate": "YYYY-MM-DD or null if current",
                "isCurrent": boolean,
                "description": "string"
              }
            ],
            "education": [
              {
                "institution": "string",
                "degree": "string",
                "field": "string",
                "startDate": "YYYY-MM-DD",
                "endDate": "YYYY-MM-DD or null if current",
                "isCurrent": boolean,
                "gpa": "string or null"
              }
            ],
            "skills": [
              {
                "name": "string",
                "level": "beginner|intermediate|advanced|expert",
                "category": "string"
              }
            ]
          }
          
          Extract all available information and infer missing details where appropriate.`,
        },
        {
          role: "user",
          content: `Extract CV data from this text:\n\n${text}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error extracting CV data:", error);
    throw new Error("Failed to extract CV data with AI");
  }
}

export async function generatePersonalSummary(personalInfo: any, experiences: any[], education: any[], skills: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional CV writer. Generate a compelling professional summary (2-3 sentences) that highlights the candidate's key strengths, experience, and value proposition.",
        },
        {
          role: "user",
          content: `Generate a professional summary for:\n\nPersonal Info: ${JSON.stringify(personalInfo)}\nExperiences: ${JSON.stringify(experiences)}\nEducation: ${JSON.stringify(education)}\nSkills: ${JSON.stringify(skills)}`,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate professional summary");
  }
}
