const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/score", async (req, res) => {
  try {
    const response = await fetch("https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json");
    const json = await response.json();

    const match = json?.pageProps?.data?.scorecard;
    const team = match?.teams?.[0]; // Pehli team
    const batsmen = team?.batting?.batsmen || [];
    const bowler = team?.bowling?.bowlers?.[0] || {};

    const data = {
      team: team?.name || "-",
      score: team?.score || "-",
      overs: team?.overs || "-",
      rr: match?.rr || "-",
      crr: match?.crr || "-",
      striker: batsmen[0]?.name || "-",
      strikerRuns: batsmen[0]?.runs || 0,
      strikerBalls: batsmen[0]?.balls || 0,
      nonStriker: batsmen[1]?.name || "-",
      nonStrikerRuns: batsmen[1]?.runs || 0,
      nonStrikerBalls: batsmen[1]?.balls || 0,
      bowler: bowler?.name || "-",
      bowlerWkts: bowler?.wkts || 0,
      bowlerRuns: bowler?.runs || 0,
      bowlerOvers: bowler?.overs || "0.0",
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
