import {useState, useEffect} from 'react';
import axiosInstance from '@/utils/axiosConfig';

const useFiles = () => {
  const [files, setFiles] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/ddd/user/');
      const data = response.data.results;

      data.forEach(file => {
        const dddfile = file.dddfile;
        const lastSlashIndex = dddfile.lastIndexOf('/');
        const lastDotIndex = dddfile.lastIndexOf('.');

        if (
          lastSlashIndex !== -1 &&
          lastDotIndex !== -1 &&
          lastDotIndex > lastSlashIndex
        ) {
          file.name = dddfile.slice(lastSlashIndex + 1, lastDotIndex);
        } else {
          file.name = '';
        }
      });

      setFiles(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching files');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesRefresh = async () => {
    try {
      const response = await axiosInstance.get('/ddd/user/');
      const data = response.data.results;

      data.forEach(file => {
        const dddfile = file.dddfile;
        const lastSlashIndex = dddfile.lastIndexOf('/');
        const lastDotIndex = dddfile.lastIndexOf('.');

        if (
          lastSlashIndex !== -1 &&
          lastDotIndex !== -1 &&
          lastDotIndex > lastSlashIndex
        ) {
          file.name = dddfile.slice(lastSlashIndex + 1, lastDotIndex);
        } else {
          file.name = '';
        }
      });

      setFiles(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {files, loading, error, fetchFilesRefresh};
};

export default useFiles;
