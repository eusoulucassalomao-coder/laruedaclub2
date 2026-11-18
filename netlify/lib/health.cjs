const { supabase } = require("./supabase.cjs");

module.exports = async function health(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method" });
  }

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", "laruedita")
      .maybeSingle();

    if (error || !data) {
      console.error("health-check", error || "restaurant-not-seeded");
      return res.status(503).json({ ok: false, database: "unavailable" });
    }

    return res.status(200).json({ ok: true, database: "connected" });
  } catch (error) {
    console.error("health-check", error);
    return res.status(503).json({ ok: false, database: "unavailable" });
  }
};
