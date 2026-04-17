---
title: useEffect
order: 2
excerpt: 处理副作用的生命周期 Hook。
---

# useEffect

`useEffect` 用于在函数组件中执行副作用操作，比如数据获取、订阅或手动修改 DOM。

## 基本用法

```jsx
import { useEffect } from 'react';

function Example() {
  useEffect(() => {
    document.title = 'Updated Title';
  }, []);

  return <div>Check the document title!</div>;
}
```
