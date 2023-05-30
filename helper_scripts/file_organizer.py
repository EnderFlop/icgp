#this script puts the number of files in each folder into the folders name
#it also renames at least one file in each directory to "preview"

import os

def rename_folders():
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        length = len(os.listdir(path)) // 2 #divided by 2 to remove the .json's
        os.rename(path, path + f" ({length})")

def rename_preview():
    for dir_name in os.listdir(".\photos"):
        path = os.path.join(".\photos", dir_name)
        photos = os.listdir(path)
        if "PREVIEW.jpg" in photos:
            continue
        old_filename = photos[0].split(".")[0]
        os.rename(path + f"\{old_filename}.jpg", path + f"\PREVIEW.jpg")
        os.rename(path + f"\{old_filename}.json", path + f"\PREVIEW.json")

if __name__ == "__main__":
    rename_folders()
    rename_preview()