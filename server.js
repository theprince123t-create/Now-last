import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/score", async (req, res) => {
  try {
    const url = "https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json";
    const response = await fetch(url);
    const data = await response.json();

    const innings = data?.pageProps?.data?.scorecard?.teamInnings?.[0];

    if (!innings) {
      return res.json({ error: "No live data found" });
    }

    const striker = innings.batsmen?.find(b => b.isStriker);
    const nonStriker = innings.batsmen?.find(b => !b.isStriker);
    const bowler = innings.bowler;

    res.json({
      team: innings.team?.name || "-",
      score: innings.score || "-",
      overs: innings.overs || "-",
      rr: innings.rr || "-",
      crr: innings.crr || "-",
      striker: striker?.name || "-",
      strikerRuns: striker?.runs || 0,
      strikerBalls: striker?.balls || 0,
      nonStriker: nonStriker?.name || "-",
      nonStrikerRuns: nonStriker?.runs || 0,
      nonStrikerBalls: nonStriker?.balls || 0,
      bowler: bowler?.name || "-",
      bowlerWkts: bowler?.wkts || 0,
      bowlerRuns: bowler?.runs || 0,
      bowlerOvers: bowler?.overs || "0.0",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
