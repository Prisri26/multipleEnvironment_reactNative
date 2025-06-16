package com.prithivirajan.baseProjectMultiple;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class RNConfigModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNConfig";
    }

    @ReactMethod
    public void getEnvironment(Promise promise) {
        try {
            String environment = reactContext.getString(R.string.environment);
            promise.resolve(environment);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
} 