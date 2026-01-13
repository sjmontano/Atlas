@echo off
setlocal enabledelayedexpansion

:: === CONFIGURACIÓN ===
set INKSCAPE=inkscape
set CWEBP=cwebp
set OUTPUT_DIR=output_webp
set TEMP_SUFFIX=-temp
set DPI=96
set QUALITY=90
set ALPHA_QUALITY=100
set METHOD=6
set MULTITHREADING=-mt
set PASSES=10

echo.
echo ===============================================
echo   Iniciando conversion de SVG a WebP (Alta calidad)
echo   Calidad: %QUALITY%%  |  Transparencia: %ALPHA_QUALITY%% 
echo ===============================================
echo.

:: Crear carpeta de salida si no existe
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

:: Recorrer archivos SVG
for %%f in (*.svg) do (
    set "FILENAME=%%~nf"
    set "TEMP_FILE=!FILENAME!%TEMP_SUFFIX%.png"
    echo [INFO] Procesando: %%f

    :: Exportar SVG -> PNG temporal
    "%INKSCAPE%" "%%f" --export-type=png --export-dpi=%DPI% --export-filename="!TEMP_FILE!" >nul 2>&1

    if exist "!TEMP_FILE!" (
        :: Convertir PNG -> WebP
        "%CWEBP%" "!TEMP_FILE!" -q %QUALITY% -alpha_q %ALPHA_QUALITY% -m %METHOD% -pass %PASSES% %MULTITHREADING% -o "%OUTPUT_DIR%\!FILENAME!.webp" >nul 2>&1

        if exist "%OUTPUT_DIR%\!FILENAME!.webp" (
            echo [OK]   Exportado: !FILENAME!.webp
        ) else (
            echo [ERR]  Fallo al exportar WebP: !FILENAME!.webp
        )

        del /f /q "!TEMP_FILE!"
    ) else (
        echo [ERR]  No se pudo exportar PNG de: %%f
    )
)

echo.
echo -----------------------------------------------
echo  Conversion completada. Verifica carpeta "%OUTPUT_DIR%"
echo -----------------------------------------------
pause
