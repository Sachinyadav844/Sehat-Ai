import { v4 as uuidv4 } from "uuid";

export interface DatasetDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  language: string;
  records: unknown[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetRegistryEntry {
  definition: DatasetDefinition;
  schema: Record<string, string>;
}

export class DatasetRegistry {
  private registry = new Map<string, DatasetRegistryEntry>();

  registerDataset(definition: Omit<DatasetDefinition, "id" | "createdAt" | "updatedAt">, schema: Record<string, string>) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const entry: DatasetRegistryEntry = {
      definition: {
        ...definition,
        id,
        createdAt: now,
        updatedAt: now
      },
      schema
    };
    this.registry.set(id, entry);
    return entry.definition;
  }

  loadDataset(datasetId: string): DatasetDefinition | null {
    const entry = this.registry.get(datasetId);
    return entry?.definition ?? null;
  }

  validateDataset(datasetId: string): boolean {
    const entry = this.registry.get(datasetId);
    if (!entry) {
      return false;
    }

    const isValid = Array.isArray(entry.definition.records) && entry.definition.records.length > 0;
    return isValid;
  }

  searchDataset(query: string, filters: Partial<Record<string, string>> = {}): DatasetDefinition[] {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.registry.values())
      .filter((entry) => entry.definition.name.toLowerCase().includes(normalizedQuery) || entry.definition.description.toLowerCase().includes(normalizedQuery))
      .filter((entry) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) {
            return true;
          }
          const fieldValue = (entry.definition as unknown as Record<string, unknown>)[key];
          return typeof fieldValue === "string" && fieldValue.toLowerCase().includes(value.toLowerCase());
        });
      })
      .map((entry) => entry.definition);
  }

  listDatasets(): DatasetDefinition[] {
    return Array.from(this.registry.values()).map((entry) => entry.definition);
  }
}
