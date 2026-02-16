@echo off
cd /d "C:\Users\0190\my-app"
echo トランス選定システムをEXE化しています...
echo.

REM 必要なライブラリをインストール
echo パッケージをインストール中...
pip install pandas pyinstaller

echo.
echo EXEファイルを作成中...
pyinstaller --onefile --windowed --name "トランス選定システム" transformer_system.py

echo.
echo 完了しました！
echo EXEファイルは dist フォルダ内にあります: トランス選定システム.exe
echo.
pause