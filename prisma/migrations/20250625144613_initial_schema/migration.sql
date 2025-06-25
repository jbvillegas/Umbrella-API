-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'INCOMPLETE', 'TRIALING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tier" "Tier" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limits" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "usage_records_userId_createdAt_idx" ON "usage_records"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "usage_records_apiKeyId_createdAt_idx" ON "usage_records"("apiKeyId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limits_identifier_endpoint_windowStart_key" ON "rate_limits"("identifier", "endpoint", "windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_stripeEventId_key" ON "webhook_events"("stripeEventId");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
