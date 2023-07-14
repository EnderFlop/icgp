window.addEventListener('DOMContentLoaded', () => {
  const photoWindowBody = document.querySelector("#photo-window-body")
  const photoTitleBarText = document.querySelector("#photo-title-bar-text")
  const metaList = document.querySelector("#metadata-list")
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  const artist = urlParams.get("artist");
  const imgName = urlParams.get("imgName");
  loadPiece()
  loadMap()
  var location;

  function loadPiece(){
    //first, add the image
    const imageElement = document.createElement('img')
    imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist}/${imgName}.jpg`
    photoWindowBody.appendChild(imageElement)

    //then, add the back button
    const artist_url = `https://enderflop.github.io/icgp/photos.html?folder=${artist}`
    document.getElementById("back-button").onclick = function () {window.location.href=artist_url;}
    

    //then, get the metadata
    fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist}/${imgName}.json`)
          .then(response => response.json())
          .then(data => {
            location = data["location"]
            photoTitleBarText.innerHTML = data["img_name"]
            Object.entries(data).forEach(item => {
              const listElem = document.createElement("li")
              listElem.innerHTML = item[0] + ": " + (item[1] ? item[1] : "N/A")
              metaList.appendChild(listElem)
            })
    })
  }

  async function loadMap() {
    //get the coords and plot the image's marker
    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/location_coords.json')
        .then(response => response.json())
        .then(async data => {
          coords = data[location]["lat_long"]
          myLat = parseFloat(coords.split(", ")[0])
          myLon = parseFloat(coords.split(", ")[1])
          position = {lat: myLat, lng: myLon}
          const { Map } = await google.maps.importLibrary("maps");
          const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
          map = new Map(document.querySelector("#map"), {
            mapTypeId: "satellite",
            center: position,
            zoom: 18,
            mapId: "MAP_ID"
          })
          const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: imgName,
          });
    })
  }
})