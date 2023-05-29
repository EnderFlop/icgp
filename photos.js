window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.imageContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folder = urlParams.get("folder");

  loadImagesFromFolder(folder)

  function loadImagesFromFolder(folder){
    container.innerHTML = ''; // Clear the image container before loading new images
    fetch(`https://api.github.com/repos/EnderFlop/iowacitygraffiti/contents/photos/${folder}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(image => {
          const imageName = image["name"]
          if (imageName.includes(".json")){ //skip .json files
            return
          }
          const outerImageElement = document.createElement('div');
          outerImageElement.classList.add("image")
          const linkElement = document.createElement("a")
          linkElement.href = `piece.html?folder=${folder}&piece=${imageName}`
          const imageElement = document.createElement('img')
          imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${folder}/${imageName}`
          linkElement.appendChild(imageElement)
          outerImageElement.appendChild(linkElement)
          container.appendChild(outerImageElement);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  document.querySelector(".popupImage span").onclick = () => {
    document.querySelector(".popupImage").style.display = "none";
  }
})