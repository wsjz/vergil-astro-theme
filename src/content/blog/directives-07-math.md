---
title: 数学公式
excerpt: 行内公式和独立公式块。用标准 LaTeX 语法，不需要指令包裹。
publishDate: 'Aug 25 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
mathjax: true
---

数学公式不需要指令包裹，直接写 LaTeX。文章 frontmatter 里把 `mathjax` 设为 `true` 才会加载渲染器。

---
### 数学公式

支持 LaTeX 语法的数学公式渲染。通过 frontmatter 选择引擎，构建时生成，无需客户端脚本。

::::tabs
tab: 演示效果

**行内公式**

质能方程 $E = mc^2$ 揭示了质量与能量的等价关系。

欧拉公式 $e^{i\pi} + 1 = 0$ 被誉为数学中最美的公式。

薛定谔方程 $i\hbar \frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)$ 描述了量子系统的演化。

**块级公式**

麦克斯韦方程组（微分形式）：

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

高斯积分：

$$
\int_{-\infty}^{+\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

傅里叶变换：

$$
\hat{f}(\xi) = \int_{-\infty}^{+\infty} f(x) \, e^{-2\pi i x \xi} \, dx
$$

---

tab: 引擎选择

在文章 frontmatter 中声明要使用的引擎：

```yaml
---
mathjax: true
---
```

```yaml
---
katex: true
---
```

| 配置 | 引擎 | 输出 | 特点 |
|------|------|------|------|
| `mathjax: true` | MathJax | SVG | 兼容性好，支持几乎所有 LaTeX 宏包 |
| `katex: true` | KaTeX | HTML+CSS | 体积小、构建快、输出更紧凑 |
| 两个都不写 | — | 原始文本 | `$...$` 保持原样不渲染 |
| 两个都写 | MathJax | SVG | **优先 MathJax** |

**何时用哪个：**
- 一般公式 → KaTeX（轻量、快速）
- 复杂公式、AMS 宏包、化学式 → MathJax（兼容性更强）

---

tab: 示例代码

````markdown
质能方程 $E = mc^2$ 揭示了质量与能量的等价关系。

欧拉公式 $e^{i\pi} + 1 = 0$ 被誉为数学中最美的公式。

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

$$
\int_{-\infty}^{+\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$
````

- 行内公式：单个 `$` 包裹，前后留空格
- 块级公式：`$$` 包裹，单独成行
- 支持 `aligned`、`pmatrix`、`bmatrix` 等标准 LaTeX 环境

::::
