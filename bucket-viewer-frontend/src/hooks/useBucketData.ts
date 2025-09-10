import axios from 'axios';
import { useEffect, useState, type Key } from "react";

interface BucketData {
  commonPrefixes: {
          Prefix: Key
    }[],
    contents: null | {
      Key: string,
      LastModified: Date,
      ETag: string,
      ChecksumAlgorithm: string[],
      ChecksumType: string,
      Size: number,
      StorageClass: string
    }[]
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_DEV_SERVER_PORT}`,
  timeout: 10000,
});

export const useBucketData = (expandedKeys: Key | undefined) => {
const [bucketData, setBucketData] = useState<BucketData | null>(null);

  useEffect(() => {
    const fetchBucketData = async () => {

       api.get('/bucket', {
          params: {
            prefix: expandedKeys ?? ''
          }
        }).then((response) => {
          console.log(response)
          setBucketData(response.data);
        })
        .catch((err) => {
          console.log(err)
          setBucketData(null);
        })
      }
      fetchBucketData();
  }, [expandedKeys]);

  
  return {bucketData};
};
