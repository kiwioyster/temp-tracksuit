import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";
import listInsights from "./list-insights.ts";

describe("createInsight", () => {
  withDB((fixture) => {
    const newInsight = {
      brand: 0,
      text: "Test insight",
    };
    let result: any;

    beforeAll(() => {
      result = createInsight({ ...fixture, ...newInsight });
    });

    it("returns created insight with id", () => {
      expect(result.id).toBeDefined();
      expect(result.brand).toBe(newInsight.brand);
      expect(result.text).toBe(newInsight.text);
      expect(result.createdAt).toBeDefined();
    });

    it("persists insight to database", () => {
      const insights = listInsights(fixture);
      expect(insights.length).toBe(1);
      expect(insights[0].text).toBe(newInsight.text);
    });
  });
}); 