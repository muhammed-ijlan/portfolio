import type { Model, QueryFilter } from "mongoose";
import { connectDB } from "./db";
import { requireAuth } from "./auth";
import { destroyByUrl } from "./cloudinary";

export function ok(data: unknown, init?: ResponseInit) {
  return Response.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: unknown) {
  return Response.json({ ok: false, error: message, ...(extra ? { extra } : {}) }, { status });
}

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

export function mapId<T extends Record<string, unknown>>(d: T) {
  const { _id, ...rest } = d;
  return { id: String(_id), ...rest };
}

export function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : "Unexpected error";
  if (err && typeof err === "object" && "status" in err && typeof err.status === "number") {
    return fail(message, err.status);
  }
  if (message.includes("MONGODB_URI is not set")) return fail(message, 503);
  if (message.includes("AUTH_SECRET is not set")) return fail(message, 503);
  if (message.includes("CLOUDINARY_URL is not set")) return fail(message, 503);
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

// `cloudinaryFields` lists document fields holding Cloudinary URLs. On delete the
// assets are removed from storage; on update, a changed field's old asset is removed.
export function crud<T>(getModel: () => Model<T>, opts?: { cloudinaryFields?: string[] }) {
  const cloudFields = opts?.cloudinaryFields ?? [];
  return {
    async list() {
      await requireAuth();
      await connectDB();
      const docs = await getModel().find().sort({ createdAt: -1 }).lean({ virtuals: true });
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
      const body = (await readJson(req)) as Record<string, unknown>;
      delete body.id;
      // Snapshot the old asset URLs before the write so we can clean up replaced ones.
      const before =
        cloudFields.length > 0
          ? await getModel().findById(id).lean<Record<string, unknown>>()
          : null;
      const doc = await getModel().findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return fail("Not found", 404);
      if (before) {
        const next = doc.toJSON() as Record<string, unknown>;
        for (const f of cloudFields) {
          const oldUrl = before[f];
          if (typeof oldUrl === "string" && oldUrl && oldUrl !== next[f]) {
            await destroyByUrl(oldUrl);
          }
        }
      }
      return ok(doc.toJSON());
    },

    async remove(id: string) {
      await requireAuth();
      await connectDB();
      const doc = await getModel().findByIdAndDelete(id);
      if (!doc) return fail("Not found", 404);
      const data = doc.toJSON() as Record<string, unknown>;
      for (const f of cloudFields) {
        if (typeof data[f] === "string") await destroyByUrl(data[f] as string);
      }
      return ok({ id });
    },
  };
}

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
