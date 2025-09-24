import Icon from "@ant-design/icons";
import { Button, message, Upload, type UploadProps } from "antd";
import { type Key } from "react";
import { api } from "../services/object-service";

type UploadToBucketProps = {
  prefix: Key;
  refresh: () => void;
};
export const UploadToBucket = ({ prefix, refresh }: UploadToBucketProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const customRequest: UploadProps["customRequest"] = async options => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("key", prefix?.toString() || "");

    api
      .post("/bucket", formData)
      .then(res => {
        onSuccess?.(res.data);
        refresh();
        messageApi.success("File uploaded successfully!");
      })
      .catch(error => {
        onError?.(error as Error);
        messageApi.error("Upload failed!");
      });
  };
  return (
    <>
      {contextHolder}
      <Upload customRequest={customRequest} showUploadList={false}>
        <Button>
          <Icon type="upload" /> Upload
        </Button>
      </Upload>
    </>
  );
};
