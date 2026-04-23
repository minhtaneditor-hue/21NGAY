@echo off
SETLOCAL
cls
echo ==========================================
echo    🚀 HE THONG TU DONG DEPLOY 21NGAY
echo ==========================================
echo.

echo [1/3] Dang kiem tra trang thai Git...
git add .

set /p msg="Nhap ghi chu cho dot update nay (hoac nhan Enter de dung mac dinh): "
if "%msg%"=="" set msg=Update landing page and fixes

echo [2/3] Dang commit va push len GitHub...
git commit -m "%msg%"
git push

echo.
echo [3/3] Dang trien khai len Vercel (Production)...
vercel --prod --yes

echo.
echo ==========================================
echo ✅ HOAN TAT! Website da duoc cap nhat.
echo ==========================================
pause

