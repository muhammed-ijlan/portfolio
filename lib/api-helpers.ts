import type { Model, QueryFilter } from "mongoose";
import { connectDB } from "./db";
import { requireAuth } from "./auth";

/* ---------- JSON response helpers ---------- */
export function ok(data: unknown, init?: ResponseInit) {
  return Response.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: unknown) {
  return Response.json({ ok: false, error: message, ...(extra ? { extra } : {}) }, { status });
}

// Public read responses: same envelope, but with a CDN cache header so the
// portfolio site's content reads are cheap (fresh from DB, cached at the edge).
export function okCached(data: unknown, seconds = 60) {
  return Response.json(
    { ok: true, data },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 5}`,
      },
    }
  );
}

// Map a lean()'d Mongo doc's `_id` to a string `id` (and drop _id).
export function mapId<T extends Record<string, unknown>>(d: T) {
  const { _id, ...rest } = d;
  return { id: String(_id), ...rest };
}

// Normalise thrown errors (Mongoose validation, bad JSON, missing URI…) into a
// clean JSON response so route handlers can just `try { … } catch (e) { return handleError(e) }`.
export function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : "Unexpected error";
  // AuthError (and any error carrying an explicit `status`) maps straight through.
  if (err && typeof err === "object" && "status" in err && typeof err.status === "number") {
    return fail(message, err.status);
  }
  if (message.includes("MONGODB_URI is not set")) return fail(message, 503);
  if (message.includes("AUTH_SECRET is not set")) return fail(message, 503);
  if (message.includes("CLOUDINARY_URL is not set")) return fail(message, 503);
  // CastError → bad ObjectId in the URL.
  if (err && typeof err === "object" && "name" in err && err.name === "CastError") {
    return fail("Invalid id", 400);
  }
  if (err && typeof err === "object" && "name" in err && err.name === "ValidationError") {
    return fail(message, 422);
  }
  console.error("[api]", err);
  return fail(message, 500);
}

async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

/* ---------- Generic CRUD for a top-level collection ---------- */
// Returns { list, create } for the collection route (GET/POST) and
// { getOne, update, remove } for the item route (GET/PUT/DELETE on [id]).
export function crud<T>(getModel: () => Model<T>) {
  // Every CMS CRUD operation requires an authenticated admin. Public reads go
  // through the /api/portfolio/* routes instead.
  return {
    async list() {
      await requireAuth();
      await connectDB();
      const docs = await getModel().find().sort({ createdAt: -1 }).lean({ virtuals: true });
      // lean() keeps _id; map it to id to match the API shape.
      const data = docs.map((d) => mapId(d));
      return ok(data);
    },

    async create(req: Request) {
      await requireAuth();
      await connectDB();
      const body = await readJson(req);
      const doc = await getModel().create(body);
      return ok(doc.toJSON(), { status: 201 });
    },

    async getOne(id: string) {
      await requireAuth();
      await connectDB();
      const doc = await getModel().findById(id);
      if (!doc) return fail("Not found", 404);
      return ok(doc.toJSON());
    },

    async update(id: string, req: Request) {
      await requireAuth();
      await connectDB();
      const body = await readJson(req);
      delete (body as Record<string, unknown>).id;
      const doc = await getModel().findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return fail("Not found", 404);
      return ok(doc.toJSON());
    },

    async remove(id: string) {
      await requireAuth();
      await connectDB();
      const doc = await getModel().findByIdAndDelete(id);
      if (!doc) return fail("Not found", 404);
      return ok({ id });
    },
  };
}

/* ---------- Singleton (About / Settings) ---------- */
export function singleton<T>(getModel: () => Model<T>, defaults: Partial<T>) {
  const filter = { key: "singleton" } as unknown as QueryFilter<T>;
  return {
    async get() {
      await requireAuth();
      await connectDB();
      const doc = await getModel().findOneAndUpdate(
        filter,
        { $setOnInsert: { ...defaults, key: "singleton" } },
        { new: true, upsert: true }
      );
      return ok(doc!.toJSON());
    },

    async put(req: Request) {
      await requireAuth();
      await connectDB();
      const body = await readJson(req);
      delete (body as Record<string, unknown>).id;
      const doc = await getModel().findOneAndUpdate(
        filter,
        { $set: body },
        { new: true, upsert: true, runValidators: true }
      );
      return ok(doc!.toJSON());
    },
  };
}
