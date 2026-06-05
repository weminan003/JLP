/**
 * Uploads all local video files to Supabase Storage.
 * Run with: node scripts/upload-videos.mjs
 *
 * Requires a .env.local file (or environment variables) with:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_KEY=...
 */
import { createClient } from "@supabase/supabase-js";
import { createReadStream, statSync, readFileSync } from "fs";
import { resolve, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

/** Load .env.local into process.env if not already set by the shell */
const loadEnvLocal = () => {
  const envPath = resolve(ROOT, ".env.local");
  try {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* .env.local is optional when vars are already in the environment */
  }
};

loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.\n" +
      "Add them to .env.local or set them as environment variables."
  );
  process.exit(1);
}

const BUCKET = "videos";

/** All files to upload: { localPath, storagePath } */
const FILES = [
  /* Testimony videos */
  {
    localPath: "public/testimonies/01-prayer-revival.mp4",
    storagePath: "testimonies/01-prayer-revival.mp4",
  },
  {
    localPath: "public/testimonies/02-testimony1.mp4",
    storagePath: "testimonies/02-testimony1.mp4",
  },
  /* Hero / background videos */
  {
    localPath: "public/hero/jlp-hero-main.mp4",
    storagePath: "hero/jlp-hero-main.mp4",
  },
  {
    localPath: "public/videos/jlp-ministry-video-no-captions.mp4",
    storagePath: "videos/jlp-ministry-video-no-captions.mp4",
  },
  {
    localPath: "public/videos/for-you-section-bg.mp4",
    storagePath: "videos/for-you-section-bg.mp4",
  },
  {
    localPath: "public/videos/scripture-moment-mighty-warrior-bg.mp4",
    storagePath: "videos/scripture-moment-mighty-warrior-bg.mp4",
  },
];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const ensureBucket = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    console.log(`Creating bucket "${BUCKET}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: null,
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`Bucket "${BUCKET}" created.\n`);
  } else {
    console.log(`Bucket "${BUCKET}" already exists.\n`);
  }
};

const uploadFile = async ({ localPath, storagePath }) => {
  const abs = resolve(ROOT, localPath);
  let size;
  try {
    size = statSync(abs).size;
  } catch {
    console.warn(`  SKIP  ${localPath} — file not found locally`);
    return null;
  }

  console.log(`⬆  ${basename(abs)}  (${formatMB(size)})`);
  console.log(`   → storage: ${BUCKET}/${storagePath}`);

  const stream = createReadStream(abs);
  const contentType = "video/mp4";

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, stream, {
      contentType,
      upsert: true,
      duplex: "half",
    });

  if (error) {
    console.error(`   ✗ FAILED: ${error.message}\n`);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`   ✓ ${data.publicUrl}\n`);
  return { storagePath, publicUrl: data.publicUrl };
};

const main = async () => {
  console.log("=== JLP Supabase Video Upload ===\n");

  await ensureBucket();

  const results = [];
  for (const file of FILES) {
    const result = await uploadFile(file);
    if (result) results.push(result);
  }

  console.log("\n=== Upload complete ===");
  console.log(`${results.length}/${FILES.length} files uploaded.\n`);

  console.log("Public URLs:");
  results.forEach(({ storagePath, publicUrl }) => {
    console.log(`  ${storagePath}`);
    console.log(`  ${publicUrl}\n`);
  });
};

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
