window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  function filterByTagCount(artists) {
    artists.forEach(a => {console.log(a[1]["count"])})
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
          console.log(folder)
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

  loadFolders()
})