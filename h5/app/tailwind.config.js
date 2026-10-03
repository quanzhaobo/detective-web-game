/** @type {import('tailwindcss').Config} */
export default {
  // 游戏逻辑在 ../../shared/src，外壳在本工程；两处都要扫描，否则共享页面的类名会被裁掉。
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
