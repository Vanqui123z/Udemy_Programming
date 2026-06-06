* Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process  
# sử dụng cấu trúc Monorepo với pnpm 
# tạo workspace: pnpm-workspace.yaml
# setup NextJS:
    cài đặt dependencies: 

        pnpm add  @reduxjs/toolkit  react-redux  @tanstack/react-query  axios  react-hook-form  zod  @hookform/resolvers socket.io-client  lucide-react
    cài đặt Shadcn UI
        pnpm dlx shadcn@latest init
    thêm các component cơ bản button, input, form ,.. 
    Setup redux toolkit, react query 
# setup NestJS:
    cài đặt dependencies:
        pnpm add  @nestjs/config  @nestjs/jwt  @nestjs/passport  passport  passport-jwt  bcrypt  class-validator  class-transformer
        pnpm add -D @types/bcrypt 
    cài đặt prisma để connect daclient:
        pnpm add prisma @prisma/client
        npx prisma init 
        npx prisma db pull (kéo cấu trúc db về)
        npx prisma generate (tạo các models)
    Setup JWT:
        pnpm add @nestjs/jwt passport-jwt
    Setup Socket.IO:
        *server*:
            pnpm add @nestjs/websockets @nestjs/platform-socket.io
            nest g gateway socket ( tạo gateway )
        *client*:
        Frontend
            pnpm add socket.io-client
    Setup Validation:
        *server*:
            pnpm add class-validator class-transformer
        *cliet*:
            pnpm add react-hook-form zod @hookform/resolvers
    Setup Testing:
         *server*:
            pnpm add -D supertest
        *cliet*:
            pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom



    