# 物联网监控面板

这是一个使用 [Next.js](https://nextjs.org/) 构建的项目，提供了一个基于 Web 的物联网设备监控面板。它可以显示实时传感器数据、历史图表，并根据预设阈值发送警报。

## 功能

- **实时数据显示**：显示最新的温度和湿度读数。
- **历史数据图表**：可视化过去 30 分钟的传感器数据。
- **警报**：当传感器读数超过特定阈值时通知用户。
- **深色模式**：支持浅色和深色主题。
- **响应式设计**：适应不同的屏幕尺寸。

##快速开始

首先，安装依赖项：

```bash
npm install
```

然后，运行开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## API 端点

该项目包含一个模拟 API 端点，用于模拟物联网数据。

- **URL**: `/api/iot-data`
- **方法**: `GET`
- **描述**: 返回模拟的物联网传感器数据，包括当前读数、历史数据和警报。

### 响应有效载荷

```json
{
  "current": {
    "temperature": 23.5,
    "humidity": 45.2,
    "lastUpdated": "2025-07-01T12:00:00.000Z"
  },
  "history": [
    {
      "name": "上午11:30",
      "temperature": 22.1,
      "humidity": 46.8
    },
    {
      "name": "上午11:35",
      "temperature": 22.5,
      "humidity": 46.2
    }
  ],
  "alert": {
    "type": "warning",
    "message": "检测到高温！"
  }
}
```

## 了解更多

要了解有关 Next.js 的更多信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程。

您可以查看 [Next.js GitHub 存储库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

## 在 Vercel 上部署

部署 Next.js 应用程序最简单的方法是使用 Next.js 创建者提供的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

有关更多详细信息，请查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。
