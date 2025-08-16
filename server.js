import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic route: /score/:matchId/:slug
app.get("/score/:matchId/:slug", async (req, res) => {
  const { matchId, slug } = req.params;
  try {
    const url = `https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/${matchId}/individual/${slug}/live.json`;
    const response = await fetch(url);
    const data = await response.json();

    // yaha se jo fields chahiye wo nikal lo
    const scoreData = {
      team: data?.pageProps?.data?.scorecard?.[0]?.team?.name || "-",
      score: data?.pageProps?.data?.scorecard?.[0]?.score || "-",
      overs: data?.pageProps?.data?.scorecard?.[0]?.overs || "-",
      crr: data?.pageProps?.data?.scorecard?.[0]?.crr || "-"
    };

    res.json(scoreData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running! Use /score/:matchId/:slug to get data.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
