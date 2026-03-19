FROM node:18-bullseye

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y openssl libssl3 ca-certificates libc6 && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm install

# Copy project files
COPY . .

# Environment variables for build
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:postgres@localhost:5432/postgres"}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"dummy-secret"}
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port and start
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["npm", "start"]
