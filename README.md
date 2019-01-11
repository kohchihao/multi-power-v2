## Update `system/build.prop` 

- Make sure `persist.sys.app.rotation=original`
- Restart box 
- Reference : https://forum.odroid.com/viewtopic.php?f=137&t=31013

## Change rotation of android TV Box 
- `adb shell content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0`
-  `adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0`
- Can try with different values like `0,1,2,3`


## Commands i used 
```
./adb connect <ip address>
./adb root
./adb remount
./adb pull /system/build.prop
./adb push build.prop /system/build.prop
./adb reboot
./adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:2
```

## Steps taken to setup box 
- Download my signage app 
- Download TeamViewer Host app 
- Download reboot app https://play.google.com/store/apps/details?id=com.antaresone.quickreboot
- Update `build.prop`
- Disable eco mode on TeamViewer Host App 
- Download open app on boot https://play.google.com/store/apps/details?id=news.androidtv.launchonboot&hl=en&rdid=news.androidtv.launchonboot


## Enable ADB on new rooted device 
```
su
setprop service.adb.tcp.port 5555
stop adbd
start adbd
```

## Disable ADB 
```
setprop service.adb.tcp.port -1
stop adbd
start adbd
```

## Download open app on boot 

https://play.google.com/store/apps/details?id=news.androidtv.launchonboot&hl=en&rdid=news.androidtv.launchonboot

## Reference 
https://forum.pine64.org/showthread.php?tid=6403&page=2

https://stackoverflow.com/questions/25864385/changing-android-device-orientation-with-adb

https://forum.odroid.com/viewtopic.php?f=137&t=31013

