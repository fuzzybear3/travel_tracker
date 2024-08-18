import requests
import toml
import logging


# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def get_geocode(city, country):
    url = f'https://nominatim.openstreetmap.org/search?format=json&q="{city},{country}"'

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
    headers = { 'User-Agent':
	'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
	'From': 'stevenrguido@gmail.com'}


    # response = requests.get(url, headers=headers)
    response = requests.get(url)
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


def main(logging_level=logging.INFO):
    input_file = 'cities.toml'
    output_file = 'coordinates.toml'
    
    logging.getLogger().setLevel(logging_level)

    
    cities = read_cities(input_file)
    logging.info(f"{cities}")
    logging.info("steven")
    # print(vars(logging))
    coordinates = []
    
    # test = get_geocode(cities[0])
    # logging.info(tes)

    for place in cities:
        city = place["city"]
        country = place["country"]
        print(city)
        geo_data = get_geocode(city, country)
        if geo_data:
            coordinates.append(geo_data)
        else:
            print("error: could not find Geocode")
            # coordinates[city] = {'error': 'Geocode not found'}

    write_coordinates(output_file, coordinates)

if __name__ == "__main__":
    main(logging_level=logging.DEBUG)

