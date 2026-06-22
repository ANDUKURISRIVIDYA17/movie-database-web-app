// 1. Paste your active OMDb API key inside the single quotes below
const apiKey = 'f087f225'; 

// 2. Grab all the HTML elements we need to interact with
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const movieCard = document.getElementById('movie-card');
const errorMsg = document.getElementById('error-msg');

// 3. Listen for the click event on the search button
searchBtn.addEventListener('click', () => {
    const movieName = movieInput.value.trim();
    
    if (movieName === "") {
        showError("Please enter a movie title to search!");
        return;
    }
    
    fetchMovieDetails(movieName);
});

// 4. Also listen for the "Enter" key press inside the input field
movieInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// 5. Async function to fetch data from the OMDb API
async function fetchMovieDetails(title) {
    // Build the query URL using template literals
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // If OMDb can't find the movie, it returns Response: "False"
        if (data.Response === "False") {
            showError(`Movie not found! ${data.Error}`);
            return;
        }
        
        // If successful, populate our UI with data fields
        displayMovieData(data);
        
    } catch (error) {
        showError("Something went wrong with the connection. Please try again!");
        console.error(error);
    }
}

// 6. Function to map API data into HTML elements and execute your custom comment logic
function displayMovieData(data) {
    // Hide any previous error messages and show the card
    errorMsg.classList.add('hidden');
    movieCard.classList.remove('hidden');
    
    // Inject core specifications
    document.getElementById('movie-title').innerText = data.Title;
    document.getElementById('movie-year').innerText = data.Year;
    document.getElementById('movie-released').innerText = data.Released;
    document.getElementById('movie-rating').innerText = data.imdbRating !== "N/A" ? `${data.imdbRating} / 10` : "No Rating Available";
    document.getElementById('movie-director').innerText = data.Director;
    document.getElementById('movie-cast').innerText = data.Actors;
    document.getElementById('movie-production').innerText = data.Production !== "N/A" ? data.Production : "Not Available";
    
    // Handle the poster image fallback if none exists
    const posterImg = document.getElementById('movie-poster');
    posterImg.src = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/120x175?text=No+Poster";
    
    // 7. Your Creative Twist: Custom Review Badge Logic
    const verdictBadge = document.getElementById('verdict-badge');
    const ratingFloat = parseFloat(data.imdbRating);
    
    // Clear out any old background styling classes
    verdictBadge.className = "verdict-badge";
    
    if (isNaN(ratingFloat)) {
        verdictBadge.innerText = "No Reviews Yet";
        verdictBadge.classList.add('verdict-average');
    } else if (ratingFloat >= 7.5) {
        verdictBadge.innerText = "Verdict: Best 🔥";
        verdictBadge.classList.add('verdict-best');
    } else if (ratingFloat >= 5.0 && ratingFloat < 7.5) {
        verdictBadge.innerText = "Verdict: Average 🍿";
        verdictBadge.classList.add('verdict-average');
    } else {
        verdictBadge.innerText = "Verdict: Bad 👎";
        verdictBadge.classList.add('verdict-bad');
    }
}

// Helper function to handle cleanly flashing errors
function showError(message) {
    movieCard.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    errorMsg.innerText = message;
}