window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  // Function to load and display folders
  function loadFolders() {
    fetch('https://api.github.com/repos/EnderFlop/iowacitygraffiti/contents/photos')
      .then(response => response.json())
      .then(data => {
        data.forEach(folder => {
          const folderName = folder["name"]
          const folderLinkElement = document.createElement('a');
          folderLinkElement.href = 'photos.html?folder=' + folderName;
          folderLinkElement.innerText = folderName;
          
          folderContainer.appendChild(folderLinkElement);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  loadFolders()
})