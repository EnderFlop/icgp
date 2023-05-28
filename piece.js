window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.pieceContainer');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const folderName = urlParams.get("folder");
  const pieceName = urlParams.get("piece");
  
  loadPiece(folderName, pieceName)

  function loadPiece(folder, piece){
    container.innerHTML = ""

    const outerImageElement = document.createElement('div')
    outerImageElement.classList.add("image")

    const imageElement = document.createElement('img')
    imageElement.src = `https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/${folder}/${piece}`
    
    outerImageElement.appendChild(imageElement)

    container.appendChild(outerImageElement)
    }
})