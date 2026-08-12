'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

type RealtimeOptions<T> = {
  table: string;
  schema?: string;
  select?: string;
  filter?: Record<string, string | number | boolean>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean;
};

type RealtimeResult<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useSupabaseRealtime<T = Record<string, unknown>>(
  options: RealtimeOptions<T>
): RealtimeResult<T> {
  const {
    table,
    schema = 'public',
    select = '*',
    filter,
    orderBy,
    limit,
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from(table).select(select);
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value) as typeof query;
        });
      }
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false }) as typeof query;
      }
      if (limit) {
        query = query.limit(limit) as typeof query;
      }
      const { data: rows, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setData((rows as T[]) || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [table, select, JSON.stringify(filter), orderBy?.column, orderBy?.ascending, limit, enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();

    // Real-time subscription
    const channelName = `realtime-${table}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema, table }, () => {
        fetchData();
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchData, enabled, schema, table]);

  return { data, loading, error, refetch: fetchData };
}

// Specialized hook for a single record
export function useSupabaseRecord<T = Record<string, unknown>>(
  table: string,
  id: string | null,
  select = '*'
): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: row, error: fetchError } = await supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;
      setData(row as T);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [table, id, select]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for KPI counts
export function useSupabaseCount(
  table: string,
  filter?: Record<string, string | number | boolean>
): { count: number; loading: boolean } {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCount = useCallback(async () => {
    try {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value) as typeof query;
        });
      }
      const { count: c } = await query;
      setCount(c || 0);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [table, JSON.stringify(filter)]);

  useEffect(() => {
    fetchCount();
    const channel = supabase
      .channel(`count-${table}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fetchCount)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchCount, table]);

  return { count, loading };
}
