import os
import json
from PIL import Image, ImageOps

# A bunch of utilities to run before each commit to generate metadata, thumbnails, and everything else.

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
            #skip jsons...................thumbnails.................and images with thumbnails already
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
            if "thumbnail" in img_file:
                os.remove(f".\photos\{dir_name}\{img_file}")

#page will fetch and read folder_meta.json, displaying each folder and the thumbnail. We will generate the link to the next html page in javascript
def generate_folder_list():
    artist_json = {}
    for folder in os.listdir(".\photos"):
        folder_dict = {}
        folder_dict["name"] = folder
        folder_url_name = folder.replace(" ", "%20") #spaces don't autoserialize themselves, you know.
        folder_dict["thumbnail_url"] = f"https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/{folder_url_name}/PREVIEW_thumbnail.jpeg"
        artist_json[folder] = folder_dict
    print(artist_json)
    obj = json.dumps(artist_json)
    with open(".\\folder_meta.json", "w") as outfile:
        outfile.write(obj)

#page will fetch and read artist_meta.json, linking to the full image and displaying each thumbnail.
def generate_photo_list():
    meta_json = []
    for folder in os.listdir(".\photos"):
        for file in os.listdir(f".\photos\{folder}"):
            photo_dict = {}
            if ".jpg" not in file:
                continue
            name = file[:-4] #remove ".jpg"
            photo_dict["folder"] = folder
            photo_dict["name"] = name
            folder_url_name = folder.replace(" ", "%20")
            photo_dict["thumbnail_url"] = f"https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/{folder_url_name}/{name}_thumbnail.jpeg"
            photo_dict["full_url"] = f"https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/{folder_url_name}/{name}.jpg"
            meta_json.append(photo_dict)
    obj = json.dumps(meta_json)
    with open(".\\artist_meta.json", "w") as outfile:
        outfile.write(obj)

if __name__ == "__main__":
    #rename_preview()
    #files are renamed to preview BEFORE thumbnails are generated, keep this order.
    #generate_thumbnails()
    #rename_folders()
    #generate_folder_list()
    generate_photo_list()
    pass