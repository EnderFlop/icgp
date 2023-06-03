window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  // Function to load and display folders
  function loadFolders() {
    fetch('https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/artist_meta.json')
      .then(response => response.json())
      .then(data => {
        Object.entries(data).forEach(folder => {
          folder = folder[1] //for each entry we want to use the value not the key
          const folderName = folder["name"]

          const folderOuterElement = document.createElement('div');
          folderOuterElement.classList.add("folderOuterElement");

          const previewImage = document.createElement('img');
          previewImage.classList.add("previewImage")
          console.log(folder)
          const previewURL = folder["photos"][0]["thumbnail_url"]
          previewImage.src = previewURL

          const folderLinkElement = document.createElement('a');
          folderLinkElement.href = 'photos.html?folder=' + folderName;
          folderLinkElement.innerText = folderName;
          
          folderOuterElement.appendChild(previewImage)
          folderOuterElement.appendChild(folderLinkElement)
          folderContainer.appendChild(folderOuterElement);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  loadFolders()
})