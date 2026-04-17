---
title: 内存调优
order: 2
excerpt: 避免 OOMKilled 的内存管理最佳实践。
---

# 内存调优

内存不足是导致 Pod 被终止（OOMKilled）的最常见原因。本章介绍如何为应用设置安全的内存阈值。

## 监控内存使用

使用 `kubectl top pod` 查看实时内存占用：

```bash
kubectl top pod -n default
```

## 设置内存限制

建议将 limits 设置为 requests 的 1.5~2 倍，以应对突发流量。
