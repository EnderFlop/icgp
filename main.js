window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  function loadLogo() {
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

    const logoText = document.querySelector("#logo-text")
    logoText.innerHTML = `Logo ${logoChoice + 1} of ${logoCount}`

    logoElem.src = `./media/logo${logoChoice}.png`
  }


  function filterByTagCount(artists) {
    artists.sort(function(a, b){return b[1]["count"] - a[1]["count"];})
    return artists
  }

  // Function to load and display folders
  function loadFolders() {
    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/artist_meta.json')
      .then(response => response.json())
      .then(data => {
        const sortedArtists = filterByTagCount(Object.entries(data))
        sortedArtists.forEach(folder => {
          folder = folder[1] //for each entry we want to use the value not the key
          const folderName = folder["name"]
          const imgCount = folder["count"]

          const window = document.createElement('div');
          window.classList.add("window");
          window.style = "width: 150px"
          
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
          const previewURL = folder["photos"][0]["thumbnail_url"]
          previewImage.src = previewURL

          const folderLinkElement = document.createElement('a');
          folderLinkElement.href = 'photos.html?folder=' + folderName;

          const button = document.createElement("button");
          button.innerText = "See Tags"

          folderLinkElement.appendChild(button)

          windowBody.appendChild(previewImage)
          windowBody.appendChild(folderLinkElement)
          window.appendChild(windowBody)
          folderContainer.appendChild(window);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  loadLogo()
  loadFolders()
  
})