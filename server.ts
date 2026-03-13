import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("/tmp/gadgets.db");
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const geminiKeyPreview = process.env.GEMINI_API_KEY
  ? `${process.env.GEMINI_API_KEY.slice(0, 6)}...${process.env.GEMINI_API_KEY.slice(-4)}`
  : "missing";

console.log(`[startup] GEMINI_API_KEY loaded: ${!!process.env.GEMINI_API_KEY} (${geminiKeyPreview})`);

// Initialize database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      brand TEXT,
      image TEXT,
      starting_price REAL,
      specs TEXT,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT,
      platform TEXT,
      price REAL,
      original_price REAL,
      type TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      product_id TEXT NOT NULL,
      target_price REAL,
      last_notified_price REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);
  console.log("Database initialized at /tmp/gadgets.db");
} catch (e) {
  console.error("Database initialization failed:", e);
}

// Migration: Ensure 'specs' column exists in 'products' table
try {
  db.prepare("SELECT specs FROM products LIMIT 1").get();
} catch (e) {
  console.log("Adding missing 'specs' column to 'products' table...");
  db.exec("ALTER TABLE products ADD COLUMN specs TEXT");
}

// Migration: Ensure 'image' column exists in 'products' table
try {
  db.prepare("SELECT image FROM products LIMIT 1").get();
} catch (e) {
  console.log("Adding missing 'image' column to 'products' table...");
  db.exec("ALTER TABLE products ADD COLUMN image TEXT");
}

function requireAi(res: express.Response) {
  if (!ai) {
    res.status(500).json({ error: "Gemini API key is not configured on the server" });
    return null;
  }

  return ai;
}

