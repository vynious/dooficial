import dotenv from "dotenv";
import { Coordinates } from "../types/ModelTypes";
import Logging from "./Logging";

dotenv.config();



// get coordinates from frontend -> pass to backend -> backend processes it
export const nearbyFoodOptions = async (location: Coordinates) => {
    try {
        const {long, lat} = location
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${long}&radius=1500&type=restaurant&key=AIzaSyD7CTQ_WJ-RGRiuWiH1WVcrIaNaCnF5Bco`;
        const data = await fetch(url)
        if (data) {
            return data.json()
        } else {
            return null
        }
    } catch (error) {
        Logging.error(error)
    }
}