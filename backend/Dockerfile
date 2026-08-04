FROM node:18-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Cài đặt các dependencies (chỉ production hoặc đầy đủ tuỳ bạn)
RUN npm ci --only=production

# Copy toàn bộ mã nguồn JS
COPY . .

# Generate Prisma Client (nếu dự án dùng Prisma)
RUN npx prisma generate

# Setup entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]

# Chạy trực tiếp file JS trong thư mục src
CMD ["node", "src/entrypoints/api.js"]