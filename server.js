const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const User = require("./model/user");
const bcrypt = require("bcryptjs");



// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Hàm khởi tạo tài khoản admin
const initializeAdminAccount = async () => {
  try {

    // Kiểm tra xem tài khoản admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: "admin123@gmail.com" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Tạo tài khoản admin
    const adminUser = new User({
      name: "Admin User",
      email: "admin123@gmail.com",
      password: "admin123",
      phoneNumber: 123456789,
      addresses: [
        {
          country: "Vietnam",
          city: "TPHCM",
          address1: "01 Võ Văn Ngân",
          address2: "Building A, Floor 3",
          zipCode: 100000,
          addressType: "Home"
        }
      ],
      role: "Admin",
      avatar: {
        public_id: "sample_public_id",
        url: "https://th.bing.com/th/id/OIP.xyVi_Y3F3YwEIKzQm_j_jQHaHa?rs=1&pid=ImgDetMain"
      },
      createdAt: new Date()
    });




    // Lưu vào cơ sở dữ liệu
    await adminUser.save();
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Error creating admin account:", error.message);
  }


};

// Gọi hàm khởi tạo tài khoản admin sau khi kết nối đến cơ sở dữ liệu và cấu hình Cloudinary
initializeAdminAccount();


// khởi tạo
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// ngắt kết nối đóng server 
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
