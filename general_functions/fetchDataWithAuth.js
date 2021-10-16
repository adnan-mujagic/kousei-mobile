export default async function fetchDataWithAuth(urlSuffix, method, body, token){
    const url = "https://kouseiapi.herokuapp.com/api" + urlSuffix;
    console.log("Fetching from: "+ url);
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                "Authentication": token
            },
            body: JSON.stringify(body)
        });
        const results = await response.json();
        return results;
    } catch (error) {
        console.log(error);
    }
}