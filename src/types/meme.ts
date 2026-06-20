import { FeatureVector } from "./landmarks";

export type MemeEntry = {
  id: string;
  url: string;
  features?: FeatureVector;
};

export type MemeLibrary = MemeEntry[];
