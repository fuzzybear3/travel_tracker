import requests
import toml
import logging
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def get_geocode(city, country):
            # https://nominatim.openstreetmap.org/search?format=json&q=Kaohsiung,Taiwan&accept-language=en
    url = f'https://nominatim.openstreetmap.org/search?format=json&q="{city},{country}"&accept-language=en'

    # url = f'https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1'
    # headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    # headers ={ 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0'}
    # headers = {
    #     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
    #     'Accept-Encoding': 'gzip, deflate, br, zstd',
    #     'Accept-Language': 'en-US,en;q=0.5',
    #     'Connection': 'keep-alive',
    #     'DNT': '1',
    #     'Host': 'nominatim.openstreetmap.org',
    #     'Priority': 'u=0, i',
    #     'Sec-Fetch-Dest': 'document',
    #     'Sec-Fetch-Mode': 'navigate',
    #     'Sec-Fetch-Site': 'none',
    #     'Sec-Fetch-User': '?1',
    #     'Sec-GPC': '1',
    #     'Upgrade-Insecure-Requests': '1',
    #     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0'
    # }
 #    headers = { 'User-Agent':
	# 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
	# 'From': 'stevenrguido@gmail.com'}

    headers = { 'User-Agent':
	'travel-tracker/1.0 (stevenrguido@gmail.com)',
	'From': 'stevenrguido@gmail.com',
	'Referer': 'https://stevenguido.com/'}

    response = requests.get(url, headers=headers)
    # response = requests.get(url)
    logging.info(response)
    data = response.json()
    logging.info(data)
    if data:
        logging.info(f"Geocode for {city}: {data[0]['lat']}, {data[0]['lon']}")
        return {
            'city': city,
            'latitude': float(data[0]['lat']),
            'longitude': float(data[0]['lon'])
        }
    else:
        logging.warning(f"Geocode not found for {city}")
        return None

def read_cities(file_path):
    with open(file_path, 'r') as file:
        data = toml.load(file)
        return data['cities']

def write_coordinates(file_path, coordinates):
    with open(file_path, 'w') as file:
        toml.dump({'coordinates': coordinates}, file)

def get_cached_coordinates(file_path):
    with open(file_path, 'r') as file:
        data = toml.load(file)
        return data['coordinates']


def main(logging_level=logging.INFO):
    input_file = 'cities.toml'
    output_file = 'coordinates.toml'
    
    logging.getLogger().setLevel(logging_level)

    
    cities = read_cities(input_file)
    logging.info(f"{cities}")
    logging.info("steven")
    coordinates = []

    cached_coordinates = get_cached_coordinates(output_file)
    len_cached_coordinates = len(cached_coordinates)
    logging.info(f"There are {len_cached_coordinates} cached coordinates")

    # find the first place where the cache is out of date.
    correct_cached_places = []

    for i in range(len(cached_coordinates)):
        listed_place = cities[i]["city"]
        potenial_cached_place = cached_coordinates[i]["city"]
        logging.debug(f"comparing {listed_place} and {potenial_cached_place}")
        
        if listed_place == potenial_cached_place:
            print(f"{listed_place} is cached; skipping..")
            correct_cached_places.append(cached_coordinates[i])
        else:
            logging.warning(f"cache not found for {listed_place}. regetting the rest of the list")
            break


    missing_places = cities[len(correct_cached_places):]

    for i, place in enumerate(missing_places):
        
        city = place["city"]
        country = place["country"]
        print(city)
        geo_data  = get_geocode(city, country)
        if geo_data:
            coordinates.append(geo_data)
        else:
            print("error: could not find Geocode")
        time.sleep(1)


    coordinates = correct_cached_places + coordinates
    write_coordinates(output_file, coordinates)

if __name__ == "__main__":
    main(logging_level=logging.WARNING)

