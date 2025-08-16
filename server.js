import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static(".")); // overlay.html ko serve karega

// Render me ENV me set karoge: MATCH_JSON_URL
const DEFAULT_URL = process.env.MATCH_JSON_URL || "";

function pick(v, ...keys) {
  for (const k of keys) {
    if (v && v[k] != null) return v[k];
  }
  return undefined;
}

app.get("/score", async (req, res) => {
  try {
    const url = req.query.url || DEFAULT_URL;
    if (!url) return res.status(400).json({ error: "Missing url" });

    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    const j = await r.json();

    const data = j?.pageProps?.miniScorecard?.data || {};
    const innings = (data.innings && data.innings[0]) || {};

    const summary = innings.summary || {};
    const batsmen = innings.batsmen || innings.batsman || [];
    const bowler = (innings.bowlers && innings.bowlers[0]) || {};

    const striker = batsmen.find(p => p?.striker) || batsmen[0] || {};
    const nonStriker = batsmen.find(p => !p?.striker && p !== striker) || batsmen[1] || {};

    const resp = {
      team: pick(data.team_a, "name", "short_name"),
      score: pick(summary, "score") || "",
      overs: (pick(summary, "over") || "").replace(/[()]/g, ""), // e.g. "1.3 Ov" -> "1.3 Ov"
      rr: pick(summary, "rr") || "",
      crr: pick(summary, "crr") || "",

      striker: pick(striker, "player_name", "name"),
      strikerRuns: pick(striker, "runs", "r"),
      strikerBalls: pick(striker, "balls", "b"),

      nonStriker: pick(nonStriker, "player_name", "name"),
      nonStrikerRuns: pick(nonStriker, "runs", "r"),
      nonStrikerBalls: pick(nonStriker, "balls", "b"),

      bowler: pick(bowler, "player_name", "name"),
      bowlerWkts: pick(bowler, "wickets", "w"),
      bowlerRuns: pick(bowler, "runs", "r"),
      bowlerOvers: pick(bowler, "overs", "o")
    };

    return res.json(resp);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch CricHeroes data" });
  }
});

// root par overlay khole
app.get("/", (_req, res) => res.redirect("/overlay.html"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on ${PORT}`));
