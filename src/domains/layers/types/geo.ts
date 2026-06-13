/**
 * Tipos de datos geográficos para el Atlas
 * Migrados desde MongoDB Atlas
 */

export interface GeoLayer {
  id: string;
  name: string;
  type: "FeatureCollection";
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoFeature[];
  __v?: number;
}

export interface GeoFeature {
  type: "Feature";
  properties: {
    name?: string | null;
    project?: string | null;
    symbol?: string | null;
    date?: string | null;
    dispersion?: string | null;
    [key: string]: unknown;
  };
  geometry: {
    type:
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][] | number[][][][];
  };
  _id?: {
    $oid: string;
  };
}

export interface CloudinaryImage {
  _id: {
    $oid: string;
  };
  name: string;
  fileName: string;
  url: string;
  __v?: number;
}

export interface OptimizedCloudinaryImage {
  id: string;
  name: string;
  slug: string;
  fileName: string;
  cloudinary: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
  };
  metadata?: {
    uploadedAt?: string;
    source?: string;
  };
}

export interface LayerMetadata {
  id: string;
  name: string;
  slug: string;
  category:
  | "rivers"
  | "boundaries"
  | "nodes"
  | "ecosystems"
  | "conflicts"
  | "other";
  geometryType:
  | "Point"
  | "LineString"
  | "Polygon"
  | "MultiPoint"
  | "MultiLineString"
  | "MultiPolygon";
  featureCount: number;
  description?: string;
}