function safeJsonParse<T>(value: string | undefined | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function buildProductId(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/search", async (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) return res.status(400).json({ error: "Query required" });

    const gemini = requireAi(res);
    if (!gemini) return;

    try {
      const cachedProductId = buildProductId(query);
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(cachedProductId) as any;

      if (product) {
        const lastUpdated = new Date(product.last_updated).getTime();
        const isFresh = (Date.now() - lastUpdated) < 1000 * 60 * 60;

        if (isFresh) {
          const deals = db.prepare("SELECT * FROM deals WHERE product_id = ?").all(cachedProductId) as any[];
          return res.json({
            product: {
              id: product.id,
              name: product.name,
              brand: product.brand,
              image: product.image || `https://picsum.photos/seed/${encodeURIComponent(query)}/400/400`,
              startingPrice: product.starting_price,
              specs: safeJsonParse(product.specs) || {}
            },
            deals: deals.map((deal) => ({
              id: deal.id.toString(),
              platform: deal.platform,
              price: deal.price,
              originalPrice: deal.original_price ?? undefined,
              type: deal.type,
              status: deal.status,
              details: deal.details ?? undefined,
              location: deal.location ?? undefined,
              url: deal.url ?? "#"
            })),
            cached: true
          });
        }
      }

      const response = await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Current prices/specs for "${query}" in Nigeria (Jumia, Slot, Jiji, CDCare, Easybuy). For each deal, provide the real direct URL to the product page on that platform.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              product: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  image: { type: Type.STRING },
                  startingPrice: { type: Type.NUMBER },
                  specs: {
                    type: Type.OBJECT,
                    properties: {
                      display: { type: Type.STRING },
                      chipset: { type: Type.STRING },
                      camera: { type: Type.STRING },
                      battery: { type: Type.STRING },
                      ram: { type: Type.STRING },
                      storage: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                required: ["name", "brand", "startingPrice", "specs"]
              },
              deals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    originalPrice: { type: Type.NUMBER },
                    status: { type: Type.STRING, enum: ["In Stock", "Pre-owned", "Approved"] },
                    type: { type: Type.STRING, enum: ["Official Store", "Marketplace", "Installment Plan"] },
                    details: { type: Type.STRING },
                    url: { type: Type.STRING },
                    installment: {
                      type: Type.OBJECT,
                      properties: {
                        monthly: { type: Type.NUMBER },
                        duration: { type: Type.STRING },
                        deposit: { type: Type.NUMBER }
                      }
                    },
                    location: { type: Type.STRING }
                  },
                  required: ["platform", "price", "status", "type", "url"]
                }
              }
            },
            required: ["product", "deals"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(502).json({ error: "Gemini returned an empty response for search" });
      }

      const parsed = JSON.parse(text) as any;
      const dynamicProduct = {
        ...parsed.product,
        id: buildProductId(query),
        image: parsed.product.image || `https://picsum.photos/seed/${encodeURIComponent(query)}/400/400`
      };

      const dynamicDeals = (parsed.deals ?? []).map((deal: any, index: number) => ({
        ...deal,
        id: `deal-${index}`
      }));

      db.prepare("INSERT INTO search_history (query) VALUES (?)").run(query);

      db.prepare(`
        INSERT INTO products (id, name, brand, image, starting_price, specs, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          brand = excluded.brand,
          image = excluded.image,
          starting_price = excluded.starting_price,
          specs = excluded.specs,
          last_updated = CURRENT_TIMESTAMP
      `).run(
        dynamicProduct.id,
        dynamicProduct.name,
        dynamicProduct.brand,
        dynamicProduct.image,
        dynamicProduct.startingPrice,
        JSON.stringify(dynamicProduct.specs || {})
      );

      db.prepare("DELETE FROM deals WHERE product_id = ?").run(dynamicProduct.id);

      const insertDeal = db.prepare(`
        INSERT INTO deals (product_id, platform, price, original_price, type, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const dealTransaction = db.transaction((deals: any[]) => {
        for (const deal of deals) {
          insertDeal.run(
            dynamicProduct.id,
            deal.platform,
            deal.price,
            deal.originalPrice || null,
            deal.type,
            deal.status
          );
        }
      });

      dealTransaction(dynamicDeals);

      res.json({
        product: dynamicProduct,
        deals: dynamicDeals,
        cached: false
      });
    } catch (error) {
      console.error("Search API error:", error);
      res.status(500).json({ error: "Failed to fetch gadget prices from Gemini" });
    }
  });

  app.get("/api/trending", async (_req, res) => {
    const gemini = requireAi(res);
    if (!gemini) return;

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "List 6 real trending gadgets in Nigeria right now (March 2026). For each, provide: name, brand, a REAL high-quality image URL from an official source or reputable tech site (e.g., gsmarena, apple.com, samsung.com), starting price in Naira (number), and key specs (display, chipset, camera, battery, ram, storage).",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                image: { type: Type.STRING },
                startingPrice: { type: Type.NUMBER },
                specs: {
                  type: Type.OBJECT,
                  properties: {
                    display: { type: Type.STRING },
                    chipset: { type: Type.STRING },
                    camera: { type: Type.STRING },
                    battery: { type: Type.STRING },
                    ram: { type: Type.STRING },
                    storage: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["display", "chipset", "camera", "battery"]
                }
              },
              required: ["id", "name", "brand", "image", "startingPrice", "specs"]
            }
          }
        }
      });

      if (!response.text) {
        return res.status(502).json({ error: "Gemini returned an empty response for trending products" });
      }

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Trending products API error:", error);
      res.status(500).json({ error: "Failed to fetch trending products from Gemini" });
    }
  });

  app.get("/api/trending-tags", async (_req, res) => {
    const gemini = requireAi(res);
    if (!gemini) return;

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "List 5 real trending gadget names or categories specifically in Nigeria right now (March 2026). Return only a JSON array of strings.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      if (!response.text) {
        return res.status(502).json({ error: "Gemini returned an empty response for trending tags" });
      }

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Trending tags API error:", error);
      res.status(500).json({ error: "Failed to fetch trending tags from Gemini" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const gemini = requireAi(res);
    if (!gemini) return;

    try {
      const cachedProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
      if (cachedProduct) {
        return res.json({
          id: cachedProduct.id,
          name: cachedProduct.name,
          brand: cachedProduct.brand,
          image: cachedProduct.image || `https://picsum.photos/seed/${encodeURIComponent(id)}/400/400`,
          startingPrice: cachedProduct.starting_price,
          specs: safeJsonParse(cachedProduct.specs) || {}
        });
      }

      const response = await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide detailed specifications for the gadget with ID or name: "${id}". Return real, accurate data for March 2026. Include: name, brand, a REAL high-quality image URL from an official source or reputable tech site, starting price in Naira (number), and key specs (display, chipset, camera, battery, ram, storage).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              brand: { type: Type.STRING },
              image: { type: Type.STRING },
              startingPrice: { type: Type.NUMBER },
              specs: {
                type: Type.OBJECT,
                properties: {
                  display: { type: Type.STRING },
                  chipset: { type: Type.STRING },
                  camera: { type: Type.STRING },
                  battery: { type: Type.STRING },
                  ram: { type: Type.STRING },
                  storage: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["display", "chipset", "camera", "battery"]
              }
            },
            required: ["id", "name", "brand", "image", "startingPrice", "specs"]
          }
        }
      });

      if (!response.text) {
        return res.status(502).json({ error: "Gemini returned an empty response for product details" });
      }

      const productData = JSON.parse(response.text) as any;
      const productId = buildProductId(productData.id || id);
      const normalizedProduct = {
        ...productData,
        id: productId,
        image: productData.image || `https://picsum.photos/seed/${encodeURIComponent(id)}/400/400`
      };

      db.prepare(`
        INSERT INTO products (id, name, brand, image, starting_price, specs, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          brand = excluded.brand,
          image = excluded.image,
          starting_price = excluded.starting_price,
          specs = excluded.specs,
          last_updated = CURRENT_TIMESTAMP
      `).run(
        normalizedProduct.id,
        normalizedProduct.name,
        normalizedProduct.brand,
        normalizedProduct.image,
        normalizedProduct.startingPrice,
        JSON.stringify(normalizedProduct.specs || {})
      );

      res.json(normalizedProduct);
    } catch (error) {
      console.error("Product details API error:", error);
      res.status(500).json({ error: "Failed to fetch product details from Gemini" });
    }
  });

  app.get("/api/search-cache", (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query required" });

    const productId = (query as string).toLowerCase().replace(/ /g, '-');

    try {
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId) as any;
      
      if (product) {
        // Check if data is fresh (less than 1 hour old)
        const lastUpdated = new Date(product.last_updated).getTime();
        const now = new Date().getTime();
        const isFresh = (now - lastUpdated) < 1000 * 60 * 60; // 1 hour

        if (isFresh) {
          const deals = db.prepare("SELECT * FROM deals WHERE product_id = ?").all(productId);
          return res.json({ 
            cached: true,
            product: {
              id: product.id,
              name: product.name,
              brand: product.brand,
              image: product.image,
              startingPrice: product.starting_price,
              specs: JSON.parse(product.specs || '{}')
            }, 
            deals: (deals ?? []).map((d: any) => ({
              ...d,
              platformLogo: `https://picsum.photos/seed/${encodeURIComponent(d.platform)}/40/40`
            }))
          });
        }
      }
      
      res.json({ cached: false });
    } catch (error) {
      res.status(500).json({ error: "Cache check failed" });
    }
  });

  app.post("/api/search-results", (req, res) => {
    const { product, deals, query } = req.body;

    try {
      // Save search history
      db.prepare("INSERT INTO search_history (query) VALUES (?)").run(query);

      // Save/Update product
      db.prepare(`
        INSERT INTO products (id, name, brand, image, starting_price, specs, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          brand = excluded.brand,
          image = excluded.image,
          starting_price = excluded.starting_price,
          specs = excluded.specs,
          last_updated = CURRENT_TIMESTAMP
      `).run(product.id, product.name, product.brand, product.image || null, product.startingPrice, JSON.stringify(product.specs));

      // Save deals
      const insertDeal = db.prepare(`
        INSERT INTO deals (product_id, platform, price, original_price, type, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction((dealsList) => {
        for (const deal of dealsList) {
          insertDeal.run(
            product.id,
            deal.platform,
            deal.price,
            deal.originalPrice || null,
            deal.type,
            deal.status
          );
        }
      });

      transaction(deals ?? []);

      res.json({ status: "success" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save results" });
    }
  });

  app.get("/api/analysis/:productId", (req, res) => {
    const { productId } = req.params;

    try {
      const deals = db.prepare(`
        SELECT platform, price, timestamp 
        FROM deals 
        WHERE product_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 20
      `).all(productId) as any[];

      // Generate mock 7-day history if not enough data
      const history = [];
      const now = new Date();
      
      if (deals.length > 0) {
        const basePrice = deals[0].price;
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          // Random variation around base price for demo purposes
          const variation = (Math.random() - 0.5) * 0.05; // 5% variation
          history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(basePrice * (1 + variation))
          });
        }
      }

      if (deals.length === 0) {
        return res.json({ 
          message: "No data for analysis",
          history: [] 
        });
      }

      const prices = (deals ?? []).map(d => d.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      const latestPrice = deals[0].price;
      const previousAvg = deals.length > 1 
        ? deals.slice(1).reduce((a, b) => a + b, 0) / (deals.length - 1)
        : latestPrice;
      
      const trend = latestPrice < previousAvg ? "down" : latestPrice > previousAvg ? "up" : "stable";

      res.json({
        avgPrice,
        minPrice,
        maxPrice,
        trend,
        dataPoints: deals.length,
        bestPlatform: deals.reduce((prev, curr) => prev.price < curr.price ? prev : curr).platform,
        history
      });
    } catch (error) {
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  app.get("/api/suggestions", (req, res) => {
    const { query } = req.query;

    try {
      let suggestions;
      if (!query) {
        // Return most recent searches if no query
        suggestions = db.prepare(`
          SELECT DISTINCT query 
          FROM search_history 
          ORDER BY timestamp DESC 
          LIMIT 10
        `).all() as any[];
      } else {
        suggestions = db.prepare(`
          SELECT DISTINCT query 
          FROM search_history 
          WHERE query LIKE ? 
          ORDER BY timestamp DESC 
          LIMIT 5
        `).all(`%${query}%`) as any[];
      }

      res.json(suggestions.map(s => s.query));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  app.get("/api/compare/:p1/:p2", (req, res) => {
    const { p1, p2 } = req.params;

    try {
      const getStats = (id: string) => {
        return db.prepare(`
          SELECT 
            AVG(price) as avgPrice,
            MIN(price) as minPrice,
            MAX(price) as maxPrice,
            COUNT(*) as dataPoints
          FROM deals 
          WHERE product_id = ?
        `).get(id) as any;
      };

      const stats1 = getStats(p1);
      const stats2 = getStats(p2);

      res.json({
        product1: stats1,
        product2: stats2,
        priceDifference: Math.abs((stats1?.avgPrice || 0) - (stats2?.avgPrice || 0)),
        betterValue: (stats1?.avgPrice || Infinity) < (stats2?.avgPrice || Infinity) ? p1 : p2
      });
    } catch (error) {
      res.status(500).json({ error: "Comparison failed" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!resend) {
      console.error("Resend API key missing");
      return res.status(500).json({ error: "Email service not configured" });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "GadgetPrice Contact <onboarding@resend.dev>",
        to: "adelakinisrael024@gmail.com",
        subject: `New Contact Form Message from ${name}`,
        html: `
          <h3>New Message from Contact Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(400).json({ error });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("Contact API error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/deals/filter", (req, res) => {
    const { productId, minPrice, maxPrice, platformType } = req.query;

    try {
      let query = "SELECT * FROM deals WHERE 1=1";
      const params: any[] = [];

      if (productId) {
        query += " AND product_id = ?";
        params.push(productId);
      }
      if (minPrice) {
        query += " AND price >= ?";
        params.push(Number(minPrice));
      }
      if (maxPrice) {
        query += " AND price <= ?";
        params.push(Number(maxPrice));
      }
      if (platformType) {
        query += " AND type = ?";
        params.push(platformType);
      }

      query += " ORDER BY price ASC";

      const deals = db.prepare(query).all(...params);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ error: "Filtering failed" });
    }
  });

  app.post("/api/wishlist", (req, res) => {
    const { email, productId, targetPrice } = req.body;
    if (!email || !productId) return res.status(400).json({ error: "Email and Product ID required" });

    try {
      db.prepare(`
        INSERT INTO wishlist (email, product_id, target_price)
        VALUES (?, ?, ?)
      `).run(email, productId, targetPrice || null);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.get("/api/wishlist/:email", (req, res) => {
    const { email } = req.params;
    try {
      const items = db.prepare(`
        SELECT w.*, p.name, p.brand, p.starting_price, p.image
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.email = ?
      `).all(email);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM wishlist WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  app.post("/api/wishlist/check-prices", async (req, res) => {
    if (!resend) return res.status(500).json({ error: "Email service not configured" });

    try {
      const wishlistItems = db.prepare(`
        SELECT w.*, p.name, p.brand
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
      `).all() as any[];

      const notificationsSent = [];

      for (const item of wishlistItems) {
        // Get the latest best price for this product
        const bestDeal = db.prepare(`
          SELECT MIN(price) as minPrice, platform
          FROM deals
          WHERE product_id = ?
          GROUP BY product_id
        `).get(item.product_id) as any;

        if (bestDeal && bestDeal.minPrice) {
          const currentPrice = bestDeal.minPrice;
          const targetPrice = item.target_price;
          const lastPrice = item.last_notified_price;

          // Notify if price is below target OR if it dropped since last notification
          const shouldNotify = (targetPrice && currentPrice <= targetPrice) || 
                               (lastPrice && currentPrice < lastPrice);

          if (shouldNotify && currentPrice !== lastPrice) {
            await resend.emails.send({
              from: "GadgetPrice Alerts <alerts@resend.dev>",
              to: item.email,
              subject: `Price Drop Alert: ${item.name}`,
              html: `
                <h2>Good news!</h2>
                <p>The price for <strong>${item.name}</strong> has dropped!</p>
                <p>Current best price: <strong>₦${currentPrice.toLocaleString()}</strong> on ${bestDeal.platform}</p>
                ${targetPrice ? `<p>Your target price was: ₦${targetPrice.toLocaleString()}</p>` : ''}
                <p><a href="${process.env.APP_URL}/product/${item.product_id}">View Deal</a></p>
              `,
            });

            // Update last notified price
            db.prepare("UPDATE wishlist SET last_notified_price = ? WHERE id = ?").run(currentPrice, item.id);
            notificationsSent.push({ email: item.email, product: item.name, price: currentPrice });
          }
        }
      }

      res.json({ success: true, notificationsSent });
    } catch (error) {
      console.error("Price check error:", error);
      res.status(500).json({ error: "Price check failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
