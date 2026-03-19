declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

// Electron + Vite が注入するグローバル変数の宣言
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;