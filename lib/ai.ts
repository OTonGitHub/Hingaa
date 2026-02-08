import { supabase } from './supabase';

type SearchResult = {
  matches: string[];
  suggestion: string | null;
};

type MagicFillResult = {
  title: string;
  description: string;
  category: string;
  participantLimit: number;
  date: string;
  time: string;
};

type ModerationResult = {
  safe: boolean;
  reason: string | null;
};

const invokeAi = async <T>(action: string, payload: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke('ai-hingaa', {
    body: { action, payload }
  });

  if (error) throw error;
  return data as T;
};

export const searchActivitiesWithAi = (query: string, activities: { id: string; title: string; desc: string }[]) =>
  invokeAi<SearchResult>('search_activities', { query, activities });

export const magicFillActivity = (input: string) => invokeAi<MagicFillResult>('magic_fill', { input });

export const moderateActivityContent = (title: string, description: string) =>
  invokeAi<ModerationResult>('moderate_activity', { title, description });
