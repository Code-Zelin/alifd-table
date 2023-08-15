import './App.css';
import '@alifd/next/dist/next.css';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

import CustomTable from "./components/CustomTable";


function App() {
  const [data, setData] = useState([]);
  const columns = useMemo(() => {
    const _columns = [
      {
        key: "no",
        title: "编号",
        dataIndex: "no",
        cell(value) {
          return <div>
            <span>自定义列.</span>
            <b>{value}</b>
          </div>
        }
      },
      {
        key: "name",
        title: "姓名",
        dataIndex: "name",
        cell(value) {
          return `自name.${value}`
        }
      },
      {
        key: "age",
        title: "年龄",
        dataIndex: "age",
      },
      {
        key: "time",
        title: "时间",
        dataIndex: "time",
      },
      {
        key: "switch",
        title: "开关",
        dataIndex: "switch",
        cell(value) {
          return value ? "开" : "关"
        }
      }
    ]

    return _columns;
  }, [])


  useEffect(() => {
    const newData = [];
    for (let i = 0; i < 50; i++) {
      const item = {
        no: i + 1,
        name: "xxxxx",
        age: Math.ceil(Math.random() * 100),
        time: moment().subtract(i, 'days').format('YYYY/MM/DD'),
        // 将rowindex和colindex与元素绑定，在渲染时可以根据该值进行特殊渲染
        rowIndex: i,
        switch: Boolean(i % 2)
      }
      newData.push(item);
    }
    setData(newData);
  }, [])

  return (
    <div className="App">
      <CustomTable
        isZebra
        hasBorder
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}

export default App;
