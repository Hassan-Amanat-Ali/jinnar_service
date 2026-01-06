import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOMAIN = "https://jinnar.com";
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

// Generate sitemap XML
function generateSitemap() {
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

  xml += "</urlset>";

  return xml;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemap, "utf8");

    console.log("✅ Sitemap generated successfully!");
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${routes.length}`);
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
