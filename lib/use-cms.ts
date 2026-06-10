"use client";

import { useCallback, useEffect, useState } from "react";

type CollectionResource<T extends { id: string }> = {
  list: () => Promise<T[]>;
  create: (body: Omit<T, "id">) => Promise<T>;
  update: (id: string, body: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<{ id: string }>;
};

type SingletonResource<T> = {
  get: () => Promise<T>;
  update: (body: Partial<T>) => Promise<T>;
};

const message = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export function useCollection<T extends { id: string }>(resource: CollectionResource<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    resource
      .list()
      .then((data) => active && (setItems(data), setError(null)))
      .catch((e) => active && setError(message(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource]);

  const create = useCallback(
    async (body: Omit<T, "id">) => {
      const created = await resource.create(body);
      setItems((prev) => [created, ...prev]);
      return created;
    },
    [resource]
  );

  const update = useCallback(
    async (id: string, body: Partial<T>) => {
      const updated = await resource.update(id, body);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      return updated;
    },
    [resource]
  );

  const remove = useCallback(
    async (id: string) => {
      await resource.remove(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    },
    [resource]
  );

  return { items, setItems, loading, error, create, update, remove };
}

export function useSingleton<T>(resource: SingletonResource<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    resource
      .get()
      .then((d) => active && (setData(d), setError(null)))
      .catch((e) => active && setError(message(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource]);

  const save = useCallback(
    async (body: Partial<T>) => {
      const updated = await resource.update(body);
      setData(updated);
      return updated;
    },
    [resource]
  );

  return { data, setData, loading, error, save };
}
