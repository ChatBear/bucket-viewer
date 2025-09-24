import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { Dropdown, message, Spin, Tree, Typography, type MenuProps, type TreeDataNode } from 'antd'
import { useMemo, useState, type Key } from 'react'
import type { BucketData } from '../hooks/useBucketData'
import { api } from '../services/object-service'


const { DirectoryTree } = Tree
const { Text } = Typography

type BucketTreeProp = {
    prefix: Key;
    setPrefix: (prefix: Key) => void;
    bucketData: BucketData | null;
    loading: boolean;
    refresh: () => void;
}

const BucketTree = ({ prefix, setPrefix, bucketData, loading, refresh }: BucketTreeProp) => {
    // TODO : Try to load all children when the parent is showed to improve UX. Use loadData component. 
    const [messageApi, contextHolder] = message.useMessage();
    const [expandedKeys, setExpandedKeys] = useState([])

    const onExpand = (expandedKeys: Key[]) => {
        setPrefix(expandedKeys[expandedKeys.length - 1])
        setExpandedKeys([])
        return;
    }

    const onClickMenu = ({ keyType, keyFile }: { keyType: string, keyFile: string }) => {
        if (keyType === "delete") {
            api.delete(`/bucket`, {
                params: {
                    key_file: keyFile.replace('/', ",")
                }
            })
                .then(() => {
                    messageApi.success(`the file ${keyFile} has been deleted`)
                    refresh()
                })
                .catch((error) => {
                    console.error(error)
                    messageApi.error(`Error during the delete, the file has not been deleted`)
                })
        }
    }
    const items: MenuProps['items'] = [
        {
            key: 'download',
            label: (
                <Text color="default"> Download </Text>
            ),
            icon: <DownloadOutlined />,
            disabled: false
        },
        {
            key: 'delete',
            label: (
                <Text color="default"> Delete </Text>
            ),
            icon: < DeleteOutlined />,
            disabled: false,
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
                title: <Dropdown menu={{
                    items: items,
                    onClick: ({ key: key }: { key: string }) => {
                        onClickMenu({ keyFile: content.Key, keyType: key })
                    }
                }}
                    placement='bottomRight'
                    trigger={["click"]}>
                    <span>{content.Key} </span></Dropdown>,
                key: content.Key,
                isLeaf: true,
            }
        }) ?? []
        return [...prefixes, ...contents]
    }, [prefix, bucketData])

    return (
        !loading ? (
            treeData ? (
                <>
                    {contextHolder}
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
                </>
            ) : (
                <Text>Bucket not found</Text>
            )
        ) : (
            <Spin size="large" />
        )
    )

}



export default BucketTree