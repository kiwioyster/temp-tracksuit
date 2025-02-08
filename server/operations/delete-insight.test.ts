import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";
import type { Insight } from "../models/insight.ts";
import listInsights from "./list-insights.ts";

describe("deleteInsight", () => {
  describe("existing insight", () => {
    withDB((fixture) => {
      const insight: Insight = {
        id: 1,
        brand: 0,
        createdAt: new Date(),
        text: "Test",
      };
      let result: number;

      beforeAll(() => {
        fixture.insights.insert([{
          ...insight,
          createdAt: insight.createdAt.toISOString(),
        }]);
        result = deleteInsight({ ...fixture, id: 1 });
      });

      it("returns 1 for successful deletion", () => {
        expect(result).toBe(1);
      });

      it("removes insight from database", () => {
        const insights = listInsights(fixture);
        expect(insights.length).toBe(0);
      });
    });
  });

  describe("non-existent insight", () => {
    withDB((fixture) => {
      let result: number;

      beforeAll(() => {
        result = deleteInsight({ ...fixture, id: 999 });
      });

      it("returns 0 for non-existent insight", () => {
        expect(result).toBe(0);
      });
    });
  });
}); 