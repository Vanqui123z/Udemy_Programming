# Generate Prisma Client
npx prisma generate

# Tạo migration
npx prisma migrate dev --name create_user

# Đồng bộ schema
npx prisma db push

# Xem dữ liệu
npx prisma studio

# Kiểm tra kết nối DB
npx prisma db pull

# Reset database
npx prisma migrate reset

