import axiosClient from 'lib/api/axios-client';
import { FileContext, FileData } from 'lib/types/file';

type CreateFilesRequest = {
  files: {
    data: string; // base64
    filename: string;
    filetype: string;
    context: FileContext;
  }[];
};

type UpdateFileRequest = {
  data: string; // base64
  filename: string;
  filetype: string;
};

export async function getFiles() {
  return (await axiosClient.get<FileData[]>('/files')).data;
}

export async function getFile(id: number) {
  return (await axiosClient.get<FileData>(`/files/${id}`)).data;
}

export async function createFiles(input: CreateFilesRequest) {
  return (await axiosClient.post<FileData>('/files', input)).data;
}

export async function updateFile(id: number, input: UpdateFileRequest) {
  return (await axiosClient.put<FileData>(`/files/${id}`, input)).data;
}

export async function deleteFile(id: number) {
  return (await axiosClient.delete(`/files/${id}`)).data;
}
