import { CandidateRecord, JobDescriptionResult } from "./types";
import { MOCK_CANDIDATES, MOCK_JOB_DESCRIPTION } from "./mock-data";

// Flip to false once the FastAPI backend endpoints are live.
const USE_MOCK_DATA = false;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function delay<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function uploadResumes(
  files: File[]
): Promise<{ accepted: string[] }> {
  if (USE_MOCK_DATA) {
    return delay({ accepted: files.map((f) => f.name) });
  }
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function submitJobDescription(
  text: string
): Promise<JobDescriptionResult> {
  if (USE_MOCK_DATA) {
    return delay(MOCK_JOB_DESCRIPTION, 1200);
  }
  const res = await fetch(`${API_BASE_URL}/job-description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Job description processing failed");
  return res.json();
}

export async function submitJobDescriptionFile(
  file: File
): Promise<JobDescriptionResult> {
  if (USE_MOCK_DATA) {
    return delay(MOCK_JOB_DESCRIPTION, 1200);
  }
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/job-description/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Job description file processing failed");
  }
  return res.json();
}

export async function getRankedResults(): Promise<CandidateRecord[]> {
  if (USE_MOCK_DATA) {
    return delay(MOCK_CANDIDATES, 1500);
  }
  const res = await fetch(`${API_BASE_URL}/score`, { method: "POST" });
  if (!res.ok) throw new Error("Scoring failed");
  return res.json();
}

export async function resetSession(): Promise<void> {
  if (USE_MOCK_DATA) return;
  await fetch(`${API_BASE_URL}/reset`, { method: "POST" });
}