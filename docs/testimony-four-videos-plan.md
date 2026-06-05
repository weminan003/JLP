# Four Testimony Compilations — Editorial Plan

**Status:** Complete (42/42 transcribed, 4 rough cuts built)  
**Source:** 42 videos in `/Volumes/T7/JLP/Testimonies`  
**Website:** `public/testimonies/*.mp4` → `#testimonies` modal player

| # | File | Duration | Clips |
|---|------|----------|-------|
| 1 | `01-healing-miracles.mp4` | ~1m 44s | 11 |
| 2 | `02-holy-spirit-fire.mp4` | ~2m 01s | 12 |
| 3 | `03-encounter-jesus.mp4` | ~2m 02s | 8 |
| 4 | `04-at-the-program.mp4` | ~1m 45s | 15 |

**T7 masters:** `/Volumes/T7/JLP/Testimonies/output/final_four/`  
**CapCut guides:** matching `.srt` files in the same folder  
**Full clip list:** `/Volumes/T7/JLP/Testimonies/FOUR_VIDEOS_PLAN.md`

---

## What the transcripts support (full 42-file analysis)

After reading the actual speech (not just filenames), these **four compilations** are the strongest fit for your site cards and the stories people are actually telling:

### 1. Healed at Recharge → *Healing & Miracles* (`encounter-camp`)

**Best clips identified**

| File | Story (from transcript) | Why include |
|------|-------------------------|-------------|
| **C6230** | Leg pain for 3 days since the program → healed in Jesus' name | Clear before/after at the gathering |
| **C6241** | Chest pain — "I was healed… thank God… Hallelujah" | Short, punchy, emotional close |
| **C6234** | Chest pain, prayer, "thank you so much" | Reinforces healing theme |
| **C6246** | In pain at program → "fresh fire" while praying | Bridges healing + fire |

**Suggested copy (website)**  
> Teenagers came in with pain that would not leave. During prayer at Supernatural Recharge, bodies lined up with what God was doing in the room.

---

### 2. Filled With Holy Fire → *Personal Transformation* (`from-darkness`)

**Best clips identified**

| File | Story | Why include |
|------|-------|-------------|
| **C6238** | Spirit of prayer; praying until 3am; "God has given me the spirit of prayer" | Strongest prayer-life transformation |
| **C6245** | Thought God was angry; could not stop praying; "blessing man… I love you Jesus" | Arc: fear → breakthrough |
| **C6237** | "Holy Spirit… Thank you Jesus Christ" | Short Holy Spirit punch (good opener/closer) |
| **C6246** | "Fresh fire" on last night of prayer | Ties to title "From Darkness to Fire" |

**Suggested copy**  
> What started as distance and fear became fire they could not shut off — nights of prayer, tears, and a hunger that did not go home with them.

---

### 3. Jesus Found Me → *Faith & Breakthrough* (`answered-prayer`)

**Best clips identified**

| File | Story | Why include |
|------|-------|-------------|
| **C6242** | "I was lost… praying… Jesus speaking to me now" | Direct salvation/encounter language |
| **C6244** | Tears at altar; "this is how I can spread God's people" | Emotional, mission-focused |
| **C6243** | Shocked when sent out; "over to you, Jesus" | Surrender moment |
| **C6240** | "Christ Jesus came" | Short Christ-centered line |

**Suggested copy**  
> Jesus stopped being a story on a stage and became a voice they could hear — in prayer, in tears, and in a yes they could not take back.

---

### 4. At Supernatural Recharge → *Youth & Schools* (`school-revival`)

**Best clips identified**

| File | Story | Why include |
|------|-------|-------------|
| **C6231** | Pressure around English/speaking; asked leader to "touch me and teach me" at service | Very human youth moment at the program |
| **C6236** | Sincere prayer — "I don't know why I was praying… Amen" | Authentic in-the-room feel |
| **C6230** | "Since I came from this program" | Anchors story to the event |
| **C6232** | "Glory for what's in your heart" | Short worship-tone bridge |

**Suggested copy**  
> Not every moment is dramatic — some are a teenager finally brave enough to ask for help, in front of their peers, at Supernatural Recharge.

---

## Files to deprioritize (for these four cuts)

- **C6239, C6243** (partial): Whisper echoed the prompt — verify audio before using
- **C6235**: Very short, unclear ("Book of denke") — skip unless B-roll only
- **C6240**: Garbled — use only if visual carries it

When all **42** transcripts finish, re-run the builder — likely 8–12 more strong stories (especially **C6256**, the longest at ~3.8 min).

---

## Build commands (when T7 drive is connected)

```bash
cd "/Volumes/T7/JLP/Testimonies"

# Finish transcription
python3 scripts/transcribe_parallel.py

# Build all four rough cuts + metadata
python3 scripts/build_four_compilations.py
```

**Outputs**

| Output | Purpose |
|--------|---------|
| `output/final_four/01-healing-miracles.mp4` | Rough cut 1 |
| `output/final_four/02-holy-spirit-fire.mp4` | Rough cut 2 |
| `output/final_four/03-encounter-jesus.mp4` | Rough cut 3 |
| `output/final_four/04-at-the-program.mp4` | Rough cut 4 |
| `*.srt` next to each | CapCut caption guide |
| `FOUR_VIDEOS_PLAN.md` | Clip list with timestamps |
| `website_testimonies.json` | Titles, categories, durations for the site |

---

## CapCut finishing (your pass)

1. Import each `0X-*.mp4` — trim 0.5–1s at joins  
2. Music under dialogue (~-18 to -22 dB)  
3. Optional: title card 1s — compilation name  
4. Export 1080p → copy to `public/testimonies/` in the Next.js repo  

---

## Website hook-up (next step after export)

Map each MP4 to `FeaturedWorksSection` cards and play video in the fullscreen modal instead of a static image only.
