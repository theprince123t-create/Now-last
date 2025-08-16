import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic route: /score/:matchId
app.get("/score/:matchId", async (req, res) => {
  const { matchId } = req.params;
  try {
    // Pehle match ka JSON lo (isme slug bhi hota hai)
    const metaUrl = `https://cricheroes.com/match/${matchId}`;
    const metaResp = await fetch(metaUrl);
    const metaText = await metaResp.text();

    // Regex se slug nikal lo (slug like jaajssi-vs-jeejej)
    const slugMatch = metaText.match(/"slug":"(.*?)"/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (!slug) {
      return res.status(400).json({ error: "Slug not found" });
    }

    // Ab slug + matchId se actual score ka JSON lao
    const url = `https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/${matchId}/${slug}/live.json`;
    const response = await fetch(url);
    const data = await response.json();

    // Yaha se jo fields chahiye wo nikal lo
    const scoreData = {
      team: data?.pageProps?.data2?.scorecard?.[0]?.team?.name || "-",
      score: data?.pageProps?.data2?.scorecard?.[0]?.score || "-",
      overs: data?.pageProps?.data2?.scorecard?.[0]?.overs || "-",
      crr: data?.pageProps?.data2?.scorecard?.[0]?.crr || "-",
    };

    res.json(scoreData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running! Use /score/:matchId to get data.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
