import axios from "axios";

const Instance = axios.create({
    baseURL: "http://localhost:5000",
});

export default Instance;