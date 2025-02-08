// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const result = createInsight({ 
      db,
      brand: body.brand,
      text: body.text
    });
    
    ctx.response.status = 201;
    ctx.response.body = result;
  } catch (error) {
    console.error("Failed to create insight:", error);
    ctx.response.status = 400;
    ctx.response.body = { error };
  }
});

router.delete("/insights/:id", (ctx) => {
  try {
    const id = Number(ctx.params.id);
    const result = deleteInsight({ db, id });

    if (result === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Insight not found" };
      return;
    }

    ctx.response.status = 204;
  } catch (error) {
    console.error("Failed to delete insight:", error);
    ctx.response.status = 400;
    ctx.response.body = { error };
  }
});

// request handlers move to controller directory

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
