-- CreateEnum
CREATE TYPE "Wisetbands" AS ENUM ('BLACK', 'RED', 'GREEN', 'YELLOW');

-- CreateEnum
CREATE TYPE "SelectDomain" AS ENUM ('MY_BRAND_LIFE');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('IMAGE', 'COLOR');

-- CreateEnum
CREATE TYPE "Layout" AS ENUM ('LEFT', 'RIGHT', 'CENTER');

-- CreateEnum
CREATE TYPE "ButtonName" AS ENUM ('FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'CUSTOM', 'SNAPCHAT', 'TIKTOK', 'EMAIL', 'PHONE', 'INSTAGRAM', 'REDDIT', 'TUMBLR', 'PINTEREST', 'WHATSAPP', 'WECHAT', 'TELIGRAM', 'DISCORD', 'TWITCH', 'GITHUB', 'SOUNDCLOUD', 'VIMEO', 'SPOTIFY', 'CLUBHOUSE', 'PERISCOPE', 'DRIBBLE', 'BEHANCE', 'DAILYMOTION', 'MIXCLOUD', 'FLICKR', 'ANCHOR', 'PATREON', 'NEXTDOOR');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "midName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "secondEmail" TEXT,
    "password" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "landerName" TEXT NOT NULL,
    "nickName" TEXT,
    "affiliate" TEXT,
    "aggreement" BOOLEAN NOT NULL,
    "package" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "domain" "SelectDomain" NOT NULL DEFAULT 'MY_BRAND_LIFE',
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referralCustomer" (
    "id" TEXT NOT NULL,
    "referalCode" TEXT NOT NULL,
    "joined" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referralCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extraWisetbands" (
    "id" TEXT NOT NULL,
    "name" "Wisetbands" NOT NULL,
    "count" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extraWisetbands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userMembership" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "activate_at" TEXT NOT NULL,
    "oldPrice" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userTemplete" (
    "id" TEXT NOT NULL,
    "layout" "Layout" NOT NULL,
    "bio" TEXT,
    "tagLine" TEXT,
    "offerings" TEXT,
    "businessServiced" TEXT,
    "funnySaying" TEXT,
    "logo" TEXT,
    "portrait" TEXT,
    "banner" TEXT,
    "background" TEXT,
    "epkFile" TEXT,
    "favicon" TEXT,
    "serviceOne" TEXT,
    "serviceTow" TEXT,
    "serviceThree" TEXT,
    "serviceFour" TEXT,
    "serviceFive" TEXT,
    "heading" TEXT,
    "title" TEXT,
    "footerText" TEXT,
    "footerWidget" TEXT,
    "headBtnLeft" TEXT,
    "headBtnRight" TEXT,
    "centerHeading" TEXT,
    "centerDescripion" TEXT,
    "headerBgType" "Type" NOT NULL,
    "headerBg" TEXT,
    "ContentBGType" "Type" NOT NULL,
    "ContentBg" TEXT,
    "footerBgType" "Type" NOT NULL,
    "FooterBg" TEXT,
    "verify" BOOLEAN DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userTemplete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buttonSet" (
    "id" TEXT NOT NULL,
    "name" "ButtonName" NOT NULL,
    "url" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buttonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otpModel" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expireIn" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otpModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "notice" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "referralCustomer_referalCode_key" ON "referralCustomer"("referalCode");

-- CreateIndex
CREATE UNIQUE INDEX "otpModel_code_key" ON "otpModel"("code");

-- AddForeignKey
ALTER TABLE "referralCustomer" ADD CONSTRAINT "referralCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraWisetbands" ADD CONSTRAINT "extraWisetbands_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMembership" ADD CONSTRAINT "userMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buttonSet" ADD CONSTRAINT "buttonSet_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otpModel" ADD CONSTRAINT "otpModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
