
Start-Process -NoNewWindow -WorkingDirectory "d:\IoT-logger\Server" -FilePath "cmd.exe" -ArgumentList "/c node index.js"

Start-Process -NoNewWindow -WorkingDirectory "d:\IoT-logger\UI" -FilePath "cmd.exe" -ArgumentList "/c npm start"

Start-Process -NoNewWindow -WorkingDirectory "d:\IoT-logger\Simulator" -FilePath "python" -ArgumentList "sensor_simulator.py"