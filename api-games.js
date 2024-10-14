const apiKey = "bd63f7018d6b43f19b6e7ffda85fb994";
const gamesContainer = document.getElementById("games-container");

async function fetchGames() {
  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.results) {
      displayGames(data.results);
    } else {
      console.log("No games found in the response.");
    }
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

function displayGames(games) {
  gamesContainer.innerHTML = ""; //clear previous result

  if (!games || games.length === 0) {
    console.log("No games to display.");
    return;
  }

  games.forEach((game) => {
    const gameElement = document.createElement("div");
    gameElement.classList.add("game");

    //creating a link to the game's details page on RAWG
    const gameLink = document.createElement("a");
    gameLink.href = `https://rawg.io/games/${game.slug}`;
    gameLink.target = "_blank";

    const gameImage = document.createElement("img");
    gameImage.src = game.background_image;
    gameImage.alt = `${game.name} cover`;

    const gameTitle = document.createElement("h3");
    gameTitle.innerText = game.name;

    gameLink.appendChild(gameImage);
    gameLink.appendChild(gameTitle);

    gameElement.appendChild(gameLink);
    gamesContainer.appendChild(gameElement);
  });
}

fetchGames();
