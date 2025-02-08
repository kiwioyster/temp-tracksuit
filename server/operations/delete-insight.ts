import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): number => {
  console.log(`Deleting insight with id=${input.id}`);
  
  const [query, params] = insightsTable.deleteStatement(input.id);
  const result = input.db.run(query, params);
  
  if (result === 0) {
    console.log("Insight not found");
  } else {
    console.log("Insight deleted successfully");
  }
  
  return result;
}; 