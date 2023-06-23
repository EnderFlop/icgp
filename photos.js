window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.imageContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folder = urlParams.get("folder");

  main()
  
  async function main(){
    let location_coords;
    loadCoordData()
    let tag_locations = {}
    await loadImagesFromFolder(tag_locations)
    console.log(JSON.stringify(tag_locations))
    await new Promise(r => setTimeout(r, 1000));
    putDataOnMap(tag_locations)
  }

  function loadCoordData(){
    console.log("loading coord data")
    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/location_coords.json')
    .then(response => response.json())
    .then(data => {
      location_coords = data
    })
  }

  function loadImagesFromFolder(tag_locations){
    console.log('loading images')
    //first, load all the images
    container.innerHTML = ''; // Clear the image container before loading new images
    return fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/artist_meta.json`)
      .then(response => response.json())
      .then(async data => {
        artist_data = data[folder]

        const { Map } = await google.maps.importLibrary("maps");

        map = new Map(document.querySelector("#map"), {
          mapTypeId: "satellite",
          center: {lat: 41.66011976254432, lng:-91.53466100556186},
          zoom: 15,
          mapId: "MAP_ID"
        })
        

        const titleBarText = document.querySelector(".title-bar-text")
        const artistName = artist_data["name"]
        titleBarText.innerHTML = `ARTIST: ${artistName}`

        const photos = artist_data["photos"]
        photos.forEach(photo => {
          const window = document.createElement('div');
          window.classList.add("window");
          window.style = "width: 250px"

          const titleBar = document.createElement("div");
          titleBar.classList.add("title-bar")

          const titleBarText = document.createElement('div');
          titleBarText.classList.add("title-bar-text")

          titleBar.appendChild(titleBarText)
          window.appendChild(titleBar)

          const outerImageElement = document.createElement('div');
          outerImageElement.classList.add("image")
          
          const linkElement = document.createElement("a")
          linkElement.href = `piece.html?artist=${artistName}&imgName=${photo}`

          const imageElement = document.createElement('img')
          imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artistName}/${photo}_thumbnail.jpeg`

          linkElement.appendChild(imageElement)
          outerImageElement.appendChild(linkElement)
          window.append(outerImageElement)

          //then, load the metadata
          //horribly inefficient, will likely add data to artist_meta eventually. have to reduce json size first.
          
          fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti-archive/master/photos/${artist_data['name']}/${photo}.json`)
          .then(response => response.json())
          .then(data => {
            loc = data["location"]
            titleBarText.innerHTML = `${loc}`
            if (loc in tag_locations){
              tag_locations[loc] += 1
            }
            else {          
              tag_locations[loc] = 1
            }
            console.log(JSON.stringify(tag_locations))
          })
          container.append(window)
        })
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  async function putDataOnMap(tag_locations) {
    console.log('putting data on map')
    console.log(tag_locations)

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    Object.entries(tag_locations).forEach(item => {
      const location = item[0]
      const count = item[1]

      const content = new PinElement({"glyph": `${count}`})

      const coords = location_coords[location]
      myLat = parseFloat(coords.split(", ")[0])
      myLon = parseFloat(coords.split(", ")[1])
      position = {lat: myLat, lng: myLon}
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        content: content.element
      });
    })
  }
})