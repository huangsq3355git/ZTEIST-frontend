# ZTEIST 前端

中友会·同事录/校友录社区前端。技术栈：Astro（静态）+ React + Tailwind，双语（简中 / 英文）。

## 目录

- `src/i18n.ts` — 双语字典（zh/en）
- `src/layouts/Layout.astro` — 布局
- `src/components/Invite.tsx` — 邀请落地页（读 pathname 取语言+码，调 `/api/invite/{code}`）
- `src/components/Register.tsx` — 注册（邮箱验证码 → 结构化标签，国家必填下拉）
- `src/components/Search.tsx` — 搜索（国家+年代+产品线+岗位）
- `src/pages/` — 路由（`/invite`、`/zh|en/register`、`/zh|en/search`）

## 后端 API

- 同源托管：前端调相对路径 `/api/*`（nginx 反代到后端 `127.0.0.1:3003`）
- 登录态 token 存 `localStorage.zteist_token`

## 部署（nginx 同源托管）

- 服务器：`/opt/zteist-frontend`（git 仓库，ubuntu 拥有，deploy key `~/.ssh/solar_deploy`）
- 流程：本地 `commit + push` → 服务器 `bash deploy.sh`（`git pull` → `npm install` → `build` → 冒烟）
- 铁律：build 有 error 会 `set -e` 立刻停，不会动线上 dist（幂等，可重复执行）
- nginx：`zteist.com` 静态服务；`/api/*` 反代后端；`/zh|en/i/{code}` 重写到 `/invite`

## 注意

- 改完必须 commit + push（GitHub `huangsq3355git/ZTEIST-frontend`）
- 部署走 `bash deploy.sh`（服务器 git pull），**不要再用 `rm -rf dist` + scp**（会制造文件缺失窗口，被 Cloudflare 缓存坏响应）
- 静态文件更新无需 reload nginx（nginx 直接读文件）
