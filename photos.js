window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.imageContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folder = urlParams.get("folder");

  loadImagesFromFolder(folder)

  function loadImagesFromFolder(folder){
    //first, load all the images
    container.innerHTML = ''; // Clear the image container before loading new images
    fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/artist_meta.json`)
      .then(response => response.json())
      .then(data => {
        artist_data = data[folder]

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
          linkElement.href = `piece.html?artist=${artistName}&imgName=${photo["name"]}`

          const imageElement = document.createElement('img')
          imageElement.src = photo["thumbnail_url"]

          linkElement.appendChild(imageElement)
          outerImageElement.appendChild(linkElement)
          window.append(outerImageElement)
          

          //then, load the metadata
          //horribly inefficient, will likely add data to artist_meta eventually. have to reduce json size first.
          fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${artist_data['name']}/${photo["name"]}.json`)
          .then(response => response.json())
          .then(data => {
            titleBarText.innerHTML = `${data["location"]}`
          })

          container.append(window)

        })
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
})