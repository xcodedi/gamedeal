"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    withAndroidImagePickerPermissions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get default () {
        return _default;
    },
    get withAndroidImagePickerPermissions () {
        return withAndroidImagePickerPermissions;
    }
});
function _configplugins() {
    const data = require("expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const { Colors } = _configplugins().AndroidConfig;
const pkg = require('../../package.json');
const CAMERA_USAGE = 'Allow $(PRODUCT_NAME) to access your camera';
const MICROPHONE_USAGE = 'Allow $(PRODUCT_NAME) to access your microphone';
const READ_PHOTOS_USAGE = 'Allow $(PRODUCT_NAME) to access your photos';
const withAndroidImagePickerPermissions = (config, { cameraPermission, microphonePermission } = {})=>{
    if (microphonePermission !== false) {
        config = _configplugins().AndroidConfig.Permissions.withPermissions(config, [
            'android.permission.RECORD_AUDIO'
        ]);
    }
    // If the user manually sets any of the permissions to `false`, then we should block the permissions to ensure no
    // package can add them.
    config = _configplugins().AndroidConfig.Permissions.withBlockedPermissions(config, [
        microphonePermission === false && 'android.permission.RECORD_AUDIO',
        cameraPermission === false && 'android.permission.CAMERA'
    ].filter(Boolean));
    // NOTE(EvanBacon): It's unclear if we should block the WRITE_EXTERNAL_STORAGE/READ_EXTERNAL_STORAGE permissions since
    // they're used for many other things besides image picker.
    return config;
};
/**
 * Sets image picker colors in the Android colors.xml resource file
 */ function setImagePickerColors(colors, pickerColors) {
    if (!pickerColors) {
        return colors;
    }
    const colorMapping = {
        cropToolbarColor: 'expoCropToolbarColor',
        cropToolbarIconColor: 'expoCropToolbarIconColor',
        cropToolbarActionTextColor: 'expoCropToolbarActionTextColor',
        cropBackButtonIconColor: 'expoCropBackButtonIconColor',
        cropBackgroundColor: 'expoCropBackgroundColor'
    };
    let result = colors;
    for (const [key, colorName] of Object.entries(colorMapping)){
        const colorValue = pickerColors[key];
        if (colorValue) {
            result = Colors.assignColorValue(result, {
                value: colorValue,
                name: colorName
            });
        }
    }
    return result;
}
const withImagePicker = (config, { photosPermission, cameraPermission, microphonePermission, colors, dark } = {})=>{
    _configplugins().IOSConfig.Permissions.createPermissionsPlugin({
        NSPhotoLibraryUsageDescription: READ_PHOTOS_USAGE,
        NSCameraUsageDescription: CAMERA_USAGE,
        NSMicrophoneUsageDescription: MICROPHONE_USAGE
    })(config, {
        NSPhotoLibraryUsageDescription: photosPermission,
        NSCameraUsageDescription: cameraPermission,
        NSMicrophoneUsageDescription: microphonePermission
    });
    if (microphonePermission !== false) {
        config = _configplugins().AndroidConfig.Permissions.withPermissions(config, [
            'android.permission.RECORD_AUDIO'
        ]);
    }
    // If the user manually sets any of the permissions to `false`, then we should block the permissions to ensure no
    // package can add them.
    config = _configplugins().AndroidConfig.Permissions.withBlockedPermissions(config, [
        microphonePermission === false && 'android.permission.RECORD_AUDIO',
        cameraPermission === false && 'android.permission.CAMERA'
    ].filter(Boolean));
    // NOTE(EvanBacon): It's unclear if we should block the WRITE_EXTERNAL_STORAGE/READ_EXTERNAL_STORAGE permissions since
    // they're used for many other things besides image picker.
    // Apply color configurations for light theme
    config = (0, _configplugins().withAndroidColors)(config, (config)=>{
        config.modResults = setImagePickerColors(config.modResults, colors);
        return config;
    });
    // Apply color configurations for dark theme
    config = (0, _configplugins().withAndroidColorsNight)(config, (config)=>{
        config.modResults = setImagePickerColors(config.modResults, dark?.colors);
        return config;
    });
    return config;
};
const _default = (0, _configplugins().createRunOncePlugin)(withImagePicker, pkg.name, pkg.version);

//# sourceMappingURL=withImagePicker.js.map
