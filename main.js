window.addEventListener('DOMContentLoaded', () => {
  const folderContainer = document.querySelector('.folderContainer');

  // Function to load and display folders
  function loadFolders() {
    fetch('photos/')
      .then(response => response.text())
      .then(data => {
        console.log("data")
        console.log(data)
        const tempElement = document.createElement('div');
        tempElement.innerHTML = data;
  
        console.log("folderLinks")
        console.log(Array.from(tempElement.querySelectorAll('a[href]')))
        const folderLinks = Array.from(tempElement.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => href.endsWith('/'));
        
        console.log("done processing folderLinks")
        console.log(folderLinks)
  
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