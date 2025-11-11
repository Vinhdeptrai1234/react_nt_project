# Hướng dẫn nhanh khắc phục "expo: The term 'expo' is not recognized"

1. Xác định loại dự án

- Mở package.json, tìm `"expo"` trong dependencies → nếu có thì đây là dự án Expo.
- Nếu không có expo, dự án có thể là bare React Native.

2. Nếu là Expo (khuyên dùng với expo-sqlite)

- Cài Expo CLI (mở PowerShell / CMD với quyền bình thường):
  - npm install -g expo-cli
  - (hoặc nếu bạn không muốn cài global, dùng npx: `npx expo-cli ...` nhưng cài global thường đơn giản hơn)
- Sau khi cài xong, chạy:
  - expo install expo-sqlite
  - expo start

3. Nếu là bare React Native (không dùng Expo)

- Cài sqlite cho RN:
  - npm install react-native-sqlite-storage
  - npx pod-install ios (macOS / iOS)
  - npx react-native run-android (hoặc run-ios)
- Lưu ý: react-native-sqlite-storage cần link native module — nếu RN >= 0.60 thì autolinking; nếu không, follow README của package.

4. Nếu bạn đã cài expo-cli nhưng vẫn báo lỗi

- Đảm bảo folder npm global bin được thêm vào PATH. Kiểm tra:
  - npm root -g (hoặc npm bin -g) để biết thư mục
  - Kiểm tra `expo --version`
- Nếu dùng PowerShell, khởi động lại terminal sau khi cài global.

5. Test nhanh runtime DB

- Nếu dùng Expo: app runtime import `expo-sqlite` (như file src/db/sqlite.ts đã dùng).
- Nếu bare RN: thay file db để dùng react-native-sqlite-storage (tôi có thể cung cấp variant nếu cần).

6. Các lệnh hữu ích

- Kiểm tra package.json:
  - cat package.json
- Cài Expo CLI:
  - npm install -g expo-cli
- Cài expo-sqlite (sau khi có expo):
  - expo install expo-sqlite
- Cài react-native-sqlite-storage:
  - npm install react-native-sqlite-storage
  - npx pod-install ios
  - npx react-native run-android

Nếu muốn, tôi sẽ:

- Cung cấp variant file src/db/sqlite.ts cho react-native-sqlite-storage,
- Hoặc kiểm tra package.json và chỉ dẫn chính xác các lệnh cho dự án của bạn.
