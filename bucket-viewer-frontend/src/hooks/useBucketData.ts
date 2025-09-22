import { useEffect, useState, type Key } from "react";
import { api } from '../services/object-service';

export interface BucketData {
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



export const useBucketData = (expandedKeys: Key | undefined) => {
const [bucketData, setBucketData] = useState<BucketData | null>(null);
const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchBucketData = async () => {
      setLoading(true)
       await new Promise(resolve => setTimeout(resolve, 1000));
       api.get('/bucket', {
          params: {
            prefix: expandedKeys ?? ''
          }
        }).then((response) => {
          setBucketData(response.data);
        })
        .catch((err) => {
          console.log(err)
          setBucketData(null);
        }).finally(() => {
          setLoading(false)
        })
      }
      fetchBucketData();
  }, [expandedKeys]);

  
  return {bucketData, loading};
};
