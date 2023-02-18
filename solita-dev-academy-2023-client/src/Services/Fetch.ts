export default async function Fetch(url: URL): Promise<Object> {
    const response = await fetch(url);

    const json = await response.json()

    return json;
}