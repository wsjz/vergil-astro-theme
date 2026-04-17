---
title: 快速开始
order: 0
excerpt: 五分钟内启动你的第一个 Kubernetes 集群。
---

# 快速开始

欢迎阅读 Kubernetes 指南！本文将帮助你在本地环境中快速搭建一个单节点的 Kubernetes 集群。

## 前提条件

- 至少 2 核 CPU 与 4GB 内存
- 已安装 Docker
- 稳定的网络连接

## 安装 minikube

```bash
brew install minikube
```

## 启动集群

```bash
minikube start --driver=docker
```

稍等片刻，你就可以使用 `kubectl` 与集群交互了。
