import axiosClient from 'lib/api/axios-client';
import { FileContext, ImageData } from 'lib/types/file';

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
  return (await axiosClient.get<ImageData[]>('/files')).data;
}

export async function getFile(id: number) {
  return (await axiosClient.get<ImageData>(`/files/${id}`)).data;
}

export async function createFiles(input: CreateFilesRequest) {
  return (await axiosClient.post<ImageData>('/files', input)).data;
}

export async function updateFile(id: number, input: UpdateFileRequest) {
  return (await axiosClient.put<ImageData>(`/files/${id}`, input)).data;
}

export async function deleteFile(id: number) {
  return (await axiosClient.delete(`/files/${id}`)).data;
}
