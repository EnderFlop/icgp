window.addEventListener('DOMContentLoaded', () => {
  const photoWindowBody = document.querySelector("#photo-window-body")
  const photoTitleBarText = document.querySelector("#photo-title-bar-text")
  const metaList = document.querySelector("#metadata-list")
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  loadPiece()

  function loadPiece(){
    const artist = urlParams.get("artist");
    const imgName = urlParams.get("imgName");

    //first, add the image
    const imageElement = document.createElement('img')
    imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${artist}/${imgName}.jpg`
    photoWindowBody.appendChild(imageElement)

    //then, get the metadata
    fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${artist}/${imgName}.json`)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            photoTitleBarText.innerHTML = data["img_name"]
            Object.entries(data).forEach(item => {
              const listElem = document.createElement("li")
              listElem.innerHTML = item[0] + ": " + (item[1] ? item[1] : "N/A")
              metaList.appendChild(listElem)
            })
    })
  }
})