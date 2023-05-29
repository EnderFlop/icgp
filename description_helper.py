import json
import sys
import shutil
import os

def get_image_name(img_path):
    img_path = img_path.split("\\")[-1]
    img_path = img_path.split(".")[0]
    return img_path


def create_description(date, location):
    img_path = sys.argv[1]
    img_name = get_image_name(img_path)
    print(f"LOCATION: {location}")
    artist = input("Artist: ")
    notes = input("Notes: ")
    data = {
        "artist": artist,
        "date_photographed": date,
        "location": location,
        "img_name": img_name,
        "notes": notes
    }
    obj = json.dumps(data)

    artist_folder = f"./photos/{artist}"
    #if it doesn't exist, create folder
    if not os.path.exists(artist_folder):
        os.makedirs(artist_folder)
    #write json
    with open(f"{artist_folder}/{img_name}.json", "w") as outfile:
        outfile.write(obj)
    #move image
    shutil.move(img_path, artist_folder)

#update below values depending on when and were the photos were taken
DATE = "5/29/2023"
LOCATION = "IMU Bridge (West)"
create_description(DATE, LOCATION)