#this script puts the number of files in each folder into the folders name
#it also renames at least one file in each directory to "preview"

import os
from PIL import Image, ImageOps

def rename_folders():
    print("Renaming Folders")
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        length = len(os.listdir(path)) // 3 #divided by 3 to remove the .jsons and thumbnail images
        #If folder has existing length
        if path[-1:] == ")":
            starting_index = path.find("(")
            new_path = path[:starting_index + 1] + str(length) + ")"
            os.rename(path, new_path)
        #else, new folder with no preexisting length
        else:
            os.rename(path, path + f" ({length})")

def rename_preview():
    print("Renaming Preview Images")
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        photos = os.listdir(path)
        if "PREVIEW.jpg" in photos:
            continue
        old_filename = photos[0].split(".")[0]
        os.rename(path + f"\{old_filename}.jpg", path + f"\PREVIEW.jpg")
        os.rename(path + f"\{old_filename}.json", path + f"\PREVIEW.json")

def generate_thumbnails():
    print("Generating Thumbnails")
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        photos = os.listdir(path)
        for img_file in photos:
            image_name = img_file.split(".")[0]
            #skip jsons...................thumbnails....................and images with thumbnails already
            if (("json" in img_file) or ("thumbnail" in img_file) or (f"{image_name}_thumbnail.jpeg" in photos)):
                continue
            new_path = os.path.join(path, img_file)
            image = Image.open(new_path)
            image = ImageOps.exif_transpose(image) #needed to keep vertical photos vertical
            image.thumbnail((500, 500))
            image.save(f".\photos\{dir_name}\{image_name}_thumbnail.jpeg", "jpeg", optimize=True, quality=10)

def delete_thumbnails():
    print("Deleting Thumbnails!")
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        photos = os.listdir(path)
        for img_file in photos:
            #skip jsons...................thumbnails....................and images with thumbnails already
            if "thumbnail" in img_file:
                os.remove(f".\photos\{dir_name}\{img_file}")

if __name__ == "__main__":
    rename_preview()
    #files are renamed to preview BEFORE thumbnails are generated, keep this order.
    generate_thumbnails()
    rename_folders()
    pass