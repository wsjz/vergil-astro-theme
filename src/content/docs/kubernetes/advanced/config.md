---
title: 高级配置
order: 1
excerpt: 深入理解 Kubernetes 的 ConfigMap 与 Secret。
---

# 高级配置

在生产环境中，应用程序的配置通常需要与代码分离。Kubernetes 提供了 ConfigMap 和 Secret 两种资源来实现这一目标。

## ConfigMap

ConfigMap 用于存储非敏感的配置数据，如环境变量、命令行参数或配置文件。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: "postgres://localhost/mydb"
```

## Secret

Secret 用于存储敏感信息，如密码、OAuth 令牌或 SSH 密钥。
