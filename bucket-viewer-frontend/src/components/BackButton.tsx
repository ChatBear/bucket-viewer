import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from "antd";
type BackButtonProps = {
    prefix: string;
    setPrefix: (prefix: string) => void;
    loading: boolean
}
const BackButton = ({ prefix, setPrefix, loading }: BackButtonProps) => {
    const onClick = () => {
        const prefixList = prefix.split("/")
        prefixList.pop()
        prefixList.pop()

        if (prefixList.join("/") + "/" === "/") {
            setPrefix("")
        } else {
            setPrefix(prefixList.join("/") + "/")
        }

    }
    return <Button onClick={onClick} loading={loading}> <ArrowLeftOutlined /></Button >
}

export default BackButton