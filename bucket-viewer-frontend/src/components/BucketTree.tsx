import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Dropdown, Spin, Tree, Typography, type MenuProps, type TreeDataNode } from 'antd'
import { useMemo, useState, type Key } from 'react'
import type { BucketData } from '../hooks/useBucketData'


const { DirectoryTree } = Tree
const { Text } = Typography

type BucketTreeProp = {
    prefix: Key;
    setPrefix: (prefix: Key) => void;
    bucketData: BucketData | null
    loading: boolean
}

const BucketTree = ({ prefix, setPrefix, bucketData, loading }: BucketTreeProp) => {
    // TODO : Try to load all children when the parent is showed to improve UX. Use loadData component. 

    const [expandedKeys, setExpandedKeys] = useState([])

    const onExpand = (expandedKeys: Key[]) => {
        setPrefix(expandedKeys[expandedKeys.length - 1])
        setExpandedKeys([])
        return;
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button color="default" variant='text'> Download </Button>
            ),
            icon: <DownloadOutlined />,
            disabled: true
        },
        {
            key: '2',
            label: (
                <Button color="default" variant='text'> Delete </Button>
            ),
            icon: < DeleteOutlined />,
            disabled: true,
        },
    ];



    const treeData: TreeDataNode[] = useMemo(() => {
        const prefixes = bucketData?.commonPrefixes?.map((prefix) => {
            return {
                title: prefix.Prefix,
                key: prefix.Prefix,
                expandAction: true,

            }
        }) ?? []

        const contents = bucketData?.contents?.map((content) => {
            return {
                title: <Dropdown menu={{ items }} placement='bottomRight' trigger={["click"]}><span>{content.Key} </span></Dropdown>,
                key: content.Key,
                isLeaf: true,
            }
        }) ?? []
        return [...prefixes, ...contents]
    }, [prefix, bucketData])
    return (!loading ? (
        bucketData ? (
            <DirectoryTree
                selectable={false}
                style={{
                    minWidth: "50vh"
                }}
                treeData={treeData}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onRightClick={(value) => console.log(value)}
            />
        ) : (
            <Text>Bucket not found</Text>
        )
    ) : (
        <Spin size="large" />
    ))

}



export default BucketTree