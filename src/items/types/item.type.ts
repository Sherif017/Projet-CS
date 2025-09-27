export type Item = {
  id: string;
  name: string;
  coords: { lat: number; lon: number };
  imageUrl?: string;
  type?: string;      // ex: type_etablissement ou secteur
  favorite: boolean;
  details?: Record<string, any>; // pour le endpoint détail
};
