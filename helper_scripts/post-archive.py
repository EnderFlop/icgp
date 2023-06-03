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

def get_rid_of_JPGs():
    print("Ridding the World of .JPGs")
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        photos = os.listdir(path)
        offenders = [photo for photo in photos if photo[-4:] == ".JPG"]
        if len(offenders) == 0:
            continue
        for photo in offenders:
            old_filename = photo.split(".")[0]
            os.rename(path + f"\{old_filename}.JPG", path + f"\{old_filename}.jpg")

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

def generate_metadata():
    all_artists_list = []
    for folder in os.listdir(".\photos"):
        artist_dict = {}
        artist_dict["name"] = folder
        artist_dict["photos"] = []
        photo_count = 0
        for file in os.listdir(f".\photos\{folder}"):
            photo_dict = {}
            if ".jpg" not in file:
                continue
            photo_count += 1
            name = file[:-4] #remove ".jpg"
            folder_url_name = folder.replace(" ", "%20")
            photo_dict["name"] = name
            photo_dict["thumbnail_url"] = f"https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/{folder_url_name}/{name}_thumbnail.jpeg"
            photo_dict["full_url"] = f"https://raw.githubusercontent.com/EnderFlop/iowacitygraffiti/main/photos/{folder_url_name}/{name}.jpg"
            artist_dict["photos"].append(photo_dict)
        artist_dict["count"] = photo_count
        all_artists_list.append(artist_dict)
    obj = json.dumps(all_artists_list)
    with open(".\\artist_meta.json", "w") as outfile:
        outfile.write(obj)

if __name__ == "__main__":
    #rename_preview()
    #get_rid_of_JPGs()
    #files are renamed BEFORE anything else is generated, keep this order.
    #generate_thumbnails()
    #rename_folders()
    generate_metadata()
    pass