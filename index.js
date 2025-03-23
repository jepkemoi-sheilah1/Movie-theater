// Wait for DOM to load before running script
document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("films");
    const moviePoster = document.getElementById("poster");
    const movieTitle = document.getElementById("title");
    const movieRuntime = document.getElementById("runtime");
    const movieDescription = document.getElementById("description");
    const movieShowtime = document.getElementById("showtime");
    const movieTickets = document.getElementById("tickets");
    const buyButton = document.getElementById("buy-ticket");

    // Fetch movie data from JSON server
    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => addMovieToList(movie));
            // Load the first movie's details by default
            if (movies.length > 0) {
                displayMovieDetails(movies[0]);
            }
        })
        .catch(error => console.error("Error fetching movies list:", error));

    // Function to add movies to the list
    function addMovieToList(movie) {
        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = movie.title;
        li.dataset.id = movie.id; // Store movie ID
        movieList.appendChild(li);

        // Click event to display selected movie details
        li.addEventListener("click", () => {
            displayMovieDetails(movie);
        });
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
        moviePoster.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieRuntime.textContent = `${movie.runtime} minutes`;
        movieDescription.textContent = movie.description;
        movieShowtime.textContent = movie.showtime;

        let availableTickets = movie.capacity - movie.tickets_sold;
        movieTickets.textContent = `${availableTickets} remaining tickets`;

        // Update button status
        buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
        buyButton.disabled = availableTickets === 0;

        // Click event to buy a ticket
        buyButton.onclick = () => {
            if (availableTickets > 0) {
                availableTickets--;
                movieTickets.textContent = `${availableTickets} remaining tickets`;

                // Update server with new tickets sold
                fetch(`http://localhost:3000/films/${movie.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tickets_sold: movie.capacity - availableTickets })
                })
                .then(response => response.json())
                .then(updatedMovie => console.log("Updated movie:", updatedMovie))
                .catch(error => console.error("Error updating ticket count:", error));

                // If sold out, update button
                if (availableTickets === 0) {
                    buyButton.textContent = "Sold Out";
                    buyButton.disabled = true;
                }
            }
        };
    }
});
