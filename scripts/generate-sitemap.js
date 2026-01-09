import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOMAIN = "https://jinnar.com";
const API_URL = process.env.API_URL || "https://api.jinnar.com";
const OUTPUT_PATH = path.join(__dirname, "../public/sitemap.xml");

// Define all public routes with their metadata
const routes = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly",
    description: "Landing Page - Main entry point",
  },
  {
    path: "/landing-services",
    priority: "0.9",
    changefreq: "weekly",
    description: "All Services - Service catalog",
  },
  {
    path: "/what-is-jinnar",
    priority: "0.8",
    changefreq: "monthly",
    description: "What is Jinnar - Platform introduction",
  },
  {
    path: "/what-is-jinnar/detailed",
    priority: "0.7",
    changefreq: "monthly",
    description: "Detailed Jinnar Information",
  },
  {
    path: "/how-training-works",
    priority: "0.8",
    changefreq: "monthly",
    description: "How Training Works - Training program info",
  },
  {
    path: "/help",
    priority: "0.8",
    changefreq: "weekly",
    description: "Help Center - Support and FAQ",
  },
  {
    path: "/privacy-policy",
    priority: "0.6",
    changefreq: "monthly",
    description: "Privacy Policy",
  },
  {
    path: "/terms-condition",
    priority: "0.6",
    changefreq: "monthly",
    description: "Terms and Conditions",
  },
  {
    path: "/about-us",
    priority: "0.8",
    changefreq: "monthly",
    description: "About Us - Company information",
  },
  {
    path: "/landing-workers",
    priority: "0.9",
    changefreq: "daily",
    description: "Workers Listing - Browse available workers",
  },
];

// Fetch all workers from API
async function fetchWorkers() {
  console.log("🔄 Fetching worker profiles from API...");
  const workers = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await axios.get(`${API_URL}/api/workers/find`, {
        params: {
          page,
          limit: 50,
          role: "seller", // Ensure we only get sellers/workers
        },
      });

      if (response.data.success) {
        const { data, pagination } = response.data;
        workers.push(...data);
        totalPages = pagination.totalPages;
        console.log(
          `   - Fetched page ${page}/${totalPages} (${data.length} workers)`
        );
        page++;
      } else {
        console.error("   ❌ Failed to fetch page", page, response.data);
        break;
      }
    } while (page <= totalPages);

    console.log(`✅ Total workers found: ${workers.length}`);
    return workers;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.warn(
        `   ⚠️  Could not connect to API at ${API_URL}. skipping worker profiles.`
      );
      console.warn(
        `       Make sure the backend is running if you want to include worker pages.`
      );
    } else {
      console.error("   ❌ Error fetching workers:", error.message);
    }
    return [];
  }
}

// Generate sitemap XML
async function generateSitemap() {
  const currentDate = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach((route) => {
    xml += "  <url>\n";
    xml += `    <loc>${DOMAIN}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  // Add worker profiles
  const workers = await fetchWorkers();
  workers.forEach((worker) => {
    xml += "  <url>\n";
    xml += `    <loc>${DOMAIN}/landing-worker-profile/${worker.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += "  </url>\n";
  });

  xml += "</urlset>";

  return xml;
}

// Write sitemap to file
async function writeSitemap() {
  try {
    const sitemap = await generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemap, "utf8");

    console.log("✅ Sitemap generated successfully!");
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    // Count isn't easily available since routes is separate from workers now, but we can approximate or parse
    // console.log(`📊 Total URLs: ${routes.length}`);

    console.log("\n📋 Included URLs:");
    routes.forEach((route) => {
      console.log(`   - ${DOMAIN}${route.path} (${route.description})`);
    });
    console.log(
      "\n🌐 Sitemap will be available at: https://jinnar.com/sitemap.xml"
    );
    console.log("\n💡 Next steps:");
    console.log("   1. Deploy your site");
    console.log("   2. Verify sitemap at https://jinnar.com/sitemap.xml");
    console.log("   3. Submit to Google Search Console");
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    process.exit(1);
  }
}

// Run the generator
writeSitemap();
