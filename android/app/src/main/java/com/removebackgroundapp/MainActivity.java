package com.removebackgroundapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "RemoveBackGroundApp";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (! Python.isStarted()) {
      Python.start(new AndroidPlatform(this));
    }
  }
}
