window.addEventListener("DOMContentLoaded", () => {
  const folderContainer = document.getElementById("folderContainer")
  const imageContainer = document.getElementById("imageContainer")

  const folders = [
    "pics1",
    "pics2"
  ]

  folders.forEach(folder => {
    const folderLink = document.createElement("a")
    folderLink.href = "#"
    folderLink.innerText = folder
    folderContainer.appendChild(folderLink)

    folderLink.addEventListener("click", (event) => {
      event.preventDefault();
      imageContainer.innerHTML = ""
      loadImagesFromFolder(`photos/${folder}`)
    })
  })
})

function loadImagesFromFolder(path) {
  const imageFiles = [
    "1.jpg",
    "2.jpg"
  ]

  imageFiles.forEach(imageFile => {
    const imageElem = document.createElement('img')
    imageElem.src = `${path}/${imageFile}`
    imageContainer.appendChild(imageElem)
  })
}

