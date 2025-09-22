import { Spin, Tree, Typography, type TreeDataNode } from 'antd'
import { useMemo, type Key } from 'react'
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


    const onExpand = (expandedKeys: Key[]) => {
        setPrefix(expandedKeys[expandedKeys.length - 1])
        return;
    }



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
                title: content.Key,
                key: content.Key
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
            />
        ) : (
            <Text>Bucket not found</Text>
        )
    ) : (
        <Spin size="large" />
    ))

}



export default BucketTree