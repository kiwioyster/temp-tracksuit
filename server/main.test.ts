import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "./testing.ts";
import type { Insight } from "../shared/schemas/insight.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import * as insightsTable from "$tables/insights.ts";

const createMockContext = () => {
  const ctx = {
    response: {
      body: undefined as unknown,
      status: 0,
    },
    request: {
      body: {
        json: () => ({}),
      },
    },
    params: {},
  };
  return ctx;
};

describe("API endpoints", () => {
  describe("GET /insights", () => {
    describe("empty database", () => {
      withDB((fixture) => {
        const ctx = createMockContext();

        beforeAll(() => {
          const result = listInsights(fixture);
          ctx.response.body = result;
          ctx.response.status = 200;
        });

        it("returns 200 status", () => {
          expect(ctx.response.status).toBe(200);
        });

        it("returns empty array", () => {
          expect(ctx.response.body).toEqual([]);
        });
      });
    });

    describe("populated database", () => {
      withDB((fixture) => {
        const insights: Insight[] = [
          { id: 1, brand: 0, createdAt: new Date(), text: "1" },
          { id: 2, brand: 0, createdAt: new Date(), text: "2" },
        ];
        const ctx = createMockContext();

        beforeAll(() => {
          fixture.insights.insert(
            insights.map((it) => ({
              ...it,
              createdAt: it.createdAt.toISOString(),
            })),
          );
          const result = listInsights(fixture);
          ctx.response.body = result;
          ctx.response.status = 200;
        });

        it("returns all insights", () => {
          expect(ctx.response.body).toEqual(insights);
        });
      });
    });
  });

  describe("POST /insights", () => {
    withDB((fixture) => {
      const newInsight = {
        id: 1,
        brand: 0,
        text: "Test insight",
      };
      const ctx = createMockContext();

      beforeAll(() => {
        ctx.request.body.json = () => newInsight;

        const insight: Insight = {
          ...newInsight,
          createdAt: new Date(),
        };

        const result = fixture.db.run(insightsTable.insertStatement({
          brand: insight.brand,
          createdAt: insight.createdAt.toISOString(),
          text: insight.text,
        }));

        ctx.response.status = 201;
        ctx.response.body = {
          ...insight,
          id: result,
        };
      });

      it("returns 201 status", () => {
        expect(ctx.response.status).toBe(201);
      });

      it("returns created insight with id", () => {
        const result = ctx.response.body as Insight;
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

  describe("GET /insights/:id", () => {
    describe("non-existent insight", () => {
      withDB((fixture) => {
        const ctx = createMockContext();

        beforeAll(() => {
          const result = lookupInsight({ ...fixture, id: 1 });
          ctx.response.body = result;
          ctx.response.status = 200;
        });

        it("returns 200 status", () => {
          expect(ctx.response.status).toBe(200);
        });

        it("returns undefined", () => {
          expect(ctx.response.body).toBeUndefined();
        });
      });
    });

    describe("existing insight", () => {
      withDB((fixture) => {
        const insight: Insight = {
          id: 1,
          brand: 0,
          createdAt: new Date(),
          text: "Test",
        };
        const ctx = createMockContext();

        beforeAll(() => {
          fixture.insights.insert([{
            ...insight,
            createdAt: insight.createdAt.toISOString(),
          }]);
          const result = lookupInsight({ ...fixture, id: 1 });
          ctx.response.body = result;
          ctx.response.status = 200;
        });

        it("returns the insight", () => {
          expect(ctx.response.body).toEqual(insight);
        });
      });
    });
  });
});
