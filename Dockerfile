# 使用 Node.js 18 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 安装 Python3 和必要的软件包
RUN apt-get update && apt-get install -y python3 python3-pip

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000
EXPOSE 9229

# 启动 worker 并开启调试模式
CMD ["node", "--inspect=0.0.0.0:9229", "dist/main"]

# 启动 worker
# CMD ["npm", "run", "start:prod"]
