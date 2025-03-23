#Movie-theater
# Movie Theater Application

## Overview
This is a dynamic web application that allows users to browse available movies, view movie details, check ticket availability, and purchase tickets. The application interacts with a local JSON server to fetch movie data and update ticket availability.

## Features
- Display a list of available movies in the sidebar.
- Show detailed movie information, including title, runtime, showtime, description, and available tickets.
- Buy tickets and update the available ticket count dynamically.
- Prevent users from purchasing tickets if a movie is sold out.
- Indicate when a movie is sold out.
- Delete movies from the list and remove them from the server.
- Fetch data from a local JSON server using API requests.

## Technologies Used
- HTML
- CSS
- JavaScript (DOM Manipulation & Fetch API)
- JSON Server (Mock Backend)

## Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd movie-theater-app
   ```
2. **Install JSON Server:**
   ```bash
   npm install -g json-server
   ```
3. **Start JSON Server:**
   ```bash
   json-server --watch db.json --port 3000
   ```
4. **Open `index.html` in a browser** to view the application.

## API Endpoints
- **Get all movies:** `GET /films`
- **Get a single movie:** `GET /films/:id`
- **Update tickets sold:** `PATCH /films/:id`
- **Delete a movie:** `DELETE /films/:id`

## Core Functionality
### Fetch and Display Movies
- The application fetches movie data from the server and dynamically populates the movie list.
- The first movie's details are displayed when the page loads.

### Show Available Tickets
- The number of available tickets is calculated as:
  ```js
  const availableTickets = movie.capacity - movie.tickets_sold;
  ```
- The value updates dynamically as tickets are purchased.

### Buy Ticket Functionality
- Clicking the "Buy Ticket" button decreases the number of available tickets.
- If tickets are sold out, the button text changes to **"Sold Out"** and becomes disabled.
- The server is updated using a `PATCH` request.
  ```js
  fetch(`http://localhost:3000/films/${movie.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
  });
  ```

### Delete Movie Functionality
- Each movie has a delete button that removes it from both the UI and the server.
- The server is updated using a `DELETE` request.
  ```js
  fetch(`http://localhost:3000/films/${movie.id}`, { method: "DELETE" });
  ```

## Future Enhancements
- Implement user authentication for personalized bookings.
- Allow users to add new movies.
- Improve UI/UX with animations and a modern design.

## Author
Jepkemoi-Sheilah1

