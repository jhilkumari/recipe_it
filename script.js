import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Render the homepage with default values
app.get("/", (req, res) => {
  res.render("index", { data: null, error: null });
});

// Handle search form submission
app.post("/", async (req, res) => {
  try {
    const type = req.body.meal;
    console.log(`Fetching recipes for: ${type}`); // Debugging input

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${type}`
    );

    console.log("API Response:", response.data); // Log entire API response

    const result = response.data;

    // Debugging: Check if result.meals exists
    if (!result.meals || result.meals.length === 0) {
      console.log("No meals found in API response.");
      return res.render("index", {
        data: null,
        error: "No recipes found. Try another search!",
      });
    }

    console.log(`Found ${result.meals.length} meals.`); // Log number of meals
    res.render("index", { data: result, error: null });
  } catch (error) {
    console.error("Failed to make request:", error.message);
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
