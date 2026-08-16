@echo off
set FFMPEG="C:\Users\medha\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe"

echo Optimizing JanSamadhan...
%FFMPEG% -i jansamadhan.mp4 -c:v libvpx-vp9 -b:v 0 -crf 45 -vf "scale=-2:480" -an -y jansamadhan.webm
%FFMPEG% -i jansamadhan.mp4 -vframes 1 -q:v 50 -vf "scale=-2:480" -y jansamadhan-poster.webp

echo Optimizing NyayaAI...
%FFMPEG% -i nyayaai.mp4 -c:v libvpx-vp9 -b:v 0 -crf 45 -vf "scale=-2:480" -an -y nyayaai.webm
%FFMPEG% -i nyayaai.mp4 -vframes 1 -q:v 50 -vf "scale=-2:480" -y nyayaai-poster.webp

echo Done!
pause
