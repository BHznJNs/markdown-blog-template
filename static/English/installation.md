# Installation

## Requirements

- [Node.js](https://nodejs.org) (the latest LTS version is recommended)
- [Git](https://git-scm.com/download)

## Download this Template

Run the command bellow:
```bash
git clone https://github.com/BHznJNs/markdown-blog-template
```

Or directly [click this](https://github.com/BHznJNs/markdown-blog-template/archive/refs/heads/main.zip) to download.

## Dependencies installation

```bash
npm install
```

>>>Install dependencies as required
Since RSS feed subscription requires the pre-rendered static HTML files, and some of the chart rendering libraries used in this project do not support server-side rendering, it is necessary to import Electron for implementing server-side rendering.

If you don't have a requirement for RSS publishing and subscription, or if you do but don't utilize the functionalities of equations, charts, or QR codes in your writing, to reduce the disk space usage of dependency libraries, please use the command below to install:
```bash
npm install express crypto-js
```

If you have a requirement for RSS publishing and subscription, and need to utilize the functionalities of equations, charts, and QR codes in your writing, please use the command below to install:
```bash
npm install --production
```

If you wish to modify this project's frontend source code and apply the changes, please use the following command to install development dependencies individually:
```bash
npm install --only=dev
```
>>>
