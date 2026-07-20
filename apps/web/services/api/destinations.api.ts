import apiClient from '@/lib/axios';
import { DestinationDTO } from '@project/types';

export const destinationsApi = {
  getAll: async (): Promise<DestinationDTO[]> => {
    const response = await apiClient.get<DestinationDTO[]>('/destinations');
    return response.data;
  },

  getById: async (id: string): Promise<DestinationDTO> => {
    const response = await apiClient.get<DestinationDTO>(`/destinations/${id}`);
    return response.data;
  },
};
