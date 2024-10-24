export const search = async (q: string) => {
  const res = await fetch(
    `https://hub.docker.com/api/search/v3/catalog/search?query=${q}&source=store&official=true&open_source=true&from=0&size=4`
  );
  return await res.json();
};
