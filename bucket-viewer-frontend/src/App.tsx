import { ConfigProvider, Layout } from 'antd';
import React, { useState, type Key } from 'react';
import BackButton from './components/BackButton';
import BucketTree from './components/BucketTree';

const { Content } = Layout
const App: React.FC = () => {

  const [prefix, setPrefix] = useState<Key>("")


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
          <BackButton prefix={prefix as string} setPrefix={setPrefix} />
          <BucketTree
            prefix={prefix}
            setPrefix={setPrefix}
          />

        </Content>
      </Layout>
    </ConfigProvider >
  )
}

export default App