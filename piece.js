window.addEventListener('DOMContentLoaded', () => {
  const photoWindowBody = document.querySelector("#photo-window-body")
  const photoTitleBarText = document.querySelector("#photo-title-bar-text")
  const metaList = document.querySelector("#metadata-list")
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  loadPiece()
  loadMap()
  var location;

  function loadPiece(){
    const artist = urlParams.get("artist");
    const imgName = urlParams.get("imgName");

    //first, add the image
    const imageElement = document.createElement('img')
    imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist}/${imgName}.jpg`
    photoWindowBody.appendChild(imageElement)

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
    const artist = urlParams.get("artist");
    const imgName = urlParams.get("imgName");

    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/location_coords.json')
        .then(response => response.json())
        .then(async data => {
          coords = data[location]
          myLat = parseFloat(coords.split(", ")[0])
          myLon = parseFloat(coords.split(", ")[1])
          position = {lat: myLat, lng: myLon}
          const { Map } = await google.maps.importLibrary("maps");
          const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
          map = new Map(document.querySelector("#map"), {
            center: position,
            zoom: 14,
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