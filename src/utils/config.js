export const chain = process.env.REACT_APP_NODE_ENV === "DEV" ? "80001" : "137"

export const contractAddress = process.env.REACT_APP_NODE_ENV === "DEV" ? "0xAAdcdEC98CE6C560C6e4b1C2B1b31258D5C1AF9A" : "0x871679454DFEA476ca5fa96920b6BA2a1e08876b"

export const explorer = process.env.REACT_APP_NODE_ENV === "DEV" ? "https://mumbai.polygonscan.com/" : "https://polygonscan.com"

export const network = process.env.REACT_APP_NODE_ENV === "DEV" ? "Mumbai" : "Polygon"
