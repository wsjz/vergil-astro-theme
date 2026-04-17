---
title: useState
order: 1
excerpt: 在函数组件中管理状态的基础 Hook。
---

# useState

`useState` 是最常用的 React Hook，用于在函数组件中添加状态。

## 基本用法

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```
