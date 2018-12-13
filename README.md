## Update `system/build.prop` 

- Make sure `persist.sys.app.rotation=original`
- Restart box 
- Reference : https://forum.odroid.com/viewtopic.php?f=137&t=31013

## Change rotation of android TV Box 

-  `adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0`
- Can try with different values like `0,1,2,3`


## Commands i used 
```
./adb root
./adb remount
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
- 