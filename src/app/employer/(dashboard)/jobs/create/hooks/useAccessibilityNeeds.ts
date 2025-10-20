'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AccessibilityNeedOption {
  id: number;
  name: string;
}

const fetchAccessibilityNeeds = async (): Promise<AccessibilityNeedOption[]> => {
  const { data } = await api.get<AccessibilityNeedOption[]>('/v1/accessibility-needs');
  return data;
};

export const useAccessibilityNeeds = () => {
  return useQuery<AccessibilityNeedOption[], Error>({
    queryKey: ['accessibilityNeeds'],
    queryFn: fetchAccessibilityNeeds,
  });
};
