import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/score/:matchId/:slug", async (req, res) => {
  const { matchId, slug } = req.params;
  try {
    const url = `https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/${matchId}/individual/${slug}/live.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();

    const entry = data?.pageProps?.data?.scorecard?.[0];
    if (!entry) throw new Error("Scorecard entry missing");

    const scoreData = {
      team: entry.team?.name || "-",
      score: entry.summary?.score || entry.innings?.[0]?.summary?.score || "-",
      overs: entry.summary?.over || entry.innings?.[0]?.summary?.over || "-",
      crr: entry.summary?.rr || entry.innings?.[0]?.summary?.rr || "-"
    };

    res.json(scoreData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is working! Use /score/:matchId/:slug");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
