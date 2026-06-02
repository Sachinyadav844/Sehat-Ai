import { describe, expect, it } from "vitest";
import { LanguageAgent } from "../service";

describe("LanguageAgent", () => {
  it("should detect and normalize language", async () => {
    const agent = new LanguageAgent();
    const result = await agent.execute({ text: "Hola mundo", language: "es", targetLanguage: "en" });

    expect(result.language).toBe("es");
    expect(result.detectedLanguage).toBe("es");
    expect(result.translatedText).toContain("Translated");
  });
});
