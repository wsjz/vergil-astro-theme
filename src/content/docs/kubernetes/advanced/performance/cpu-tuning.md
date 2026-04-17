---
title: CPU 调优
order: 1
excerpt: 如何为 Pod 设置合理的 CPU 请求与限制。
---

# CPU 调优

合理的 CPU 配置可以提高集群利用率，同时保证关键应用的稳定性。

## Requests 与 Limits

- **requests**: Kubernetes 调度时使用的基准值。
- **limits**: Pod 能使用的最大 CPU 量。

```yaml
resources:
  requests:
    cpu: "100m"
  limits:
    cpu: "500m"
```
