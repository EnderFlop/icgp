window.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('imageContainer');

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folderName = urlParams.get("folder");

  loadImagesFromFolder(folderName)

  function loadImagesFromFolder(folderName){
    imageContainer.innerHTML = ''; // Clear the image container before loading new images
    fetch('photos/' + folderName)
      .then(response => response.text())
      .then(data => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = data;

        const imageLinks = Array.from(tempElement.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => {
            const imageName = href.split('/').filter(Boolean).pop();
            const extension = imageName.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
          });

        imageLinks.forEach(imageLink => {
          const imageName = imageLink.split('/').filter(Boolean).pop();
          const imageElement = document.createElement('img');
          imageElement.src = "photos/" + folderName + '/' + imageName;
          imageContainer.appendChild(imageElement);
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
})