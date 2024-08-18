use leptos::*;
use leptos_leaflet::*;
use leptos_router::*;

// use serde::Deserialize;
// use std::fs;
//
// #[derive(Deserialize, Debug)]
// struct Coordinates {
//     latitude: String,
//     longitude: String,
// }
//
// #[derive(Deserialize, Debug)]
// struct Location {
//     coordinates: Coordinates,
//     name: String,
// }

// #[derive(Deserialize, Debug)]
// struct Config {
//     coordinates: Vec<Location>,
// }

#[component]
pub fn NavBar() -> impl IntoView {
    view! {
        <Router>
            <nav></nav>
            <main></main>
        </Router>
    }
}

#[component]
fn ProgressBar(
    // Marks this as an optional prop. It will default to the default
    // value of its type, i.e., 0.
    #[prop(default = 100)]
    /// The maximum value of the progress bar.
    max: u16,
    // Will run `.into()` on the value passed into the prop.
    #[prop(into)]
    // `Signal<T>` is a wrapper for several reactive types.
    // It can be helpful in component APIs like this, where we
    // might want to take any kind of reactive value
    /// How much progress should be displayed.
    progress: Signal<i32>,
) -> impl IntoView {
    view! {
        <progress max=max value=progress></progress>
        <br/>
    }
}

struct Location {
    name: &'static str,
    latitude: f64,
    longitude: f64,
}

#[component]
pub fn App() -> impl IntoView {
    let (count, set_count) = create_signal(0);

    let locations: Vec<Location> = vec![
        Location {
            name: "San Francisco",
            latitude: 37.7792588,
            longitude: -122.4193286,
        },
        Location {
            name: "Athens",
            latitude: 33.9597677,
            longitude: -83.376398,
        },
        Location {
            name: "Kalabaka",
            latitude: 39.7070178,
            longitude: 21.6279431,
        },
        Location {
            name: "Corfu",
            latitude: 42.9600595,
            longitude: -78.4055767,
        },
        Location {
            name: "Catania",
            latitude: 37.5023612,
            longitude: 15.0873718,
        },
        Location {
            name: "Naples",
            latitude: 40.8358846,
            longitude: 14.2487679,
        },
        Location {
            name: "Pisa",
            latitude: 43.4714722,
            longitude: 10.679791173704576,
        },
        Location {
            name: "Marseille",
            latitude: 43.2961743,
            longitude: 5.3699525,
        },
        Location {
            name: "Barcelona",
            latitude: 41.3828939,
            longitude: 2.1774322,
        },
        Location {
            name: "Porto",
            latitude: 41.1494512,
            longitude: -8.6107884,
        },
        Location {
            name: "Lisbon",
            latitude: 38.7077507,
            longitude: -9.1365919,
        },
        Location {
            name: "Lagos",
            latitude: 6.4550575,
            longitude: 3.3941795,
        },
        Location {
            name: "Sagres",
            latitude: -21.8840628,
            longitude: -50.9574608,
        },
        Location {
            name: "Albufeira",
            latitude: 37.088241,
            longitude: -8.2526339,
        },
        Location {
            name: "Faro",
            latitude: 37.0162727,
            longitude: -7.9351771,
        },
        Location {
            name: "Marrakesh",
            latitude: 31.6258257,
            longitude: -7.9891608,
        },
        Location {
            name: "Taghazout",
            latitude: 30.544722,
            longitude: -9.709128,
        },
        Location {
            name: "Merzouga",
            latitude: 31.0999166,
            longitude: -4.0140878,
        },
        Location {
            name: "London",
            latitude: 51.4893335,
            longitude: -0.14405508452768728,
        },
        Location {
            name: "Amsterdam",
            latitude: 52.3730796,
            longitude: 4.8924534,
        },
        Location {
            name: "Hamburg",
            latitude: 53.550341,
            longitude: 10.000654,
        },
        Location {
            name: "Copenhagen",
            latitude: 55.6867243,
            longitude: 12.5700724,
        },
        Location {
            name: "Berlin",
            latitude: 52.5108638,
            longitude: 13.3989421,
        },
        Location {
            name: "Munich",
            latitude: 48.1371079,
            longitude: 11.5753822,
        },
        Location {
            name: "Vienna",
            latitude: 48.2083537,
            longitude: 16.3725042,
        },
        Location {
            name: "Prague",
            latitude: 50.0874654,
            longitude: 14.4212535,
        },
        Location {
            name: "Budapest",
            latitude: 47.48138955,
            longitude: 19.14609412691246,
        },
    ];

    let mut my_positions: Vec<Position> = Vec::new();

    for location in &locations {
        let pos = Position {
            lat: location.latitude,
            lng: location.longitude,
        };
        my_positions.push(pos);
        // location.name, location.latitude, location.longitude
    }

    let double_count = move || count() * 2;
    view! {
        <NavBar/>

        <button on:click=move |_| {
            set_count.update(|n| *n += 1);
        }>

            "Click me"
        </button>
        <br/>
        // If you have this open in CodeSandbox or an editor with
        // rust-analyzer support, try hovering over `ProgressBar`,
        // `max`, or `progress` to see the docs we defined above
        // <ProgressBar max=50 progress=count/>
        // Let's use the default max value on this one
        // the default is 100, so it should move half as fast
        // <ProgressBar progress=count/>
        // Signal::derive creates a Signal wrapper from our derived signal
        // using double_count means it should move twice as fast
        // <ProgressBar max=50 progress=Signal::derive(double_count)/>

        // <button>
        // // text nodes are wrapped in quotation marks
        // "Click me: "
        // </button>

        // Read map data
        // test
        //
        // {locations[0].name}
        // {locations.last().unwrap().name}
        {format!("{:?}", my_positions)}

        // <MapContainer center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
        // <MapContainer style="height: 400px" center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
        <MapContainer
            style="height: 98vh"
            center=Position::new(51.505, -0.09)
            zoom=13.0
            set_view=true
        >
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
            />
            <Polyline
                // positions=positions(&[(51.505, -0.09), (51.51, -0.1), (51.51, -0.12)])
                positions=my_positions
                weight=8.0
            />
        </MapContainer>
    }
}

// fn read_map_data() {
//     let toml_content = fs::read_to_string("coordinates.toml").expect("couldn't open file");
//
//     // Parse the string into the Config struct
//     let config: Config = toml::from_str(&toml_content).expect("can't parse toml string");
//
//     // Print the parsed data
//     println!("{:?}", config);
// }
