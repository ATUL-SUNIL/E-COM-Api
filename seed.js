// One-time catalog seed: wipes the products collection and inserts the 12
// Meridian products.
// Local:            npm run seed
// Hosted / prod:    SEED_CONFIRM=1 npm run seed
import "./env.js";
import { MongoClient } from "mongodb";

const U = "https://images.unsplash.com/"; // image base URLs (frontend adds sizing params)
const VIDEO = "https://mdn.github.io/shared-assets/videos/flower.mp4";

// category === the collection name (that's what /products/filter?category= matches on)
const products = [
  { name: "Fjell Hardshell Jacket", category: "For Unexpected Weather", price: 480, inStock: 18,
    description: "A three-layer shell that shrugs off the worst of the weather, then packs down to almost nothing.",
    images: [U + "photo-1655972670403-243839675e06", U + "photo-1654719796836-62b889d4598d"], video: VIDEO },
  { name: "Drift Down Parka", category: "For Cold Mornings", price: 620, inStock: 12,
    description: "Responsibly sourced 800-fill down and a storm hood, for the coldest starts of the year.",
    images: [U + "photo-1735856941104-e4854bade420", U + "photo-1612096536102-93f503aa2419"] },
  { name: "Tarn 30L Backpack", category: "For Long Walks", price: 220, inStock: 25,
    description: "One bag for the day hike and the overnight — balanced, weatherproof, quietly capable.",
    images: [U + "photo-1551632811-561732d1e306", U + "photo-1586022045497-31fcf76fa6cc"], video: VIDEO },
  { name: "Cairn Merino Base Layer", category: "For Cold Mornings", price: 95, inStock: 40,
    description: "Fine merino that regulates heat, resists odour, and layers cleanly under anything.",
    images: [U + "photo-1574201635302-388dd92a4c3f", U + "photo-1601379327928-bedfaf9da2d0"] },
  { name: "Ridge Trail Pant", category: "For Long Walks", price: 150, inStock: 30,
    description: "Stretch-woven and articulated to move with you across long, uneven ground.",
    images: [U + "photo-1723825001909-1e45b76a9555", U + "photo-1773293525612-13db0a0cb6f4"] },
  { name: "Solstice Sleeping Bag", category: "For Quiet Weekends", price: 340, inStock: 15,
    description: "A three-season down bag tuned for still nights beside cold water.",
    images: [U + "photo-1558477280-1bfed08ea5db", U + "photo-1496545672447-f699b503d270"] },
  { name: "Aurora Down Vest", category: "For Cold Mornings", price: 260, inStock: 22,
    description: "Core warmth without the bulk — the mid-layer you will reach for most.",
    images: [U + "photo-1636529109797-0749811c4916", U + "photo-1780969393713-6742133843b5"] },
  { name: "Summit Shell Gloves", category: "For High Places", price: 85, inStock: 50,
    description: "Waterproof, dexterous, and warm enough for exposed ridgelines.",
    images: [U + "photo-1515273283790-38b8a1dc851e", U + "photo-1611690889004-c009a7e03712"] },
  { name: "Nimbus Rain Shell", category: "For Unexpected Weather", price: 390, inStock: 20,
    description: "Featherweight rain protection that disappears into the bottom of your pack.",
    images: [U + "photo-1504616267454-5460d659c9be", U + "photo-1567955465154-078c60ff5c9e"] },
  { name: "Vantage Field Pack 18L", category: "For Quiet Weekends", price: 140, inStock: 28,
    description: "A refined everyday carry for the commute and the trailhead alike.",
    images: [U + "photo-1611010344444-5f9e4d86a6e1", U + "photo-1509762774605-f07235a08f1f"] },
  { name: "Beacon Headlamp", category: "For High Places", price: 75, inStock: 45,
    description: "Rechargeable, rain-sealed, and bright enough to find the path home.",
    images: [U + "photo-1654030056105-95d0ef394186", U + "photo-1630275383125-2ecfa5f431d5"] },
  { name: "Harbor Weekender", category: "For Quiet Weekends", price: 260, inStock: 16,
    description: "A week of kit in a carry-on — built to be thrown in a boot and forgotten.",
    images: [U + "photo-1448582649076-3981753123b5", U + "photo-1761369333007-14045c7d2890"] },
].map((p) => ({ ...p, imageUrl: p.images[0], reviews: [], categories: [] }));

async function seed() {
  // Hosts often set NODE_ENV=production. Refuse the wipe unless it is
  // explicitly confirmed so a stray `npm run seed` cannot empty live data.
  if (process.env.NODE_ENV === "production" && process.env.SEED_CONFIRM !== "1") {
    console.error("Refusing to seed in production without SEED_CONFIRM=1");
    process.exit(1);
  }
  if (!process.env.DB_URL) {
    console.error("DB_URL is not set");
    process.exit(1);
  }
  const client = await MongoClient.connect(process.env.DB_URL);
  try {
    const col = client.db().collection("products");
    const removed = await col.deleteMany({});
    const inserted = await col.insertMany(products);
    console.log(`Seed complete — removed ${removed.deletedCount} old rows, inserted ${inserted.insertedCount} Meridian products.`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
