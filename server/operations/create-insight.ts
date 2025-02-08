import type { Insight } from "../models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight => {
  console.log("Creating new insight");
  
  const insight: Omit<Insight, "id"> = {
    brand: input.brand,
    text: input.text,
    createdAt: new Date(),
  };

  const [query, params] = insightsTable.insertStatement({
    brand: insight.brand,
    createdAt: insight.createdAt.toISOString(),
    text: insight.text,
  });

  const id = input.db.run(query, params);

  const result = { ...insight, id };
  console.log("Created insight:", result);
  return result;
}; 