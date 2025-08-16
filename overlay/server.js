import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static(".")); // overlay.html serve karega

const PORT = process.env.PORT || 3000;

// ✅ Apna MATCH ID yahan badlo
const MATCH_ID = "18754689";  
const API_URL = `https://cricheroes.com/_next/data/Gwn-9wsDkpg5k-2hvyhaR/scorecard/${MATCH_ID}/individual.json`;

app.get("/score", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    const data = json.pageProps.miniScorecard.data;

    const teamA = data.team_a?.name || "Team A";
    const teamB = data.team_b?.name || "Team B";

    const innings = data.innings?.[0] || {};
    const summary = innings.summary || {};

    const batsmen = innings.batsmen || [];
    const striker = batsmen.find(p => p.striker) || batsmen[0] || {};
    const nonStriker = batsmen.find(p => !p.striker) || batsmen[1] || {};

    const bowler = (innings.bowlers && innings.bowlers[0]) || {};

    res.json({
      batting: teamA,
      bowling: teamB,
      score: summary.score || "--/--",
      overs: summary.over || "0.0",
      rr: summary.rr || "0.0",
      crr: summary.crr || "0.0",

      striker: striker.player_name || "-",
      strikerRuns: striker.runs || 0,
      strikerBalls: striker.balls || 0,

      nonStriker: nonStriker.player_name || "-",
      nonStrikerRuns: nonStriker.runs || 0,
      nonStrikerBalls: nonStriker.balls || 0,

      bowler: bowler.player_name || "-",
      bowlerRuns: bowler.runs || 0,
      bowlerWkts: bowler.wickets || 0,
      bowlerOvers: bowler.overs || "0.0"
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch score" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
