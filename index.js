// Wait for DOM to load before running script
document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("films");

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
        .catch(error => console.error('Error fetching movies list:', error));

    // Function to add movies to the list
    function addMovieToList(movie) {
        const li = document.createElement("li");
        li.idList.add("film", "item");
        li.textContent = movie.title;
        li.dataset.id = movie.id; // Store movie ID

        // Select button
        const selectButton = document.createElement("button");
        selectButton.textContent = "Select";
        selectButton.id = "select-button"; // Fixed incorrect property access
        selectButton.addEventListener("click", (event) => {
            event.stopPropagation();
            displayMovieDetails(movie);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.idList.add("delete-button");
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteMovie(movie, li);
        });

        // Append buttons
        li.appendChild(selectButton);
        li.appendChild(deleteButton);
        movieList.appendChild(li);

        // Click event to display selected movie details
        li.addEventListener("click", () => {
            displayMovieDetails(movie);
        });
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
        document.getElementById("poster").src = movie.poster || "placeholder.jpg"; 
        document.getElementById("title").textContent = movie.title || "Unknown"; 
        document.getElementById("runtime").textContent = movie.runtime ? `${movie.runtime} minutes` : "-";
        document.getElementById("showtime").textContent = movie.showtime || "-";

        // Calculate available tickets
        const availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById("ticket-num").textContent = availableTickets >= 0 ? availableTickets : "Sold Out";

        const buyButton = document.getElementById("buy-ticket");
        buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out"; 
        buyButton.disabled = availableTickets <= 0; 

        // Remove any previous event listeners 
        const newBuyButton = buyButton.cloneNode(true);
        buyButton.replaceWith(newBuyButton);

        // Add event listener to the new button
        newBuyButton.addEventListener("click", () => buyTicket(movie));
    }

    // Function to buy a ticket 
    function buyTicket(movie) {
        if (movie.tickets_sold < movie.capacity) {
            movie.tickets_sold++;

            const ticketNum = document.getElementById("ticket-num");
            const buyButton = document.getElementById("buy-ticket");

            ticketNum.textContent = movie.capacity - movie.tickets_sold;

            if (movie.tickets_sold === movie.capacity) {
                buyButton.textContent = "Sold Out";
                buyButton.disabled = true;
            }

            // Update the JSON using PATCH
            fetch(`http://localhost:3000/films/${movie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold })
            })
            .then(response => response.json())
            .then(updatedMovie => console.log("Updated movie:", updatedMovie))
            .catch(error => console.error("Error updating ticket count:", error));
        }
    }

    // Function to delete a movie from the list
    function deleteMovie(movie, movieElement) {
        fetch(`http://localhost:3000/films/${movie.id}`, { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    movieElement.remove();
                } else {
                    console.error("Failed to delete movie.");
                }
            })
            .catch(error => console.error('Error deleting the movie:', error));
    }
});
