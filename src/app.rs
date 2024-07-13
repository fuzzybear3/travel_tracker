use leptos::*;
use leptos_leaflet::*;

#[component]
pub fn App() -> impl IntoView {

    
    view! {
    <button>
        // text nodes are wrapped in quotation marks
        "Click me: "
    </button>

          // <MapContainer center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
          // <MapContainer style="height: 400px" center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
          <MapContainer style="height: 98vh" center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"/>
              <Polyline positions=positions(&[(51.505, -0.09), (51.51, -0.1), (51.51, -0.12)]) weight=8.0/>
            </MapContainer>
    }
}
