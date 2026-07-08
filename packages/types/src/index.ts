export enum Role {
  VISITOR = 'VISITOR',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LandmarkDTO {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  modelUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DestinationDTO {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  modelUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  landmarks?: LandmarkDTO[];
}
