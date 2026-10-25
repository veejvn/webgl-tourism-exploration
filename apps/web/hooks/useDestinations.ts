import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/services/api';
import { toast } from 'sonner';

export function useDestinations() {
  const query = useQuery({
    queryKey: ['destinations'],
    queryFn: () => destinationsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (query.error) {
    toast.error('Không thể tải danh sách điểm đến. Vui lòng thử lại sau.');
  }

  return query;
}

export function useDestination(id: string) {
  const query = useQuery({
    queryKey: ['destinations', id],
    queryFn: () => destinationsApi.getById(id),
    enabled: !!id,
  });

  if (query.error) {
    toast.error('Không thể tải thông tin điểm đến. Vui lòng thử lại sau.');
  }

  return query;
}
