window.addEventListener('DOMContentLoaded', () => {
  async function main() {
    map = await createMap()
    placeMissingLocations(map)
    drawSummerZone(map)
    loadKey()
  }

  async function createMap() {
    console.log("creating map")
    const { Map } = await google.maps.importLibrary("maps");

    const map = new Map(document.querySelector("#faq-map"), {
      mapTypeId: "satellite",
      center: {lat: 41.66011976254432, lng:-91.53466100556186},
      zoom: 15,
      mapId: "MAP_ID",
    })

    return map
  }

  async function placeMissingLocations(map) {
    console.log("loading missing locations")
    const { InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const infoWindow = new InfoWindow()

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
          infoWindow.open(marker.map, marker)
        })
      })
    })
  }

  async function drawSummerZone(map) {
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

  function formateCoord(coord) {
    return {
      lat: parseFloat(coord.split(", ")[0]), 
      lng: parseFloat(coord.split(", ")[1])
    } 
  }

  main()
})