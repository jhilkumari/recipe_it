import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res)  {
  res.render("index.ejs");
});


app.post("/", async (req, res) => { 
  try {
    const type = req.body["meal"];
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${type}`
    );
    const result = response.data;
    
    res.render("index.ejs", {
      data: result,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No recipe.",
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});