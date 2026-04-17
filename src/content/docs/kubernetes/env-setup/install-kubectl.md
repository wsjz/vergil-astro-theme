---
title: 安装 kubectl
order: 2
excerpt: 安装并配置 Kubernetes 命令行工具 kubectl。
---

# 安装 kubectl

`kubectl` 是与 Kubernetes 集群交互的核心命令行工具。

## macOS

```bash
brew install kubectl
```

## 验证安装

```bash
kubectl version --client
```

如果输出了版本信息，说明安装成功。
