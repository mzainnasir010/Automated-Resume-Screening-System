// client/lib/types.ts
export type ExtractionStatus = "ok" | "empty_text" | "parse_error";
export type NameSource = "extracted" | "filename";

export interface CandidateRecord {
  candidate_id: string;
  name: string;
  name_source: NameSource;
  source_file: string;
  extraction_status: ExtractionStatus;
  raw_text_chars: number;
  skills_found: string[];
  skills_matched: string[];
  skills_missing: string[];
  similarity_raw: number;
  match_score: number;
  rank: number;
  summary: string;
  warnings: string[];
}

export interface JobDescriptionResult {
  job_title: string;
  raw_text: string;
  required_skills: string[];
  essential_skills: string[];
  desirable_skills: string[];
}

export type FileStatus = "queued" | "uploading" | "ready" | "error";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: FileStatus;
  error?: string;
}