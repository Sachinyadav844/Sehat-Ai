import { describe, expect, it } from "vitest";
import { DatasetRegistry } from "../datasets/dataset-registry";
import { EmbeddingService } from "../embeddings/services/embedding.service";

describe("Foundation layer sanity tests", () => {
  it("registers and lists dataset definitions", () => {
    const registry = new DatasetRegistry();
    const dataset = registry.registerDataset({
      name: "symptom-disease",
      category: "clinical",
      description: "Symptom to disease mapping dataset",
      language: "en",
      records: [{ symptom: "fever", disease: "flu" }],
      source: "internal"
    }, { symptom: "string", disease: "string" });

    expect(registry.listDatasets()).toHaveLength(1);
    expect(registry.loadDataset(dataset.id)?.name).toBe("symptom-disease");
    expect(registry.validateDataset(dataset.id)).toBe(true);
  });

  it("generates deterministic fallback embeddings", async () => {
    const service = new EmbeddingService();
    const vectorA = await service.embedText("heart attack symptoms");
    const vectorB = await service.embedText("heart attack symptoms");
    expect(vectorA).toEqual(vectorB);
    expect(vectorA.length).toBeGreaterThan(0);
  });
});
