import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from "antd";
import type { Key } from "react";
type BackButtonProps = {
    prefix: Key;
    setPrefix: (prefix: Key) => void;
}
const BackButton = ({ prefix, setPrefix }: BackButtonProps) => {
    const onClick = () => { }
    return <Button onClick={onClick}> <ArrowLeftOutlined /></Button >
}

export default BackButton