// server.js
// Xentra Platform
// تشغيل مباشر على Replit

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "xentra_secret",
    resave: false,
    saveUninitialized: true
}));

// بيانات مؤقتة
let users = [];
let courses = [
    {
        title: "تعلم HTML",
        description: "ابدأ البرمجة من الصفر",
        video: "https://www.youtube.com/embed/qz0aGYrrlhU"
    }
];

// CSS
const style = `
<style>

body{
    margin:0;
    font-family:Arial;
    background:#050816;
    color:white;
}

nav{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:20px;
    background:#0d1326;
    box-shadow:0 0 20px #00ffff44;
}

nav h1{
    color:#00ffff;
}

nav a{
    color:white;
    text-decoration:none;
    margin-left:15px;
    transition:.3s;
}

nav a:hover{
    color:#00ffff;
}

.hero{
    text-align:center;
    padding:80px 20px;
}

.hero h2{
    font-size:50px;
    color:#00ffff;
    text-shadow:0 0 20px #00ffff;
}

.hero p{
    opacity:.8;
}

.courses{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:20px;
    padding:20px;
}

.card{
    background:#0d1326;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 0 15px #00ffff22;
    transition:.3s;
}

.card:hover{
    transform:translateY(-5px);
}

.card iframe{
    width:100%;
    height:220px;
    border:none;
}

.card h3{
    padding:10px;
    color:#00ffff;
}

.card p{
    padding:0 10px 15px;
}

form{
    width:350px;
    margin:50px auto;
    background:#0d1326;
    padding:25px;
    border-radius:20px;
    display:flex;
    flex-direction:column;
    gap:15px;
    box-shadow:0 0 20px #00ffff22;
}

form h2{
    text-align:center;
    color:#00ffff;
}

input{
    padding:14px;
    border:none;
    border-radius:10px;
    outline:none;
    background:#111b33;
    color:white;
}

button{
    padding:14px;
    border:none;
    border-radius:10px;
    background:#00ffff;
    color:black;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
}

button:hover{
    transform:scale(1.03);
}

.dashboard{
    padding:20px;
}

.user{
    background:#0d1326;
    padding:10px;
    margin:10px 0;
    border-radius:10px;
}

footer{
    text-align:center;
    padding:30px;
    opacity:.7;
}

</style>
`;

// الصفحة الرئيسية
app.get("/", (req, res) => {

    let courseHTML = "";

    courses.forEach(c => {
        courseHTML += `
        <div class="card">
            <iframe src="${c.video}" allowfullscreen></iframe>
            <h3>${c.title}</h3>
            <p>${c.description}</p>
        </div>
        `;
    });

    res.send(`
    <!DOCTYPE html>
    <html lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>Xentra</title>
        ${style}
    </head>
    <body>

    <nav>
        <h1>Xentra</h1>

        <div>
            <a href="/">الرئيسية</a>
            <a href="/register">إنشاء حساب</a>
            <a href="/login">تسجيل دخول</a>
            <a href="/admin">لوحة التحكم</a>
        </div>
    </nav>

    <section class="hero">
        <h2>منصة Xentra</h2>
        <p>تعلم البرمجة من الصفر حتى الاحتراف</p>
    </section>

    <div class="courses">
        ${courseHTML}
    </div>

    <footer>
        تطوير Adham Ahmed
    </footer>

    </body>
    </html>
    `);

});

// إنشاء حساب
app.get("/register", (req, res) => {

    res.send(`
    ${style}

    <form method="POST">

        <h2>إنشاء حساب</h2>

        <input name="username" placeholder="اسم المستخدم" required>

        <input name="email" placeholder="البريد الإلكتروني" required>

        <input type="password" name="password" placeholder="كلمة المرور" required>

        <button>تسجيل</button>

    </form>
    `);

});

app.post("/register", (req, res) => {

    users.push({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    res.redirect("/login");
});

// تسجيل دخول
app.get("/login", (req, res) => {

    res.send(`
    ${style}

    <form method="POST">

        <h2>تسجيل دخول</h2>

        <input name="email" placeholder="البريد الإلكتروني">

        <input type="password" name="password" placeholder="كلمة المرور">

        <button>دخول</button>

    </form>
    `);

});

app.post("/login", (req, res) => {

    const user = users.find(
        u =>
        u.email === req.body.email &&
        u.password === req.body.password
    );

    if(!user){
        return res.send(`
        ${style}
        <h1 style="text-align:center;color:red;">
        بيانات خاطئة
        </h1>
        `);
    }

    req.session.user = user;

    res.redirect("/");
});

// لوحة التحكم
app.get("/admin", (req, res) => {

    res.send(`
    ${style}

    <form method="POST">

        <h2>لوحة التحكم</h2>

        <input name="user" placeholder="اليوزر">

        <input type="password" name="pass" placeholder="الباسورد">

        <button>دخول</button>

    </form>
    `);

});

app.post("/admin", (req, res) => {

    if(
        req.body.user === "adham" &&
        req.body.pass === "123456"
    ){
        req.session.admin = true;
        return res.redirect("/dashboard");
    }

    res.send(`
    ${style}
    <h1 style="text-align:center;color:red;">
    بيانات الأدمن خاطئة
    </h1>
    `);

});

// الداشبورد
app.get("/dashboard", (req, res) => {

    if(!req.session.admin){
        return res.redirect("/admin");
    }

    let usersHTML = "";

    users.forEach(u => {
        usersHTML += `
        <div class="user">
            👤 ${u.username} - ${u.email}
        </div>
        `;
    });

    res.send(`
    ${style}

    <div class="dashboard">

    <h1 style="color:#00ffff;">
    لوحة تحكم Xentra
    </h1>

    <form method="POST" action="/add-course">

        <h2>إضافة كورس</h2>

        <input name="title" placeholder="اسم الكورس">

        <input name="description" placeholder="الوصف">

        <input name="video" placeholder="رابط فيديو Embed">

        <button>إضافة الكورس</button>

    </form>

    <h2>المستخدمين</h2>

    ${usersHTML}

    </div>
    `);

});

// إضافة كورس
app.post("/add-course", (req, res) => {

    if(!req.session.admin){
        return res.redirect("/admin");
    }

    courses.push({
        title: req.body.title,
        description: req.body.description,
        video: req.body.video
    });

    res.redirect("/");
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Xentra Running On Port " + PORT);
});
