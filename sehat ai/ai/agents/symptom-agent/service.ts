import { AgentService } from "../agent-base";
import { SymptomAgentInput, SymptomProfile } from "./types";
import { SymptomAgentValidator } from "./validator";
import { Logger } from "../../shared/logger";

const symptomKeywords = ["fever", "cough", "headache", "pain", "nausea", "dizziness", "fatigue"];
const allergyKeywords = ["allergy", "rash", "itch", "anaphylaxis", "hives"];
const lifestyleKeywords = ["smoking", "alcohol", "exercise", "diet", "stress"];

function extractNumbers(text: string): number | undefined {
  const ageMatch = text.match(/\b(\d{1,3})\s*(?:year old|years old|yo|yrs old|years?)\b/i);
  if (ageMatch) return Number(ageMatch[1]);
  const match = text.match(/\b(\d{1,3})\b/);
  return match ? Number(match[1]) : undefined;
}

function findTerms(text: string, terms: string[]): string[] {
  return terms.filter((term) => new RegExp(`\\b${term}\\b`, "i").test(text));
}

export class SymptomAgent implements AgentService<SymptomAgentInput, SymptomProfile> {
  private validator = new SymptomAgentValidator();

  async analyze(input: SymptomAgentInput): Promise<SymptomProfile> {
    Logger.debug(`Analyzing symptoms for language ${input.language}`, "SymptomAgent");
    const normalizedText = input.text.toLowerCase();

    const symptoms = findTerms(normalizedText, symptomKeywords);
    const allergies = findTerms(normalizedText, allergyKeywords);
    const lifestyleFactors = findTerms(normalizedText, lifestyleKeywords);
    const age = extractNumbers(normalizedText);
    const gender = /\b(male|female|woman|man|other)\b/i.exec(input.text)?.[1] as SymptomProfile["gender"] | undefined;
    const severity = /\b(mild|moderate|severe|critical|high)\b/i.exec(input.text)?.[1];
    const duration = /\b(\d+\s*(?:days?|weeks?|months?|years?))\b/i.exec(input.text)?.[1];
    const diseases = /\b(diabetes|hypertension|asthma|covid|flu|infection|heart attack|stroke)\b/i.exec(input.text)?.[1];

    const profile: SymptomProfile = {
      symptoms: symptoms.length ? symptoms : [input.text.slice(0, 120)],
      duration: duration ?? undefined,
      severity: severity ?? "unknown",
      age: age ?? undefined,
      gender,
      medicalHistory: /\b(history of ([\w\s]+))\b/i.exec(input.text)?.[2],
      medicineHistory: /\b(taking|on) ([\w\s]+)\b/i.exec(input.text)?.[2],
      allergies: allergies.length ? allergies : undefined,
      lifestyleFactors: lifestyleFactors.length ? lifestyleFactors : undefined,
      familyHistory: /\b(family history of ([\w\s]+))\b/i.exec(input.text)?.[2] ? [/(?:family history of ([\w\s]+))/i.exec(input.text)?.[1] ?? ""] : undefined,
      disease: diseases ?? undefined,
      confidence: 0.74
    };

    return profile;
  }

  async validate(profile: SymptomProfile): Promise<boolean> {
    return this.validator.validate(profile);
  }

  async execute(input: SymptomAgentInput): Promise<SymptomProfile> {
    const profile = await this.analyze(input);
    const valid = await this.validate(profile);
    if (!valid) {
      Logger.warn("Symptom profile validation failed", "SymptomAgent");
      return { ...profile, confidence: 0.36 };
    }
    return profile;
  }
}
