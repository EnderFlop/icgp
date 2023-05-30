window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  // Function to load and display folders
  function loadFolders() {
    fetch('https://tame-vampirebat-36.telebit.io/folders')
      .then(response => response.json())
      .then(data => {
        data.forEach(folder => {
          const folderName = folder["name"]

          const folderOuterElement = document.createElement('div');
          folderOuterElement.classList.add("folderOuterElement");

          const previewImage = document.createElement('img');
          previewImage.classList.add("previewImage")
          previewImage.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${folderName}/PREVIEW.jpg`

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