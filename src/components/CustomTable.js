import { Table } from "@alifd/next";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 清除文本选中区域
function clearSelection() {
  window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}

function getContentFromItem(item) {
  let result = "";
  if (item.props.children) {
    if (typeof item.props.children === "object") {
      item.props.children.forEach((item) => {
        if (typeof item === "object") {
          result += getContentFromItem(item);
        } else {
          result += item;
        }
      })
    } else {
      result += item.props.children;
    }
  }
  return result;
}

function getElementContent(reactElement) {
  if (typeof reactElement.type === "object") {
    return getContentFromItem(reactElement.type);
  } else {
    return reactElement.type;
  }
}

function CustomTable(props) {
  
  const isDraging = useRef(false);

  const [dragStartPos, setDragStartPos] = useState([]);
  const [dragEndPos, setDragEndPos] = useState([]);

  // 计算得出拖拽选中的区域，包括了 左顶点的row和col，右底角的row和col
  const dragWrapperPos = useMemo(() => {
    const [startRow, startCol] = dragStartPos;
    const [endRow, endCol] = dragEndPos;

    return [
      // 左上角
      Math.min(startRow, endRow),
      Math.min(startCol, endCol),
      // 右下角
      Math.max(startRow, endRow),
      Math.max(startCol, endCol),
    ]
  }, [dragStartPos, dragEndPos])

  const handleCellProps = useCallback((rowIndex, colIndex, dataIndex, record) => {
    let style = undefined;
    const [startRow, startCol, endRow, endCol] = dragWrapperPos;
    if (rowIndex >= startRow && rowIndex <= endRow && colIndex >= startCol && colIndex <= endCol) {
      style = {
        background: "red",
        color: "#fff",
      }
    }

    return {
      style,
      // 在当前单元格按下鼠标
      onMouseDown(e) {
        console.log("在当前单元格按下鼠标", rowIndex, colIndex);
        isDraging.current = true;
        setDragStartPos([rowIndex, colIndex]);
        clearSelection();
        return false;
      },
      // 滑入当前单元格
      onMouseOver(e) {
        e.preventDefault()
        if (!isDraging.current) return false;
        console.log("滑入当前单元格", rowIndex, colIndex);
        setDragEndPos([rowIndex, colIndex]);
        clearSelection();
        return false;
      },
      // 在当前单元格抬起鼠标
      onMouseUp() {
        isDraging.current = false;
        console.log("抬起鼠标", rowIndex, colIndex);
        setDragEndPos([rowIndex, colIndex]);
        clearSelection();
        return false;
      }
    }
  }, [dragWrapperPos])


  // 复制表格的方法
  const copyExcel = useCallback((event) => {
    var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);

    let [startRow, startCol, endRow, endCol] = dragWrapperPos;

    const result = [];
    if (startRow === 0) {
      let item = '';
      for (let i = startCol; i <= endCol; i++) {
        item += props.columns[i].title + '\t';
      }
      result.push(item);
      startRow ++;
    }

    for(let row = startRow; row <= endRow; row++) {
      let item = "";
      const currentData = props.dataSource[row];
      for(let col = startCol; col <= endCol; col++) {
        const { dataIndex: key, cell } = props.columns[col];
        if (cell) {
          // 保持和原来的参数一致
          const cellElement = cell(currentData[key], row, currentData);
          // 用react.createElement方法，将jsx节点转化成reactelement对象
          const element = React.createElement(cellElement);
          // 再解析该对象，拿到里面的字符串和数字
          item += getElementContent(element) + "\t";
        } else {
          item += currentData[key] + '\t';
        }
      }
      result.push(item);
    }

    // 拼接数据 
    const selection = result.join('\n');
    console.log(selection);
    clipboardData.setData('text/plain', selection.toString());
    event.preventDefault();
  }, [dragWrapperPos, props.dataSource, props.columns])

  useEffect(() => {
    document.addEventListener('copy', copyExcel);
    return () => {
      document.removeEventListener('copy', copyExcel);
    }
  }, [copyExcel])


  return (
    <Table
      {...props}
      cellProps={handleCellProps}
    />
  );
}

export default memo(CustomTable);
