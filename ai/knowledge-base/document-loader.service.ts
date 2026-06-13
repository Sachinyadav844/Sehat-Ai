import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { v4 as uuidv4 } from "uuid";
import { KnowledgeBaseDocument, KnowledgeBaseMetadata } from "./types";

const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".json", ".csv"];

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\r\n/g, "\n");
}

function extractTextFromCsv(content: string): string {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  }) as Array<Record<string, unknown>>;

  return records
    .map((record) =>
      Object.values(record)
        .filter(Boolean)
        .join(" ")
    )
    .join(" \n\n");
}

export class DocumentLoaderService {
  async loadDocument(
    filePath: string,
    category: string,
    source: string,
    language = "en",
    sourceOrganization = "unknown"
  ): Promise<KnowledgeBaseDocument> {
    const extension = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      throw new Error(`Unsupported document type: ${extension}`);
    }

    const buffer = await fs.readFile(filePath);
    const title = path.basename(filePath, extension);
    let rawText = "";

    switch (extension) {
      case ".txt":
        rawText = buffer.toString("utf-8");
        break;
      case ".json": {
        const json = JSON.parse(buffer.toString("utf-8"));
        rawText = typeof json === "string" ? json : JSON.stringify(json, null, 2);
        break;
      }
      case ".csv":
        rawText = extractTextFromCsv(buffer.toString("utf-8"));
        break;
      case ".pdf": {
        const { text } = await pdfParse(buffer);
        rawText = text;
        break;
      }
      case ".docx": {
        const { value } = await mammoth.extractRawText({ buffer });
        rawText = value;
        break;
      }
      default:
        rawText = buffer.toString("utf-8");
        break;
    }

    const content = normalizeText(rawText);
    const now = new Date().toISOString();
    const metadata: KnowledgeBaseMetadata = {
      id: uuidv4(),
      title,
      source,
      sourceOrganization,
      category,
      language,
      createdAt: now,
      updatedAt: now
    };

    return {
      id: uuidv4(),
      title,
      content,
      metadata
    };
  }

  async loadDocumentsFromDirectory(
    directoryPath: string,
    category: string,
    source: string,
    language = "en",
    sourceOrganization = "unknown"
  ): Promise<KnowledgeBaseDocument[]> {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const documents: KnowledgeBaseDocument[] = [];

    await Promise.all(
      entries.map(async (entry) => {
        if (entry.isFile()) {
          const filePath = path.join(directoryPath, entry.name);
          try {
            const document = await this.loadDocument(filePath, category, source, language, sourceOrganization);
            documents.push(document);
          } catch (error) {
            // Log and continue gracefully
            console.warn(`Failed to load document ${entry.name}: ${(error as Error).message}`);
          }
        }
      })
    );

    return documents;
  }
}
