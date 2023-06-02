import json
import sys
import shutil
import os
import re

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

    #the following uses a regex to match "Streetart" with "Streetart (40)"
    folders = os.listdir("../photos/")
    regex = re.compile(r"\b" + re.escape(artist) + r"\b")
    try:
        valid_folder = list(filter(regex.match, folders))[0]
    except IndexError: #path does not exist
        os.makedirs(f"../photos/{artist}")
        valid_folder = artist

    artist_folder = f"../photos/{valid_folder}"
    #write json
    with open(f"{artist_folder}/{img_name}.json", "w") as outfile:
        outfile.write(obj)
    #move image
    shutil.move(img_path, artist_folder)

#update below values depending on when and were the photos were taken
DATE = "6/1/2023"
LOCATION = "Elray's Alley"
create_description(DATE, LOCATION)
