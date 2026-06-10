import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { SEED } from "@/lib/seed-data";
import { Project } from "@/lib/models/Project";
import { Experience } from "@/lib/models/Experience";
import { Skill } from "@/lib/models/Skill";
import { Message } from "@/lib/models/Message";
import { Media } from "@/lib/models/Media";
import { About } from "@/lib/models/About";
import { Settings } from "@/lib/models/Settings";
import { ensureDefaultAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-shot seeding endpoint. Drops the CMS collections and reloads the SEED data.
// Guarded by SEED_SECRET (header `x-seed-secret` or `?secret=`). The `id` fields
// from SEED are stripped so Mongo assigns real ObjectIds.
export async function POST(req: Request) {
  try {
    const secret = process.env.SEED_SECRET;
    const provided =
      req.headers.get("x-seed-secret") ||
      new URL(req.url).searchParams.get("secret");

    if (!secret) return fail("SEED_SECRET is not set on the server", 503);
    if (provided !== secret) return fail("Unauthorized", 401);

    await connectDB();

    const strip = <T extends { id?: string }>(arr: T[]) =>
      arr.map((doc) => {
        const { id, ...rest } = doc;
        void id; // drop the seed's string id so Mongo assigns a real ObjectId
        return rest;
      });

    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Message.deleteMany({}),
      Media.deleteMany({}),
      About.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    const [projects, experience, skills, messages, media] = await Promise.all([
      Project.insertMany(strip(SEED.projects)),
      Experience.insertMany(strip(SEED.experience)),
      Skill.insertMany(strip(SEED.skills)),
      Message.insertMany(strip(SEED.messages)),
      Media.insertMany(strip(SEED.media)),
    ]);

    await About.create({ ...SEED.about, key: "singleton" });
    await Settings.create({ ...SEED.settings, key: "singleton" });

    // Bootstrap the default admin account if none exists yet.
    const admin = await ensureDefaultAdmin();

    return ok({
      seeded: {
        projects: projects.length,
        experience: experience.length,
        skills: skills.length,
        messages: messages.length,
        media: media.length,
        about: 1,
        settings: 1,
        admin: admin ? "created" : "already exists",
      },
    });
  } catch (e) {
    return handleError(e);
  }
}
