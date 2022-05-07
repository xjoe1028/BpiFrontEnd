import _axios from "axios";


const axios = (baseURL) => {
  // 建立一個自定義的axios實例
  const axiosInstance = _axios.create({
    // 添加在 url 前面，除非 url 為絕對路徑
    baseURL: baseURL || "http://localhost:8080/api/bpi", // Bpi BackEnd url port
    
    // 請求時間超過 10000毫秒(10秒)，請求會被中止
    timeout: 10000, 
    
    headers: { 'Content-Type': 'application/json' },
    // 選項: 'arraybuffer', 'document', 'json', 'text', 'stream'
    // 瀏覽器才有 'blob' ， 預設為 'json'
    
    maxContentLength: 2000, // 限制傳送大小

    responseType: 'json', // 伺服器回應的數據類型
    
    // 伺服器回應的編碼模式 預設 'utf8'
    responseEncoding: 'utf8',
  });

  return axiosInstance;
};

export { axios };
export default axios();
