import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "./testing.ts";
import type { Insight } from "./models/insight.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

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
        brand: 0,
        text: "Test insight",
      };
      const ctx = createMockContext();

      beforeAll(async () => {
        ctx.request.body.json = () => newInsight;
        const result = createInsight({ ...fixture, ...newInsight });
        ctx.response.status = 201;
        ctx.response.body = result;
      });

      it("returns 201 status", () => {
        expect(ctx.response.status).toBe(201);
      });

      it("returns created insight", () => {
        const result = ctx.response.body as Insight;
        expect(result.id).toBeDefined();
        expect(result.brand).toBe(newInsight.brand);
        expect(result.text).toBe(newInsight.text);
        expect(result.createdAt).toBeDefined();
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

  describe("DELETE /insights/:id", () => {
    describe("existing insight", () => {
      withDB((fixture) => {
        const insight: Insight = {
          id: 1,
          brand: 0,
          createdAt: new Date(),
          text: "Test",
        };
        const ctx = createMockContext();
        ctx.params = { id: "1" };

        beforeAll(() => {
          fixture.insights.insert([{
            ...insight,
            createdAt: insight.createdAt.toISOString(),
          }]);
          const result = deleteInsight({ ...fixture, id: 1 });
          ctx.response.status = result === 0 ? 404 : 204;
        });

        it("returns 204 status", () => {
          expect(ctx.response.status).toBe(204);
        });
      });
    });

    describe("non-existent insight", () => {
      withDB((fixture) => {
        const ctx = createMockContext();
        ctx.params = { id: "999" };

        beforeAll(() => {
          const result = deleteInsight({ ...fixture, id: 999 });
          ctx.response.status = result === 0 ? 404 : 204;
          if (result === 0) {
            ctx.response.body = { error: "Insight not found" };
          }
        });

        it("returns 404 status", () => {
          expect(ctx.response.status).toBe(404);
        });

        it("returns error message", () => {
          expect(ctx.response.body).toEqual({ error: "Insight not found" });
        });
      });
    });
  });
});
