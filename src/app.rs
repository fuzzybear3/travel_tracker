use std::time::Duration;

use leptos::*;
use leptos_leaflet::*;

#[component]
pub fn App() -> impl IntoView {

    
    view! {
          <MapContainer style="height: 400px" center=Position::new(51.505, -0.09) zoom=13.0 set_view=true>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"/>
                <Marker position=position!(51.5, -0.065) draggable=true >
                  <Popup>
                      <strong>{"A pretty CSS3 popup:) "}</strong>
                  </Popup>
              </Marker>
              <Tooltip position=position!(51.5, -0.06) permanent=true direction="top">
                  <strong>{"And a tooltip"}</strong>
              </Tooltip>
              <Polyline positions=positions(&[(51.505, -0.09), (51.51, -0.1), (51.51, -0.12)])/>
              <Polygon color="purple" positions=positions(&[ (51.515, -0.09), (51.52, -0.1), (51.52, -0.12)]) >
                <Tooltip sticky=true direction="top">
                    <strong>{"I'm a polygon"}</strong>
                </Tooltip>
            </Polygon>
            <Circle center=position!(51.505, -0.09) color="blue" radius=200.0>
                <Tooltip sticky=true>{"I'm a circle"}</Tooltip>
            </Circle>
        </MapContainer>
    }
}
