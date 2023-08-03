window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');
  let artistData;
  let artistListResetState;
  let showMissingLocations = false;
  let drawZone = false;
  let totalPieceCount = 0;
  const logoCount = 4 //CHANGE WHEN ADDING NEW LOGOS
  const flairCount = 15 //CHANGE WHEN ADDING NEW FLAIRS. ALSO CHANGE IN PHOTOS.JS!

  function main() {
    loadLogo()
    loadFolders()
    loadMap()
  }

  function loadLogo() {
    console.log("loading logo")
    const logoElem = document.querySelector("#logo-img")

    var logoChoice = Math.floor(Math.random() * logoCount)//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    //if the random logo was the last one seen, change it.
    let currentLogo = Number(localStorage.getItem("logoId")) || 0
    if (logoChoice == currentLogo){
      logoChoice += 1
      if (logoChoice == logoCount) {logoChoice = 0}
    }
    localStorage.setItem("logoId", logoChoice)

    const logoText = document.querySelector("#logo-title-bar-text")
    logoText.innerHTML = `Logo ${logoChoice + 1} of ${logoCount}`

    logoElem.src = `./media/logo${logoChoice}.png`
  }

  function filterByTagCount(artists) {
    artists.sort(function(a, b){return b[1]["count"] - a[1]["count"];})
    return artists
  }

  // Function to load and display folders
  function loadFolders() {
    console.log("loading folders")
    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/artist_meta.json')
      .then(response => response.json())
      .then(data => {
        const sortedArtists = filterByTagCount(Object.entries(data))
        artistData = sortedArtists
        let flairIndex = 0
        sortedArtists.forEach(folder => {
          folder = folder[1] //for each entry we want to use the value not the key
          const folderName = folder["name"]
          const imgCount = folder["count"]
          totalPieceCount += imgCount

          const window = document.createElement('div');
          window.classList.add("window");
          
          const flair = document.createElement('img');
          flair.classList.add("flair")
          flair.classList.add("twitching")
          flair.src = `./media/flairs/flair${flairIndex}.png`

          const titleBar = document.createElement("div");
          titleBar.classList.add("title-bar")

          const titleBarText = document.createElement('div');
          titleBarText.classList.add("title-bar-text")
          titleBarText.innerText = folderName + ": " + imgCount + (imgCount > 1 ? " tags" : " tag")
          if (folder["favorite"]) {
            titleBarText.innerText += " ⭐"
          }

          titleBar.appendChild(titleBarText)
          window.appendChild(titleBar)

          const windowBody = document.createElement('div');
          windowBody.classList.add("window-body")

          const previewImage = document.createElement('img');
          previewImage.classList.add("preview-image")
          const previewURL = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${folderName}/PREVIEW_thumbnail.jpeg`
          previewImage.src = previewURL
          previewImage.title = `GOTO: ${folderName}`

          const folderLinkElement = document.createElement('a');
          folderLinkElement.href = 'photos.html?folder=' + folderName;
          folderLinkElement.id = "folder-link"

          folderLinkElement.appendChild(previewImage)
          folderLinkElement.appendChild(flair)

          windowBody.appendChild(folderLinkElement)
          window.appendChild(windowBody)
          folderContainer.appendChild(window);

          flairIndex += 1;
          if (flairIndex == flairCount) {flairIndex = 0}
        });
        artistListResetState = document.querySelectorAll(".folderContainer .window")
        loadPieceCount()
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  async function loadMap() {
    console.log("loading map")

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");

    const map = new Map(document.querySelector("#map"), {
      mapTypeId: "satellite",
      center: {lat: 41.66011976254432, lng:-91.53466100556186},
      zoom: 15,
      mapId: "MAP_ID",
    })

    const infoWindow = new InfoWindow()

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/location_coords.json')
    .then(res => res.json())
    .then(data => {
      Object.entries(data).forEach(location => {
        const locationName = location[0]
        
        const coords = location[1]["lat_long"]
        const position = formateCoord(coords)

        const count = location[1]["count"]

        const content = new PinElement({"glyph": `${count}`})
    
        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          content: content.element,
          title: locationName
        });
        marker.addListener("click", ({domEvent, latLng}) => {
          infoWindow.close()
          infoWindow.setContent(marker.title)
          reorderPhotos(marker.title)
          infoWindow.open(marker.map, marker)
        })
      })
    })

    if (showMissingLocations) {
      drawMissingLocations(map)
    }

    if (drawZone) {
      drawSummerZone(map)
    }
  }

  function loadPieceCount() {
    const text = document.getElementById("count-header")
    text.innerText = `Currently sorted and on site: ${totalPieceCount} photos!`
  }

  //map helper to draw the purple X locations
  async function drawMissingLocations(map) {
    console.log("loading missing locations")
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    fetch("https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/missing_locations.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(location => {
        const locationName = location.name;
        const position = formateCoord(location.coords)
        const reason = location.reason;

        const content = new PinElement({
          glyph: 'X',
          borderColor: "#322653",
          background: "#8062D6"
        })

        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          content: content.element,
          title: locationName
        });
        marker.addListener("click", ({domEvent, latLng}) => {
          infoWindow.close()
          infoWindow.setContent(marker.title)
          reorderPhotos(marker.title)
          infoWindow.open(marker.map, marker)
        })
      })
    })
  }

  //map helper to draw the summer 2023 zone. Coords done manually.
  function drawSummerZone(map) {
    console.log("drawing zone")
    zoneCoords = [
      "41.668251773029645, -91.53461606622527",
      "41.66359909211641, -91.53463718400026",
      "41.66353006219566, -91.52870244996366",
      "41.654105061513, -91.52882236015645",
      "41.65411639823388, -91.53022205698203",
      "41.65438564476811, -91.53023343663102",
      "41.65440548394189, -91.53176210281175",
      "41.65660759427152, -91.53165589276536",
      "41.65665027245427, -91.53917016813942",
      "41.65789158249606, -91.53912464955059",
      "41.658081469997285, -91.54190243727162",
      "41.6612665497416, -91.54212069958716",
      "41.66431070335623, -91.54103922587753",
      "41.66437587914452, -91.54177890306175",
      "41.665387512268644, -91.54214684504572",
      "41.6662546137439, -91.54220374329023",
      "41.66662582028792, -91.54161958797579",
      "41.66591740901998, -91.54064852458545",
      "41.66763175091372, -91.54029575545707",
      "41.66835591369653, -91.53744535177692",
      "41.667778867176956, -91.53625981540377",
      "41.66960991406527, -91.53397812582072",
      "41.66849481090777, -91.53374846727576",
      "41.668251773029645, -91.53461606622527",
    ]
    formattedCoords = zoneCoords.map(coord => formateCoord(coord))
    const coveredZone = new google.maps.Polygon({
      paths: formattedCoords,
      strokeColor: "#BA1B1D",
      fillColor: "#FF729F",
      fillOpacity: 0.1
    })

    coveredZone.setMap(map)
  }

  //reorder photos given a location name
  function reorderPhotos(location) {
    const sortYes = []
    const sortNo = []
    
    artistData.forEach(artistObject => {
      const artist = artistObject[0]
      const metadata = artistObject[1]

      // get the artist's div. n^2, sorry
      const artistWindow = getArtistWindow(artist).cloneNode(true); 
      const artistImage = artistWindow.querySelector("img")
      const folderLinkElement = artistWindow.querySelector("#folder-link")
      const titleBarText = artistWindow.querySelector(".title-bar-text");

      if (Object.keys(metadata["photos"]).includes(location)) {
        sortYes.push(artistWindow)
        artistImage.style.border = "5px solid #000080"
        artistImage.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist}/${metadata["photos"][location][0]}_thumbnail.jpeg`
        titleBarText.innerHTML = `${artist}: ${metadata["photos"][location].length} @ ${location}`
        folderLinkElement.href = 'photos.html?folder=' + artist + "&location=" + location
      } 
      else {
        sortNo.push(artistWindow)
        artistImage.style.border = ""
        let artistTagCount = 0
        for (artistLocation in metadata["photos"]) {
          artistTagCount += metadata["photos"][artistLocation].length
        }
        titleBarText.innerHTML = artist + ": " + artistTagCount + (artistTagCount > 1 ? " tags" : " tag")
        // VVV might not want to go back to preview. Take out?
        artistImage.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist}/PREVIEW_thumbnail.jpeg`
        folderLinkElement.href = 'photos.html?folder=' + artist
      }
    })
    folderContainer.innerHTML = ""
    sortYes.sort(function(a, b){
      let titleA = a.querySelector(".title-bar-text").innerHTML
      titleA = titleA.split(": ")[1]
      titleA = parseInt(titleA.split(" ")[0])
    
      let titleB = b.querySelector(".title-bar-text").innerHTML
      titleB = titleB.split(": ")[1]
      titleB = parseInt(titleB.split(" ")[0])

      return titleB - titleA
    })
    const together = sortYes.concat(sortNo)
    together.forEach(child => {
      folderContainer.appendChild(child)
    })
  }

  //assign buttons onclicks
  const logoButton = document.getElementById("logo-refresh-button")
  logoButton.onclick = function(){ loadLogo() }

  const resetButton = document.getElementById("reset-button")
  resetButton.onclick = function(){
    showMissingLocations = false
    showZeroLocations = false
    loadMap()
    folderContainer.innerHTML = ""
    artistListResetState.forEach(node => {
      folderContainer.appendChild(node)
    })
  }

  const missingButton = document.getElementById("missing-button")
  missingButton.onclick = function(){
    showMissingLocations = !showMissingLocations
    loadMap()
  }

  const zoneButton = document.getElementById("zone-button")
  zoneButton.onclick = function() {
    drawZone = !drawZone
    loadMap()
  }

  //handle twitchers
  let forward = true
  let lastCall;
  rotateTwitchers()
  function rotateTwitchers(){
    const twitchers = document.querySelectorAll(".twitching")
    twitchers.forEach(div => {
      rotationAmount = (forward ? "5deg" : "-5deg")
      div.style.transform = `rotate(${rotationAmount})`
    })
    clearTimeout(lastCall)
    lastCall = setTimeout(rotateTwitchers, 500)
    forward = !forward
  }

  //other helpers
  function formateCoord(coord) {
    return {
      lat: parseFloat(coord.split(", ")[0]), 
      lng: parseFloat(coord.split(", ")[1])
    } 
  }

  function getArtistWindow(artist) {
    // currently O(n). Could give each artist window an id={artist} and query by that? not slow enough to care rn
    const allChildren = document.querySelectorAll(".folderContainer .window")
    for (let i = 0; i < allChildren.length; i++) {
      div = allChildren[i]
      titleBar = div.querySelector(".title-bar-text")
      if (titleBar.innerHTML.split(":")[0] == artist) {
        return div
      }
    }
  }

  main()
})