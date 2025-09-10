import { ConfigProvider, Layout, Tree, type TreeDataNode } from 'antd';
import React, { useMemo, useState, type Key } from 'react';
import { useBucketData } from './hooks/useBucketData';

const { Content } = Layout
const { DirectoryTree } = Tree
const App: React.FC = () => {

  const [prefix, setPrefix] = useState<Key>("")
  const { bucketData } = useBucketData(prefix)

  // const onClick = () => {
  //   if (prefix) {
  //     // JE VEUX ICI FAIRE UN BOUTON RETOUR 
  //     setPrefix(prefix[prefix.length - 2])
  //   }


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

  const onExpand = (expandedKeys: Key[]) => {
    setPrefix(expandedKeys[expandedKeys.length - 1])
    return;
  }
  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '90vh' }}>
        <Content style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {
            bucketData ?
              <>
                <DirectoryTree
                  selectable={false}
                  style={{
                    minWidth: "50vh"
                  }}
                  treeData={treeData}
                  onExpand={onExpand}
                />
                {/* <Button onClick={onClick}> Ok </Button> */}
              </> : <></>
          }

        </Content>
      </Layout>
    </ConfigProvider >
  )
}

export default App