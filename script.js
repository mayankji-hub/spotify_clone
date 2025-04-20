console.log('lets write javascript');
let currentsong = new Audio();
let songs = []
let currfolder;


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60); // Get the minutes part
  const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds part

  // Pad single-digit minutes and seconds with a leading zero
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder) {

  currfolder = folder;

  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs.length = 0;
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>  
            <img class=invert src="img/music.svg" alt="">
            <div class="info">
              <div>${song.replaceAll("%20", " ")}</div>
              <div>Harry</div>
            </div>
              <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="img/play.svg" alt="">
              </div>

              
            
             </li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })
  return songs
}
const playmusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play()
    play.src = "img/pause.svg"
  }

 
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayalbums(){

  let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
  
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
      if(e.href.includes("/songs")){
    let folder = e.href.split("/").slice(-2)[0]
    //get the metadata for the folder
    
  let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
  let response = await a.json();
  console.log(response)
  cardcontainer.innerHTML = cardcontainer.innerHTML + `   <div data-folder="${folder}" class="card ">
            <div class="play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none">
                <!-- Green Circle Background -->
                <circle cx="12" cy="12" r="10" fill="#1ed760" />
                
                <!-- Green Icon -->
                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" fill="black" stroke="#4CAF50" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
              
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description} </p>
          </div>`
  }

  }

 //load the playlist whenever in the list of the library
 Array.from(document.getElementsByClassName("card")).forEach(e => {
  e.addEventListener("click", async item => {
console.log("fetching songs")
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    playmusic(songs[0])

  })

})


}


async function main() {


  await getsongs("songs/ncs")
  playmusic(songs[0], true)


//display all the albums on the page

 await displayalbums()

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "img/pause.svg"
    }
    else {
      currentsong.pause()
      play.src = "img/play.svg"
    }
  })

  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration) * percent / 100;
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"

  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })
  previous.addEventListener("click", () => {
    currentsong.pause()
    console.log("Previous clicked")
   
  let   index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    
    if ((index - 1) >= 0) {
      playmusic(songs[index - 1])
    }
  })

next.addEventListener("click", () => {
currentsong.pause()
console.log("next clicked")
let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs, index)
    if ((index + 1) < songs.length) {
      playmusic(songs[index + 1])
    }
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to",e.target.value,"/100")
    currentsong.volume = parseInt(e.target.value) / 100

  })

  document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target)
    console.log("changing",e.target.src)
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg","mute.svg")
      currentsong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
     e.target.src =  e.target.src.replace("mute.svg","volume.svg")
      currentsong.volume = .1;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
  })


}
main()

