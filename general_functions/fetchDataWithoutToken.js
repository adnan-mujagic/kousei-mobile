export default async function fetchDataWithoutAuth(urlSuffix, method, body) {
    const url = "https://kouseiapi.herokuapp.com/api" + urlSuffix;
    console.log("Fetching from this url: " + url);
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const results = await response.json();
        return results;
    } catch (error) {
        console.log(error);
    }
}