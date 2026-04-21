import { useEffect, useCallback } from "react";
import { postReportN8n } from "./postReportN8n";
import type { ReportPostData } from "../types/reportForm";

const QUEUE_KEY = "report_offline_queue";

export interface QueuedRecord {
  id: string;
  data: ReportPostData;
  savedAt: string;
}

export const loadQueue = (): QueuedRecord[] => {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveToQueue = (data: ReportPostData): QueuedRecord => {
  const queue = loadQueue();
  const record: QueuedRecord = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    data,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, record]));
  return record;
};

const removeFromQueue = (id: string) => {
  const queue = loadQueue().filter((r) => r.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const useOfflineQueue = (
  onSuccess?: (record: QueuedRecord) => void,
  onRetrying?: (count: number) => void
) => {
  const flushQueue = useCallback(async () => {
    const queue = loadQueue();
    if (queue.length === 0) return;

    onRetrying?.(queue.length);

    for (const record of queue) {
      try {
        await postReportN8n(record.data);
        removeFromQueue(record.id);
        onSuccess?.(record);
      } catch {
      }
    }
  }, [onSuccess, onRetrying]);

  useEffect(() => {
    if (navigator.onLine) {
      flushQueue();
    }
  }, [flushQueue]);

  useEffect(() => {
    window.addEventListener("online", flushQueue);
    return () => window.removeEventListener("online", flushQueue);
  }, [flushQueue]);

  return { flushQueue };
};