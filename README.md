# 待办清单应用 (Todo List)

这是一个基于 Vue 3 + Vite 构建的现代化待办事项管理应用。通过这个应用，用户可以方便地管理和追踪他们的日常任务。

## 功能特点

- ✨ 任务创建与编辑
- 📝 富文本编辑器支持
- 🔍 任务筛选功能
- 📊 任务统计展示
- 📱 响应式设计
- 🎯 任务详情查看
- ⚡ 高性能和用户友好的界面

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Vue Router - 官方路由管理器
- Pinia - Vue 状态管理库
- Axios - HTTP 客户端

## 项目结构

```
src/
  ├── api/        # API 接口
  ├── assets/     # 静态资源
  ├── components/ # 组件
  ├── router/     # 路由配置
  ├── stores/     # 状态管理
  ├── utils/      # 工具函数
  └── views/      # 页面视图
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 主要功能模块

- **TaskForm**: 任务创建和编辑表单
- **TaskList**: 任务列表展示
- **TaskFilter**: 任务筛选组件
- **TaskStats**: 任务统计信息
- **RichTextEditor**: 富文本编辑器
- **TaskDetailView**: 任务详情页面

## 开发指南

本项目使用 Vue 3 的 `<script setup>` 语法，详情请参考 [script setup 文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)。

IDE 支持相关信息请查看 [Vue 文档工具支持指南](https://vuejs.org/guide/scaling-up/tooling.html#ide-support)。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

[MIT](LICENSE)