export const API_URL = "http://localhost:1337/api";

export const getHeader = async () => {
  let res = await fetch(`${API_URL}/header?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch header");
  return res.json();
};

export const getCharacters = async () => {
  let res = await fetch(`${API_URL}/characters?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
};

export const getCharacter = async (id: string | string[]) => {
  let res = await fetch(
    `${API_URL}/characters/${id}?populate[0]=*&populate[jutsus][populate]=images&populate[clan][populate]=symbol&populate[nature][populate]=image&populate[kekkei_genkai][populate]=image&populate[affiliations]=*&populate[images]=*`
  );
  if (!res.ok) throw new Error("Failed to fetch character");
  return res.json();
};

export const getClans = async () => {
  let res = await fetch(`${API_URL}/clans?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch clans");
  return res.json();
};

export const getVillages = async () => {
  let res = await fetch(`${API_URL}/villages?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch villages");
  return res.json();
};

export const getNatures = async () => {
  let res = await fetch(`${API_URL}/nature-types?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch natures");
  return res.json();
};

export const getKekkeiGenkais = async () => {
  let res = await fetch(`${API_URL}/kekkei-genkais?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch kekkei genkais");
  return res.json();
};

export const getClassifications = async () => {
  let res = await fetch(`${API_URL}/jutsu-types?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch classifications");
  return res.json();
};

export const getJutsus = async () => {
  let res = await fetch(`${API_URL}/jutsus?populate=*&sort=createdAt`);
  if (!res.ok) throw new Error("Failed to fetch jutsus");
  return res.json();
};

export const getJutsu = async (id: string | string[]) => {
  let res = await fetch(
    `${API_URL}/jutsus/${id}?populate[0]=*&populate[parent_jutsu][populate]=images&populate[derived_jutsu][populate]=images&populate[classification]=*&populate[nature][populate]=image&populate[kekkei_genkai][populate]=image&populate[users][populate]=images&populate[images]=*`
  );
  if (!res.ok) throw new Error("Failed to fetch jutsu");
  return res.json();
};
