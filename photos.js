window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.imageContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folder = urlParams.get("folder");

  loadImagesFromFolder(folder)

  function loadImagesFromFolder(folder){
    container.innerHTML = ''; // Clear the image container before loading new images
    fetch(`https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/serverless/artist_meta.json`)
      .then(response => response.json())
      .then(data => {
        artist_data = data[folder]
        const photos = artist_data["photos"]
        photos.forEach(photo => {
          const outerImageElement = document.createElement('div');
          outerImageElement.classList.add("image")
          
          const realImageName = photo["name"]
          const linkElement = document.createElement("a")
          linkElement.href = `piece.html?folder=${folder}&piece=${realImageName}`

          const imageElement = document.createElement('img')
          imageElement.src = photo["thumbnail_url"]

          linkElement.appendChild(imageElement)
          outerImageElement.appendChild(linkElement)
        })
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
})