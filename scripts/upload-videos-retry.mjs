/**
 * Retries uploading the large video files that previously failed due to size limit.
 */
import { createClient } from "@supabase/supabase-js";
import { createReadStream, statSync } from "fs";
import { resolve, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const SUPABASE_URL = "https://tmczhiaehonyxwhungsj.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY3poaWFlaG9ueXh3aHVuZ3NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYzMDUzNCwiZXhwIjoyMDk2MjA2NTM0fQ.ZVOlsHh6MPW5tYXY5iqxa_ZiRDMohYzgdcWxevhTGrA";

const BUCKET = "videos";

const FILES = [
  {
    localPath: "public/testimonies/01-prayer-revival.mp4",
    storagePath: "testimonies/01-prayer-revival.mp4",
  },
  {
    localPath: "public/testimonies/02-testimony1.mp4",
    storagePath: "testimonies/02-testimony1.mp4",
  },
  {
    localPath: "public/videos/jlp-ministry-video-no-captions.mp4",
    storagePath: "videos/jlp-ministry-video-no-captions.mp4",
  },
];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

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

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, stream, {
      contentType: "video/mp4",
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
  console.log("=== Retrying large video uploads ===\n");

  const results = [];
  for (const file of FILES) {
    const result = await uploadFile(file);
    if (result) results.push(result);
  }

  console.log(`\n${results.length}/${FILES.length} files uploaded.`);
};

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
