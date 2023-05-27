window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.imageContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folderName = urlParams.get("folder");

  loadImagesFromFolder(folderName)

  function loadImagesFromFolder(folderName){
    container.innerHTML = ''; // Clear the image container before loading new images
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

          const outerImageElement = document.createElement('div');
          outerImageElement.classList.add("image")
          const imageElement = document.createElement('img')
          imageElement.src = "photos/" + folderName + '/' + imageName;
          imageElement.onclick = () => {
            document.querySelector(".popupImage").style.display = "block";
            document.querySelector(".popupImage img").src = imageElement.getAttribute("src");
          }
          outerImageElement.appendChild(imageElement)


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