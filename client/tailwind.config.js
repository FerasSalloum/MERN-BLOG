
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // يشمل كل ملفات React/JSX
  ],
  theme: {
    extend: {}, // هنا يمكن إضافة أي تعديلات على الثيم
  },
  plugins: [], // أضف أي Plugins مثل forms أو typography هنا إذا احتجت
};
