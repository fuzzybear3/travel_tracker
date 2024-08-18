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
    // name: String,
    latitude: f64,
    longitude: f64,
}

#[component]
pub fn App() -> impl IntoView {
    let (count, set_count) = create_signal(0);

    // let locations: Vec<Location> = vec![
    //     Location {
    //         name: "San Francisco",
    //         latitude: 37.7792588,
    //         longitude: -122.4193286,
    //     },

    static_toml::static_toml! {
        static MAP_DATA = include_toml!("map_data/coordinates.toml");
    }

    // let _ = &MAP_DATA.coordinates.iter();

    for place in MAP_DATA.coordinates.iter() {}

    let mut my_positions: Vec<Position> = Vec::new();

    for location in MAP_DATA.coordinates.iter() {
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
        // {MAP_DATA[0].name}
        // {locations.last().unwrap().name}
        // {format!("{:?}", my_positions)}

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
