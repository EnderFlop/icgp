window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.getElementById('folderContainer');

  // Function to load and display folders
  function loadFolders() {
    fetch('photos/')
      .then(response => response.text())
      .then(data => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = data;
  
        const folderLinks = Array.from(tempElement.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => href.endsWith('/'));
  
        folderLinks.forEach(folderLink => {
          const folderName = folderLink.split('/').filter(Boolean).pop();
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