// Import required packages
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Dataset location
const DATA_FILE = path.join(__dirname, "data", "coffees.json");

// Read coffee records from JSON file
function getCoffees() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Save updated coffee records
function saveCoffees(coffees) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(coffees, null, 2)
    );
}

// API 1: Get all coffee records
app.get("/api/coffees", (req, res) => {
    try {
        const coffees = getCoffees();
        res.json(coffees);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load coffee records"
        });
    }
});

// API 2: Submit a coffee rating
app.post("/api/coffees/:id/vote", (req, res) => {
    try {
        const id = Number(req.params.id);
        const rating = Number(req.body.rating);

        // Validate rating
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const coffees = getCoffees();

        // Find selected coffee
        const coffee = coffees.find(item => item.id === id);

        if (!coffee) {
            return res.status(404).json({
                message: "Coffee not found"
            });
        }

        // Calculate new average rating
        const previousTotal = coffee.rating * coffee.votes;

        coffee.votes += 1;

        coffee.rating = Number(
            ((previousTotal + rating) / coffee.votes).toFixed(2)
        );

        // Save updated records
        saveCoffees(coffees);

        res.json({
            message: "Your vote was submitted successfully!",
            coffee: coffee
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to submit vote"
        });
    }
});

// API 3: Get top 10 rated coffees
app.get("/api/leaderboard", (req, res) => {
    try {
        const coffees = getCoffees();

        const topCoffees = [...coffees]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);

        res.json(topCoffees);

    } catch (error) {
        res.status(500).json({
            message: "Unable to load leaderboard"
        });
    }
});

// API 4: Search coffees
app.get("/api/search", (req, res) => {
    try {
        const query = (req.query.q || "").toLowerCase();

        const coffees = getCoffees();

        const results = coffees.filter(coffee =>
            coffee.name.toLowerCase().includes(query) ||
            coffee.origin.toLowerCase().includes(query)
        );

        res.json(results);

    } catch (error) {
        res.status(500).json({
            message: "Search failed"
        });
    }
});

// Start backend server
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("☕ Coffee Rating Application");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("--------------------------------");
});