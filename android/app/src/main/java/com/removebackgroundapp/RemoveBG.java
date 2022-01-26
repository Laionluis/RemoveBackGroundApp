package com.removebackgroundapp;

import android.annotation.SuppressLint;
import android.provider.Settings;

import android.content.pm.PackageInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.content.Context;
import android.app.ActivityManager;
import android.content.Intent;
import android.os.Bundle;
import android.app.usage.UsageStatsManager;
import android.app.usage.UsageStats;

import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.SortedMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.lang.System;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import android.os.Bundle;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
import com.chaquo.python.PyObject;


public class RemoveBG extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    RemoveBG(ReactApplicationContext context) {
       super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "RemoveBG";
    }

    @ReactMethod
    public void PythonHelloWorld(Promise response) {
        try {
            String id = getPythonHelloWorld();
            response.resolve(id);
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    private String getPythonHelloWorld(){
        Python python = Python.getInstance();
        PyObject pythonFile = python.getModule("HelloWorld");
        return pythonFile.callAttr("helloworld").toString();
    }
}