window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.pieceContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folderName = urlParams.get("folder");
  const pieceName = urlParams.get("piece");
  
  loadPiece(folderName, pieceName)

  function loadPiece(folder, piece){
    container.innerHTML = ""
    fetch(`photos/${folder}/${piece}`)
      .then(response => response.blob())
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob)

        const outerImageElement = document.createElement('div')
        outerImageElement.classList.add("image")
        const imageElement = document.createElement('img')
        imageElement.src = imageUrl
        // photos/${folder}/${piece} also works
        outerImageElement.appendChild(imageElement)
        container.appendChild(outerImageElement)
      })
      .catch(error => {
        console.log('Error:', error);
      })
    }
})