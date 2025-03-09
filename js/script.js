<<<<<<< HEAD
console.log("Hello Spotify");

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutsSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00/00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="images/music.svg" alt="">
        <div class="info">
            <div class="info_name">${song.replaceAll("%20", " ")}</div>
            <div class="artist">HK-Kashyap</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="images/play.svg" alt="">
        </div> </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info_name").innerHTML);
      playMusic(e.querySelector(".info_name").innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(
    ".mp3",
    ""
  );
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
  console.log(track.replace("(MP3_160K).mp3", ""));
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];

      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card ">
            <div class="play">
                
                <svg width="45" height="45" xmlns="http://www.w3.org/2000/svg">
                    <!-- Circular box with green background -->
                    <circle cx="17" cy="17" r="17" fill="#00FF00" stroke="#000000" stroke-width="0">
                    </circle>

                    <!-- Original SVG path inside the circular box -->
                    <svg x="9" y="9" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1"
                            stroke-linejoin="round"></path>
                    </svg>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>

             </div>`;

      // load the library whenever a card is clicked

      Array.from(document.getElementsByClassName("card")).forEach((element) => {
        element.addEventListener("click", async (item) => {
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(songs[0]);
        });
      });
    }
  }
}

async function main() {
  // get the list of all the songs
  await getSongs("songs/Party_songs");
  // currentSong.src = songs[0];
  playMusic(songs[0], true);
  // console.log(songs);

  // Display all the albums on the page
  displayAlbums();

  // Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
      console.log("play");
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
      console.log("pause");
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutsSeconds(currentSong.currentTime)}/
        ${secondsToMinutsSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target,e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    console.log("hamburger");
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
    console.log("closed");
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    // console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    console.log("Next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add ann event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to :-", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Add event listener to mute
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("images/volume.svg")) {
      e.target.src = "images/mute.svg";
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = "images/volume.svg";
      currentSong.volume = 30 / 100;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 30;
    }
  });
}
main();
=======
console.log("Hello Spotify");

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutsSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00/00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="images/music.svg" alt="">
        <div class="info">
            <div class="info_name">${song.replaceAll("%20", " ")}</div>
            <div class="artist">HK-Kashyap</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="images/play.svg" alt="">
        </div> </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info_name").innerHTML);
      playMusic(e.querySelector(".info_name").innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(
    ".mp3",
    ""
  );
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
  console.log(track.replace("(MP3_160K).mp3", ""));
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];

      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card ">
            <div class="play">
                
                <svg width="45" height="45" xmlns="http://www.w3.org/2000/svg">
                    <!-- Circular box with green background -->
                    <circle cx="17" cy="17" r="17" fill="#00FF00" stroke="#000000" stroke-width="0">
                    </circle>

                    <!-- Original SVG path inside the circular box -->
                    <svg x="9" y="9" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1"
                            stroke-linejoin="round"></path>
                    </svg>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>

             </div>`;

      // load the library whenever a card is clicked

      Array.from(document.getElementsByClassName("card")).forEach((element) => {
        element.addEventListener("click", async (item) => {
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(songs[0]);
        });
      });
    }
  }
}

async function main() {
  // get the list of all the songs
  await getSongs("songs/Party_songs");
  // currentSong.src = songs[0];
  playMusic(songs[0], true);
  // console.log(songs);

  // Display all the albums on the page
  displayAlbums();

  // Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
      console.log("play");
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
      console.log("pause");
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutsSeconds(currentSong.currentTime)}/
        ${secondsToMinutsSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target,e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    console.log("hamburger");
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
    console.log("closed");
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    // console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    console.log("Next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add ann event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to :-", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Add event listener to mute
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("images/volume.svg")) {
      e.target.src = "images/mute.svg";
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = "images/volume.svg";
      currentSong.volume = 30 / 100;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 30;
    }
  });
}
main();
>>>>>>> 02d3453 (Add files via upload)
