import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; // Dynamic port for Vercel

// Set up middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Render the homepage with default values
app.get("/", (req, res) => {
  res.render("index", { data: null, error: null });
});

// Handle search form submission
app.post("/", async (req, res) => {
  try {
    const type = req.body.meal;
    console.log(`Fetching recipes for: ${type}`);

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${type}`
    );

    console.log("API Response:", response.data);

    const result = response.data;

    if (!result.meals || result.meals.length === 0) {
      console.log("No meals found.");
      return res.render("index", {
        data: null,
        error: "No recipes found. Try another search!",
      });
    }

    console.log(`Found ${result.meals.length} meals.`);
    res.render("index", { data: result, error: null });
  } catch (error) {
    console.error("Failed to fetch recipes:", error.message);
    res.render("index", {
      data: null,
      error: "Something went wrong. Please try again later.",
    });
  }
});

// Display detailed recipe when a recipe card is clicked
app.get("/recipe/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );
    const result = response.data;

    if (!result.meals) {
      return res.render("recipe", { data: null, error: "Recipe not found." });
    }

    res.render("recipe", { data: result, error: null });
  } catch (error) {
    console.error("Failed to fetch recipe:", error.message);
    res.render("recipe", { data: null, error: "Recipe not found." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
