// Wait for DOM to load 
document.addEventListener("DOMContentLoaded", () => {
    let currentMovie = null; // Global variable to track selected movie

    // Fetch the first movie when the page loads
    fetchFirstMovie();
    function fetchFirstMovie() {
        fetch("http://localhost:3000/films/1")
            .then(response => response.json()) // Convert response to JSON
            .then(movie => {
                currentMovie = movie; // Store the first movie globally
                displayMovieDetails(movie); // Call function to update DOM
            })
            .catch(error => {
                console.error("Error fetching first movie:", error);
            });
    }

    // Function to update the DOM with movie details
    function displayMovieDetails(movie) {
        document.getElementById("poster").src = movie.poster;
        document.getElementById("title").textContent = movie.title;
        document.getElementById("runtime").textContent = `${movie.runtime} min`; 
        document.getElementById("showtime").textContent = movie.showtime;
        document.getElementById("description").textContent = movie.description;

        // Calculate available tickets
        let availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById("available-tickets").textContent = availableTickets;

        // Update Buy Button
        const buyButton = document.getElementById("buy-ticket");
        buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
        buyButton.disabled = availableTickets === 0;

        // Update global variable with selected movie
        currentMovie = movie;
    }

    // Fetch all movies and add them to the list
    fetchAllMovies();
    function fetchAllMovies() {
        fetch("http://localhost:3000/films")
            .then(response => response.json())
            .then(movies => {
                console.log("Movies fetched:", movies);
                const filmList = document.getElementById("films");
                filmList.innerHTML = ""; // Clear previous content

                movies.forEach(movie => {
                    addMovieToList(movie);
                });
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

    // Function to add a movie to the list
    function addMovieToList(movie) {
        const filmList = document.getElementById("films");

        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = movie.title;
        li.dataset.id = movie.id;

        // Click event to load movie details
        li.addEventListener("click", () => {
            fetchMovieDetails(movie.id);
        });

        filmList.appendChild(li);
    }

    // Fetch and display a specific movie's details
    function fetchMovieDetails(movieId) {
        fetch(`http://localhost:3000/films/${movieId}`)
            .then(response => response.json())
            .then(movie => {
                displayMovieDetails(movie);
            })
            .catch(error => console.error("Error fetching movie details:", error));
    }

    // Function to buy a ticket
    function buyTicket(movie, availableTickets) {
        if (availableTickets <= 0) {
            alert("This movie is sold out");
            return;
        }

        // Calculate new tickets sold
        const newTicketsSold = movie.tickets_sold + 1;
        const updatedAvailableTickets = movie.capacity - newTicketsSold;

        // Update the frontend
        document.getElementById("available-tickets").textContent = updatedAvailableTickets;

        // Disable button and update text if sold out
        const buyButton = document.getElementById("buy-ticket");
        if (updatedAvailableTickets === 0) {
            buyButton.textContent = "Sold Out";
            buyButton.disabled = true;
        }

        // PATCH request to update the server
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tickets_sold: newTicketsSold
            })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            console.log("Updated movie data:", updatedMovie);
            movie.tickets_sold = updatedMovie.tickets_sold; // Update local movie object
        })
        .catch(error => {
            console.error("Error updating tickets:", error);
            alert("Something went wrong. Please try again.");
        });
    }

    // Add event listener to the Buy Ticket button
    document.getElementById("buy-ticket").addEventListener("click", () => {
        if (!currentMovie) { 
            alert("No movie selected!");
            return;
        }
        const availableTickets = parseInt(document.getElementById("available-tickets").textContent);
        buyTicket(currentMovie, availableTickets);
    });
});
        // POST request to create a new ticket entry
        fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
     },
    body: JSON.stringify({
        film_id: movie.id,
        number_of_tickets: 1
        })
    })
    .then(response => response.json())
    .then(newTicket => {
    console.log("New ticket created:", newTicket);
})
    .catch(error => {
    console.error("Error creating ticket:", error);
});
fetch("http://localhost:3000/films")
  .then((response) => response.json())
  .then((movies) => {
    if (movies.length > 0) {
      displayMovie(movies[0]); // Display the first available movie 
    } else {
      console.warn("No movies found in the database.");
    }
  })
  .catch((error) => console.error("Error fetching movies:", error));
