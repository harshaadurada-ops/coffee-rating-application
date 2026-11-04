
"use strict";

console.log("Coffee JavaScript file is loaded!");

// Get HTML elements
const coffeeContainer = document.getElementById("coffeeContainer");
const searchInput = document.getElementById("searchInput");
const statusMessage = document.getElementById("statusMessage");
const leaderboard = document.getElementById("leaderboard");

// Check that all required HTML elements exist
if (!coffeeContainer || !searchInput || !statusMessage || !leaderboard) {
    console.error("Error: Required HTML elements are missing.");
    throw new Error("Please check your index.html file.");
}

// Store coffee records
let allCoffees = [];

// Fetch coffee records from backend
async function loadCoffees() {
    try {
        statusMessage.textContent = "Loading coffee blends...";

        const response = await fetch("/api/coffees");

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid coffee data received from server.");
        }

        allCoffees = data;

        displayCoffees(allCoffees);

        statusMessage.textContent =
            `${allCoffees.length} coffee blends available`;

        await loadLeaderboard();

    } catch (error) {
        console.error("Error loading coffees:", error);

        statusMessage.textContent =
            "Failed to load coffee blends. Please check your server.";
    }
}

// Display coffee cards
function displayCoffees(coffees) {
    coffeeContainer.innerHTML = "";

    if (coffees.length === 0) {
        coffeeContainer.textContent = "No coffee blends found.";
        return;
    }

    coffees.forEach(coffee => {
        const card = document.createElement("div");
        card.className = "coffee-card";

        const name = document.createElement("h3");
        name.textContent = `☕ ${coffee.name}`;

        const origin = document.createElement("p");
        origin.textContent = `Origin: ${coffee.origin}`;

        const roast = document.createElement("p");
        roast.textContent = `Roast: ${coffee.roast}`;

        const rating = document.createElement("p");
        rating.textContent =
            `⭐ Rating: ${Number(coffee.rating).toFixed(2)} / 5`;

        const votes = document.createElement("p");
        votes.textContent = `Total votes: ${coffee.votes}`;

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "rating-buttons";

        const voteLabel = document.createElement("p");
        voteLabel.textContent = "Rate this coffee:";

        buttonContainer.appendChild(voteLabel);

        // Create five rating buttons
        for (let i = 1; i <= 5; i++) {
            const button = document.createElement("button");

            button.type = "button";
            button.textContent = `${i} ⭐`;

            button.addEventListener("click", () => {
                submitVote(coffee.id, i, buttonContainer);
            });

            buttonContainer.appendChild(button);
        }

        card.appendChild(name);
        card.appendChild(origin);
        card.appendChild(roast);
        card.appendChild(rating);
        card.appendChild(votes);
        card.appendChild(buttonContainer);

        coffeeContainer.appendChild(card);
    });
}

// Submit a rating to backend
async function submitVote(coffeeId, rating, buttonContainer) {
    const buttons = buttonContainer.querySelectorAll("button");

    try {
        buttons.forEach(button => {
            button.disabled = true;
        });

        statusMessage.textContent = "Submitting your rating...";

        const response = await fetch(
            `/api/coffees/${coffeeId}/vote`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rating })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Voting failed");
        }

        statusMessage.textContent =
            `Thank you! Your ${rating}-star rating was submitted.`;

        // Refresh coffee cards and leaderboard
        await loadCoffees();

    } catch (error) {
        console.error("Voting error:", error);

        statusMessage.textContent =
            error.message || "Unable to submit your vote.";

        buttons.forEach(button => {
            button.disabled = false;
        });
    }
}

// Load top-rated coffees
async function loadLeaderboard() {
    try {
        const response = await fetch("/api/leaderboard");

        if (!response.ok) {
            throw new Error("Unable to load leaderboard");
        }

        const topCoffees = await response.json();

        leaderboard.innerHTML = "";

        if (!Array.isArray(topCoffees) || topCoffees.length === 0) {
            leaderboard.textContent = "No ratings available yet.";
            return;
        }

        topCoffees.forEach((coffee, index) => {
            const item = document.createElement("div");
            item.className = "leaderboard-item";

            const name = document.createElement("strong");
            name.textContent = `${index + 1}. ${coffee.name}`;

            const score = document.createElement("span");
            score.textContent =
                `⭐ ${Number(coffee.rating).toFixed(2)} | ${coffee.votes} votes`;

            item.appendChild(name);
            item.appendChild(score);

            leaderboard.appendChild(item);
        });

    } catch (error) {
        console.error("Leaderboard error:", error);
        leaderboard.textContent = "Unable to load leaderboard.";
    }
}

// Search coffee by name or origin
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredCoffees = allCoffees.filter(coffee =>
        coffee.name.toLowerCase().includes(searchTerm) ||
        coffee.origin.toLowerCase().includes(searchTerm)
    );

    displayCoffees(filteredCoffees);
});

// Start the application
loadCoffees();