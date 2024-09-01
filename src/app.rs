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

    static_toml::static_toml! {
        static MAP_DATA = include_toml!("map_data/coordinates.toml");
    }

    let mut my_positions: Vec<Position> = Vec::new();

    for location in MAP_DATA.coordinates.iter() {
        let pos = Position {
            lat: location.latitude,
            lng: location.longitude,
        };
        my_positions.push(pos);
    }

    view! {
        <NavBar/>

        <button on:click=move |_| {
            set_count.update(|n| *n += 1);
        }>

            "Click me"
        </button>
        <br/>

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
