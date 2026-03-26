# ---------- 1. Build Stage ----------
    FROM node:24-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy project files
    COPY . .
    
    # Build Next.js app
    RUN npm run build
    
    # ---------- 2. Production Stage ----------
    FROM node:24-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Copy only required files from builder
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/next.config.js ./
    
    # Expose port
    EXPOSE 3000
    
    # Start Next.js
    CMD ["npm", "start"]