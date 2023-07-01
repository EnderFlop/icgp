window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');
  let artistData;
  let artistListResetState;

  function loadLogo() {
    console.log("loading logo")
    const logoElem = document.querySelector("#logo-img")
    const logoCount = 4 //CHANGE WHEN ADDING NEW LOGOS

    var logoChoice = Math.floor(Math.random() * logoCount)//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    //if the random logo was the last one seen, change it.
    let currentLogo = Number(localStorage.getItem("logoId")) || 0
    console.log("logo choice: " + logoChoice + "current logo: " + currentLogo)
    if (logoChoice == currentLogo){
      logoChoice += 1
      if (logoChoice == logoCount) {logoChoice = 0}
      console.log("new logo choice: " + logoChoice)
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
        sortedArtists.forEach(folder => {
          folder = folder[1] //for each entry we want to use the value not the key
          const folderName = folder["name"]
          const imgCount = folder["count"]

          const window = document.createElement('div');
          window.classList.add("window");
          
          const titleBar = document.createElement("div");
          titleBar.classList.add("title-bar")

          const titleBarText = document.createElement('div');
          titleBarText.classList.add("title-bar-text")
          titleBarText.innerText = folderName + ": " + imgCount + (imgCount > 1 ? " tags" : " tag")

          titleBar.appendChild(titleBarText)
          window.appendChild(titleBar)

          const windowBody = document.createElement('div');
          windowBody.classList.add("window-body")

          const previewImage = document.createElement('img');
          previewImage.classList.add("previewImage")
          const previewURL = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${folderName}/PREVIEW_thumbnail.jpeg`
          previewImage.src = previewURL

          const folderLinkElement = document.createElement('a');
          folderLinkElement.href = 'photos.html?folder=' + folderName;
          folderLinkElement.id = "folder-link"

          const button = document.createElement("button");
          button.innerText = "See Tags"

          folderLinkElement.appendChild(button)

          windowBody.appendChild(previewImage)
          windowBody.appendChild(folderLinkElement)
          window.appendChild(windowBody)
          folderContainer.appendChild(window);
        });
        artistListResetState = document.querySelectorAll(".folderContainer .window")
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
      mapId: "MAP_ID"
    })

    const infoWindow = new InfoWindow()

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/location_coords.json')
    .then(res => res.json())
    .then(data => {
      Object.entries(data).forEach(location => {
        const locationName = location[0]
        
        const coords = location[1]["lat_long"]
        const myLat = parseFloat(coords.split(", ")[0])
        const myLon = parseFloat(coords.split(", ")[1])

        const count = location[1]["count"]
        const position = {lat: myLat, lng: myLon}
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
  }

  function getArtistWindow(artist) {
    // currently O(n). Could give each artist window an id={artist} and query by that? not slow enough to care rn
    const allChildren = document.querySelectorAll(".folderContainer .window")
    for (let i = 0; i < allChildren.length; i++) {
      div = allChildren[i]
      titleBar = div.querySelector(".title-bar-text")
      if (titleBar.innerHTML.split(":")[0] == artist) {
        console.log(div)
        return div
      }
    }
  }

  function reorderPhotos(location) {
    const sortYes = []
    const sortNo = []
    
    artistData.forEach(artistObject => {
      const artist = artistObject[0]
      const metadata = artistObject[1]

      // get the artist's div. n^2, sorry
      const realArtistWindow = getArtistWindow(artist); 
      const artistWindow = realArtistWindow.cloneNode(true)
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

  loadLogo()
  loadFolders()
  loadMap()
  const resetButton = document.getElementById("reset-button")
  resetButton.onclick = function(){
    folderContainer.innerHTML = ""
    artistListResetState.forEach(node => {
      folderContainer.appendChild(node)
    })
  }
})