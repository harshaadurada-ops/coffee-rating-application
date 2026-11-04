# ☕ Coffee Rating Application

A full-stack Coffee Rating Application built using Node.js, Express.js, HTML, CSS, and JavaScript.

## Features

- Display coffee blends in a responsive grid.
- View coffee details, including name, origin, roast type, rating, and votes.
- Rate coffee blends from 1 to 5 stars.
- Automatically update average ratings and vote counts.
- View a leaderboard of top-rated coffees.
- Search coffee blends by name or origin.
- Store coffee data in a local JSON file.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- JSON

## Project Structure

```text
coffee-rating-application/
├── data/
│   └── coffees.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## How to Run Locally

1. Clone this repository.
2. Open the project folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Start the application:

```bash
npm run dev
```

5. Open your browser and visit:

`http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/coffees` | Get all coffee blends |
| POST | `/api/coffees/:id/vote` | Submit a coffee rating |
| GET | `/api/leaderboard` | Get top-rated coffees |
| GET | `/api/search?q=` | Search coffee blends |

## Author

Developed as a full-stack web development project.